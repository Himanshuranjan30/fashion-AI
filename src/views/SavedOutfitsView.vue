<template>
  <main class="container mx-auto px-4 py-8 min-h-screen bg-stone-900">
    <div class="absolute inset-0 bg-noise opacity-10 pointer-events-none"></div>
    <section class="max-w-6xl mx-auto">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h1 class="text-4xl font-bold text-amber-500">
          Your Vibe Archive ✨
        </h1>
        <router-link 
          to="/" 
          class="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-stone-900 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
        >
          <span class="material-icons">add</span>
          Create New Fit
        </router-link>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-amber-500 to-amber-700 animate-pulse-slow">
          <div class="w-full h-full rounded-full bg-stone-800/90 flex items-center justify-center">
            <svg class="animate-spin h-12 w-12 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
        <p class="text-stone-400 mt-4 font-medium">Loading your fits...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="w-24 h-24 mx-auto rounded-full bg-red-900/20 flex items-center justify-center">
          <span class="material-icons text-4xl text-red-400">error_outline</span>
        </div>
        <h2 class="text-2xl font-bold text-amber-500 mt-4">Oops! Something's Not Vibing</h2>
        <p class="text-stone-400 mt-2">{{ error }}</p>
        <button 
          @click="loadSavedOutfits" 
          class="mt-6 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-stone-900 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
        >
          Try Again
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="savedOutfits.length === 0" class="text-center py-12">
        <div class="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-amber-500/20 to-amber-700/20 flex items-center justify-center">
          <span class="material-icons text-6xl text-amber-500/40">style</span>
        </div>
        <h2 class="text-2xl font-bold text-amber-500 mt-4">No Fits Saved Yet</h2>
        <p class="text-stone-400 mt-2">Time to create your first iconic look! 💅</p>
        <router-link 
          to="/" 
          class="inline-block mt-6 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-stone-900 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
        >
          Start Creating
        </router-link>
      </div>

      <!-- Outfits Grid -->
      <div v-else class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="outfit in savedOutfits"
          :key="outfit.id"
          class="group bg-stone-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-amber-900/20"
        >
          <div class="aspect-video bg-stone-700 relative">
            <div class="absolute inset-0 grid grid-cols-4 gap-1 p-2">
              <div class="bg-stone-800 rounded-lg overflow-hidden shadow-sm">
                <img 
                  v-if="outfit.baseItem.image"
                  :src="outfit.baseItem.image"
                  :alt="outfit.baseItem.name"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center text-amber-500/40">
                  <span class="material-icons text-2xl">style</span>
                </div>
              </div>
              <template v-for="item in outfit.suggestedItems.slice(0, 3)" :key="item.name">
                <div class="bg-stone-800 rounded-lg overflow-hidden shadow-sm">
                  <img 
                    v-if="item.image"
                    :src="item.image"
                    :alt="item.name"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center text-amber-500/40">
                    <span class="material-icons text-2xl">style</span>
                  </div>
                </div>
              </template>
            </div>
            <button
              @click="handleDeleteOutfit(outfit.id)"
              class="absolute top-2 right-2 p-2 bg-stone-800 rounded-full shadow-md hover:bg-red-900/20 disabled:opacity-50 transition-colors duration-300"
              :disabled="isLoading"
            >
              <span class="material-icons text-red-400">delete</span>
            </button>
          </div>
          
          <div class="p-6">
            <div class="flex items-center gap-2 mb-2">
              <h3 class="font-bold text-amber-500">
                {{ outfit.baseItem.name }}
              </h3>
              <span class="px-3 py-1 bg-gradient-to-r from-amber-600 to-amber-500 text-stone-900 text-xs rounded-full font-medium">
                {{ outfit.style }}
              </span>
            </div>
            <p class="text-stone-400 text-sm mb-4">
              {{ outfit.baseItem.description }}
            </p>
            
            <div class="flex flex-wrap gap-2">
              <span
                v-for="item in outfit.suggestedItems"
                :key="item.name"
                class="px-3 py-1 bg-stone-700 text-amber-500 text-sm rounded-full font-medium"
              >
                {{ item.name }}
              </span>
            </div>

            <div class="mt-6 flex justify-between items-center">
              <button
                @click="handleShareOutfit(outfit)"
                class="flex items-center gap-1 px-4 py-2 text-amber-500 hover:text-amber-400 transition-colors duration-300"
              >
                <span class="material-icons text-sm">share</span>
                Share
              </button>
              <router-link
                :to="{ name: 'outfit', params: { id: outfit.id }}"
                class="flex items-center gap-1 text-amber-500 hover:text-amber-400 transition-colors duration-300 group"
              >
                View Details
                <span class="material-icons text-sm transform group-hover:translate-x-1 transition-transform duration-300">
                  arrow_forward
                </span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useOutfitStore } from '../stores/outfit'
import { storeToRefs } from 'pinia'
import type { Outfit } from '../stores/outfit'

const outfitStore = useOutfitStore()
const { savedOutfits, isLoading, error } = storeToRefs(outfitStore)

const handleDeleteOutfit = async (id: string | undefined) => {
  if (!id) return
  await outfitStore.deleteOutfit(id)
}

const handleShareOutfit = async (outfit: Outfit) => {
  const text = `Check out this outfit I created with FashionFit!\n\n` +
    `Base Item: ${outfit.baseItem.name}\n` +
    `Style: ${outfit.style}\n` +
    `Suggested Items:\n${outfit.suggestedItems.map(item => `- ${item.name}`).join('\n')}`

  try {
    await navigator.clipboard.writeText(text)
    alert('Outfit details copied to clipboard!')
  } catch (e) {
    console.error('Failed to copy to clipboard:', e)
    alert('Failed to copy outfit details to clipboard')
  }
}

const loadSavedOutfits = () => {
  outfitStore.loadSavedOutfits()
}

onMounted(() => {
  loadSavedOutfits()
})
</script>

<style>
.bg-noise {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}
</style> 