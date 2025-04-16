import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../main'

export interface OutfitItem {
  type: 'top' | 'bottom' | 'shoes' | 'accessory'
  name: string
  description: string
  price: number
  link?: string
  image?: string
}

export interface Outfit {
  id?: string
  baseItem: OutfitItem
  suggestedItems: OutfitItem[]
  style: string
  createdAt: Date
}

// Fallback outfit suggestions
const fallbackOutfits: Record<string, Array<Omit<Outfit, 'id' | 'createdAt'>>> = {
  casual: [
    {
      baseItem: {
        type: 'top' as const,
        name: 'Classic White T-Shirt',
        description: 'Soft cotton crew neck tee in pure white',
        price: 25
      },
      suggestedItems: [
        {
          type: 'bottom' as const,
          name: 'Vintage Blue Jeans',
          description: 'High-waisted straight leg denim',
          price: 75
        },
        {
          type: 'shoes' as const,
          name: 'White Canvas Sneakers',
          description: 'Classic low-top sneakers',
          price: 60
        },
        {
          type: 'accessory' as const,
          name: 'Silver Chain Necklace',
          description: 'Minimalist layered chain',
          price: 35
        }
      ],
      style: 'casual'
    }
  ],
  formal: [
    {
      baseItem: {
        type: 'top' as const,
        name: 'Black Blazer',
        description: 'Fitted single-breasted blazer in premium wool blend',
        price: 120
      },
      suggestedItems: [
        {
          type: 'bottom' as const,
          name: 'Tailored Black Pants',
          description: 'Slim-fit dress pants with subtle stretch',
          price: 85
        },
        {
          type: 'shoes' as const,
          name: 'Leather Oxford Shoes',
          description: 'Classic black leather oxfords',
          price: 150
        },
        {
          type: 'accessory' as const,
          name: 'Leather Belt',
          description: 'Black leather belt with silver buckle',
          price: 45
        }
      ],
      style: 'formal'
    }
  ],
  streetwear: [
    {
      baseItem: {
        type: 'top' as const,
        name: 'Oversized Graphic Hoodie',
        description: 'Cotton blend hoodie with urban print',
        price: 65
      },
      suggestedItems: [
        {
          type: 'bottom' as const,
          name: 'Cargo Pants',
          description: 'Relaxed fit cargo pants with multiple pockets',
          price: 80
        },
        {
          type: 'shoes' as const,
          name: 'High-top Sneakers',
          description: 'Limited edition high-tops in black and neon',
          price: 110
        },
        {
          type: 'accessory' as const,
          name: 'Beanie',
          description: 'Ribbed beanie in charcoal grey',
          price: 25
        }
      ],
      style: 'streetwear'
    }
  ]
}

export const useOutfitStore = defineStore('outfit', () => {
  const currentOutfit = ref<Outfit | null>(null)
  const savedOutfits = ref<Outfit[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isUsingFallback = ref(false)

  const getFallbackOutfit = (style: string) => {
    const styleOutfits = fallbackOutfits[style as keyof typeof fallbackOutfits] || fallbackOutfits.casual
    return styleOutfits[Math.floor(Math.random() * styleOutfits.length)]
  }

  const generateOutfit = async (description: string, style: string = 'casual') => {
    try {
      isLoading.value = true
      error.value = null
      isUsingFallback.value = false

      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo-0125',
            messages: [{
              role: 'system',
              content: `You are a fashion expert AI that suggests complete outfits. Always respond with valid JSON in this format:
{
  "baseItem": {
    "type": "top|bottom|shoes|accessory",
    "name": "string",
    "description": "string",
    "price": number,
    "link": "string (optional)",
    "image": "string (optional)"
  },
  "suggestedItems": [
    {
      "type": "top|bottom|shoes|accessory",
      "name": "string",
      "description": "string",
      "price": number,
      "link": "string (optional)",
      "image": "string (optional)"
    }
  ]
}`
            }, {
              role: 'user',
              content: `Create a complete ${style} outfit based on this item: ${description}. Include 3-4 suggested items that would go well with it. Be specific with item descriptions and realistic with prices.`
            }],
            temperature: 0.7,
            max_tokens: 500
          })
        })

        if (!response.ok) {
          throw new Error('API request failed')
        }

        const data = await response.json()
        if (!data.choices?.[0]?.message?.content) {
          throw new Error('Invalid response from OpenAI')
        }

        const outfitSuggestion = JSON.parse(data.choices[0].message.content)
        currentOutfit.value = {
          baseItem: outfitSuggestion.baseItem,
          suggestedItems: outfitSuggestion.suggestedItems,
          style,
          createdAt: new Date()
        }
      } catch (apiError) {
        console.warn('OpenAI API failed, using fallback suggestions:', apiError)
        isUsingFallback.value = true
        const fallbackOutfit = getFallbackOutfit(style)
        currentOutfit.value = {
          ...fallbackOutfit,
          style,
          createdAt: new Date()
        }
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to generate outfit'
    } finally {
      isLoading.value = false
    }
  }

  const saveOutfit = async () => {
    if (!currentOutfit.value) return

    try {
      isLoading.value = true
      error.value = null

      const docRef = await addDoc(collection(db, 'outfits'), {
        ...currentOutfit.value,
        createdAt: new Date()
      })

      const savedOutfit = {
        ...currentOutfit.value,
        id: docRef.id
      }

      savedOutfits.value.push(savedOutfit)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to save outfit'
    } finally {
      isLoading.value = false
    }
  }

  const loadSavedOutfits = async () => {
    try {
      isLoading.value = true
      error.value = null

      const outfitsRef = collection(db, 'outfits')
      const q = query(outfitsRef)
      const querySnapshot = await getDocs(q)

      savedOutfits.value = querySnapshot.docs.map(doc => ({
        ...(doc.data() as Omit<Outfit, 'id'>),
        id: doc.id
      }))
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load outfits'
    } finally {
      isLoading.value = false
    }
  }

  const deleteOutfit = async (id: string) => {
    try {
      isLoading.value = true
      error.value = null

      await deleteDoc(doc(db, 'outfits', id))
      savedOutfits.value = savedOutfits.value.filter(outfit => outfit.id !== id)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to delete outfit'
    } finally {
      isLoading.value = false
    }
  }

  return {
    currentOutfit,
    savedOutfits,
    isLoading,
    error,
    isUsingFallback,
    generateOutfit,
    saveOutfit,
    loadSavedOutfits,
    deleteOutfit
  }
})