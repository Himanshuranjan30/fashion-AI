<template>
  <main class="min-h-screen bg-stone-900 px-4 py-8">
    <div class="absolute inset-0 bg-noise opacity-10 pointer-events-none"></div>
    
    <section class="max-w-5xl mx-auto">
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
        <p class="mt-6 text-xl text-stone-400">Crafting your perfect look...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="w-24 h-24 mx-auto rounded-full bg-red-900/20 flex items-center justify-center">
          <span class="material-icons text-4xl text-red-400">error_outline</span>
        </div>
        <h2 class="mt-6 text-2xl font-semibold text-amber-500">Oops! Something went wrong</h2>
        <p class="mt-2 text-stone-400">{{ error }}</p>
        <button @click="router.go(-1)" class="mt-6 px-6 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 text-stone-900 font-medium shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
          Try Again
        </button>
      </div>

      <!-- Outfit Display -->
      <div v-else-if="currentOutfit" class="space-y-8">
        <!-- Save Button -->
        <div class="flex justify-end">
          <button 
            @click="handleSave" 
            class="group relative px-6 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 text-stone-900 font-medium shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="flex items-center space-x-2">
              <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Saving...</span>
            </span>
            <span v-else class="flex items-center space-x-2">
              <span>Save This Look</span>
              <span class="group-hover:animate-wiggle">💫</span>
            </span>
          </button>
        </div>

        <!-- Base Item -->
        <div class="group relative">
          <div class="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-amber-700/20 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          <div class="relative bg-stone-800 p-8 rounded-xl shadow-xl border border-amber-900/20">
            <h2 class="text-2xl font-bold text-amber-500 mb-6">
              Your Item
            </h2>
            <div class="flex items-start gap-6">
              <div class="w-1/3">
                <div class="aspect-square rounded-lg bg-gradient-to-br from-amber-500/10 to-amber-700/10 flex items-center justify-center">
                  <img 
                    v-if="currentOutfit.baseItem.image" 
                    :src="currentOutfit.baseItem.image" 
                    :alt="currentOutfit.baseItem.name"
                    class="w-full h-full object-cover rounded-lg"
                  />
                  <span v-else class="material-icons text-6xl text-amber-500/30">style</span>
                </div>
              </div>
              <div class="flex-1">
                <h3 class="text-xl font-semibold text-amber-500 mb-2">{{ currentOutfit.baseItem.name }}</h3>
                <p class="text-stone-400 mb-4">{{ currentOutfit.baseItem.description }}</p>
                <p class="text-lg font-medium text-amber-500">${{ currentOutfit.baseItem.price.toFixed(2) }}</p>
                <a 
                  v-if="currentOutfit.baseItem.link" 
                  :href="currentOutfit.baseItem.link" 
                  target="_blank"
                  class="inline-flex items-center space-x-1 text-amber-500 hover:text-amber-400 transition-colors mt-2"
                >
                  <span>Shop Now</span>
                  <span class="material-icons text-sm">open_in_new</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Suggested Items -->
        <div class="group relative">
          <div class="absolute -inset-1 bg-gradient-to-r from-amber-700/20 to-amber-500/20 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          <div class="relative bg-stone-800 p-8 rounded-xl shadow-xl border border-amber-900/20">
            <h2 class="text-2xl font-bold text-amber-500 mb-6">
              Complete The Look
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div 
                v-for="item in currentOutfit.suggestedItems" 
                :key="item.name"
                class="group/item bg-stone-700/50 rounded-lg p-4 hover:shadow-lg transition-all duration-300"
              >
                <div class="aspect-square rounded-lg bg-gradient-to-br from-amber-500/10 to-amber-700/10 flex items-center justify-center mb-4">
                  <img 
                    v-if="item.image" 
                    :src="item.image" 
                    :alt="item.name"
                    class="w-full h-full object-cover rounded-lg"
                  />
                  <span v-else class="material-icons text-4xl text-amber-500/30">style</span>
                </div>
                <h3 class="font-medium text-amber-500 mb-1">{{ item.name }}</h3>
                <p class="text-sm text-stone-400 mb-2">{{ item.description }}</p>
                <p class="text-amber-500 font-medium">${{ item.price.toFixed(2) }}</p>
                <a 
                  v-if="item.link" 
                  :href="item.link" 
                  target="_blank"
                  class="inline-flex items-center space-x-1 text-amber-500 hover:text-amber-400 transition-colors mt-2 text-sm"
                >
                  <span>Shop Now</span>
                  <span class="material-icons text-xs">open_in_new</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Style Options -->
        <div class="group relative">
          <div class="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-amber-700/20 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          <div class="relative bg-stone-800 p-8 rounded-xl shadow-xl border border-amber-900/20">
            <h2 class="text-2xl font-bold text-amber-500 mb-6">
              Switch Up The Vibe
            </h2>
            <div class="flex flex-wrap gap-3">
              <button
                v-for="styleOption in ['y2k', 'streetwear', 'cottagecore', 'minimalist', 'grunge', 'cyber']"
                :key="styleOption"
                @click="changeStyle(styleOption)"
                class="px-4 py-2 rounded-full font-medium transition-all duration-300"
                :class="[
                  currentOutfit.style === styleOption
                    ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-stone-900 shadow-md'
                    : 'bg-stone-700 text-stone-400 hover:bg-stone-600 hover:text-amber-500'
                ]"
                :disabled="isLoading"
              >
                {{ styleOption.charAt(0).toUpperCase() + styleOption.slice(1) }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <div class="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-amber-500/20 to-amber-700/20 flex items-center justify-center">
          <span class="material-icons text-4xl text-amber-500/40">style</span>
        </div>
        <h2 class="mt-6 text-2xl font-semibold text-amber-500">No Outfit Generated Yet</h2>
        <p class="mt-2 text-stone-400">Start by describing an item or uploading an image</p>
        <router-link 
          to="/" 
          class="inline-block mt-6 px-6 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 text-stone-900 font-medium shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
        >
          Get Started
        </router-link>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useOutfitStore } from '../stores/outfit'
import { storeToRefs } from 'pinia'

const router = useRouter()
const outfitStore = useOutfitStore()
const { currentOutfit, isLoading, error } = storeToRefs(outfitStore)

const handleSave = async () => {
  try {
    await outfitStore.saveOutfit()
    router.push('/saved')
  } catch (e) {
    console.error(e)
  }
}

const changeStyle = async (newStyle: string) => {
  if (!currentOutfit.value?.baseItem.description) return
  
  try {
    await outfitStore.generateOutfit(currentOutfit.value.baseItem.description, newStyle)
  } catch (e) {
    console.error(e)
  }
}
</script>

<style>
.bg-noise {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}
</style> 