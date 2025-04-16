<template>
  <main class="min-h-screen bg-stone-900 px-4 py-8">
    <div class="absolute inset-0 bg-noise opacity-10 pointer-events-none"></div>
    
    <section class="max-w-5xl mx-auto">
      <!-- Header Section -->
      <div class="text-center mb-12 relative">
        <h1 class="text-6xl font-bold text-amber-500">
          Style Lab AI
        </h1>
        <p class="mt-4 text-xl text-stone-400">
          Your AI-powered fashion bestie ✨
        </p>
      </div>
      
      <div class="grid gap-8 md:grid-cols-2">
        <!-- Text Input Section -->
        <div class="group relative">
          <div class="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-amber-700/20 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          <div class="relative bg-stone-800 p-8 rounded-xl shadow-xl border border-amber-900/20">
            <h2 class="text-2xl font-bold text-amber-500 mb-6">
              Describe Your Vibe
            </h2>
            <div class="space-y-6">
              <div class="relative">
                <input
                  v-model="clothingDescription"
                  type="text"
                  placeholder="e.g., Y2K crop top with butterfly print"
                  class="w-full px-4 py-3 rounded-lg bg-stone-700 text-stone-200 placeholder-stone-400 border border-amber-900/20 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all duration-300"
                  :disabled="isLoading"
                />
                <span class="absolute right-3 top-3 text-amber-500/40">✨</span>
              </div>
              
              <select 
                v-model="style" 
                class="w-full px-4 py-3 rounded-lg bg-stone-700 text-stone-200 border border-amber-900/20 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all duration-300"
                :disabled="isLoading"
              >
                <option value="y2k">Y2K Vibes</option>
                <option value="streetwear">Street Style</option>
                <option value="cottagecore">Cottagecore</option>
                <option value="minimalist">Clean Girl</option>
                <option value="grunge">Alt/Grunge</option>
                <option value="cyber">Cyber Y2K</option>
              </select>
              
              <button 
                @click="generateOutfit" 
                class="w-full group relative px-8 py-4 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 text-stone-900 font-medium shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                :disabled="isLoading || !clothingDescription"
              >
                <span v-if="isLoading" class="flex items-center justify-center space-x-2">
                  <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating magic...</span>
                </span>
                <span v-else class="flex items-center justify-center space-x-2">
                  <span>Get Outfit Inspo</span>
                  <span class="group-hover:animate-wiggle">🌟</span>
                </span>
              </button>
            </div>
          </div>
        </div>

        <!-- Image Upload Section -->
        <div class="group relative">
          <div class="absolute -inset-1 bg-gradient-to-r from-amber-700/20 to-amber-500/20 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          <div class="relative bg-stone-800 p-8 rounded-xl shadow-xl border border-amber-900/20">
            <h2 class="text-2xl font-bold text-amber-500 mb-6">
              Drop Your Inspo
            </h2>
            <div
              class="relative border-2 border-dashed border-amber-500/30 rounded-lg p-8 text-center transition-all duration-300 hover:border-amber-500/50"
              @drop.prevent="handleDrop"
              @dragover.prevent
              :class="{ 'opacity-50': isLoading }"
            >
              <input
                type="file"
                ref="fileInput"
                class="hidden"
                accept="image/*"
                @change="handleFileSelect"
                :disabled="isLoading"
              />
              <div class="space-y-4">
                <div class="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-500/10 to-amber-700/10 flex items-center justify-center">
                  <span class="material-icons text-3xl text-amber-500">cloud_upload</span>
                </div>
                <button
                  @click="() => fileInput?.click()"
                  class="px-6 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 text-stone-900 font-medium shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  :disabled="isLoading"
                >
                  Choose File
                </button>
                <p class="text-stone-400 text-sm">
                  or drag and drop your image here
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mt-6 p-4 rounded-lg bg-red-900/20 border border-red-500/20">
        <p class="text-red-400 text-sm">{{ error }}</p>
      </div>

      <!-- Fun Facts Section -->
      <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="(fact, index) in funFacts" :key="index" 
          class="p-6 rounded-xl bg-stone-800 border border-amber-900/20 hover:scale-[1.02] transition-all duration-300"
        >
          <div class="text-2xl mb-2">{{ fact.emoji }}</div>
          <h3 class="font-medium text-amber-500">{{ fact.title }}</h3>
          <p class="text-sm text-stone-400">{{ fact.description }}</p>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useOutfitStore } from '../stores/outfit'
import { storeToRefs } from 'pinia'

const router = useRouter()
const outfitStore = useOutfitStore()
const { isLoading, error } = storeToRefs(outfitStore)

const clothingDescription = ref('')
const style = ref('y2k')
const fileInput = ref<HTMLInputElement>()

const funFacts = [
  {
    emoji: '🌈',
    title: 'AI-Powered Style',
    description: 'Our AI understands the latest trends and your unique style preferences'
  },
  {
    emoji: '🌱',
    title: 'Sustainable Fashion',
    description: 'Get suggestions for eco-friendly and sustainable fashion choices'
  },
  {
    emoji: '✨',
    title: 'Mix & Match',
    description: 'Create endless combinations with pieces you already own'
  }
]

const generateOutfit = async () => {
  if (!clothingDescription.value) return
  
  try {
    await outfitStore.generateOutfit(clothingDescription.value, style.value)
    router.push('/outfit/new')
  } catch (e) {
    console.error(e)
  }
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    handleImage(target.files[0])
  }
}

const handleDrop = (event: DragEvent) => {
  const file = event.dataTransfer?.files[0]
  if (file) {
    handleImage(file)
  }
}

const handleImage = async (file: File) => {
  try {
    const formData = new FormData()
    formData.append('image', file)
    
    const response = await fetch('https://api.cloudinary.com/v1_1/your-cloud-name/upload', {
      method: 'POST',
      body: formData
    })
    
    const data = await response.json()
    const imageUrl = data.secure_url
    
    await outfitStore.generateOutfit(`Image URL: ${imageUrl}`, style.value)
    router.push('/outfit/new')
  } catch (e) {
    console.error('Failed to process image:', e)
  }
}
</script>

<style>
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

/* Add noise texture */
.bg-noise {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}
</style> 