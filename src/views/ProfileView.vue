<template>
  <main class="container mx-auto px-4 py-8 min-h-screen bg-stone-900">
    <div class="absolute inset-0 bg-noise opacity-10 pointer-events-none"></div>
    <section class="max-w-4xl mx-auto">
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
        <p class="text-stone-400 mt-4">Loading your profile...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="w-24 h-24 mx-auto rounded-full bg-red-900/20 flex items-center justify-center">
          <span class="material-icons text-4xl text-red-400">error_outline</span>
        </div>
        <h2 class="text-2xl font-semibold text-amber-500 mt-4">Error Loading Profile</h2>
        <p class="text-stone-400 mt-2">{{ error }}</p>
        <button @click="loadProfile" class="mt-6 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-stone-900 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
          Try Again
        </button>
      </div>

      <!-- Profile Content -->
      <div v-else-if="authStore.user" class="bg-stone-800 rounded-xl shadow-lg overflow-hidden border border-amber-900/20">
        <div class="bg-gradient-to-r from-amber-600 to-amber-500 h-32 relative">
          <div class="absolute -bottom-16 left-8">
            <div class="w-32 h-32 bg-stone-700 rounded-full border-4 border-stone-800 overflow-hidden">
              <img 
                v-if="authStore.user.photoURL"
                :src="authStore.user.photoURL"
                :alt="authStore.user.displayName || 'Profile'"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full bg-stone-700 flex items-center justify-center">
                <span class="material-icons text-4xl text-amber-500/40">person</span>
              </div>
            </div>
          </div>
        </div>

        <div class="pt-20 px-8 pb-8">
          <div class="flex justify-between items-start mb-6">
            <div>
              <h1 class="text-2xl font-bold text-amber-500">
                {{ authStore.user.displayName || 'Anonymous User' }}
              </h1>
              <p class="text-stone-400">{{ authStore.user.email }}</p>
            </div>
            <div class="space-x-4">
              <button 
                @click="isEditing = true" 
                class="px-4 py-2 bg-stone-700 text-amber-500 rounded-lg hover:bg-stone-600 transition-colors duration-300"
                v-if="!isEditing"
              >
                Edit Profile
              </button>
              <button 
                @click="handleSignOut" 
                class="px-4 py-2 bg-stone-700 text-red-400 rounded-lg hover:bg-red-900/20 transition-colors duration-300"
              >
                Sign Out
              </button>
            </div>
          </div>

          <!-- Edit Profile Form -->
          <form v-if="isEditing" @submit.prevent="handleUpdateProfile" class="mb-8">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-amber-500 mb-1">
                  Display Name
                </label>
                <input
                  v-model="editForm.displayName"
                  type="text"
                  class="w-full px-4 py-2 bg-stone-700 text-stone-200 rounded-lg border border-amber-900/20 focus:outline-none focus:border-amber-500/50"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-amber-500 mb-1">
                  Profile Photo URL
                </label>
                <input
                  v-model="editForm.photoURL"
                  type="url"
                  class="w-full px-4 py-2 bg-stone-700 text-stone-200 rounded-lg border border-amber-900/20 focus:outline-none focus:border-amber-500/50"
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
              <div class="flex gap-4">
                <button 
                  type="submit" 
                  class="px-6 py-2 bg-gradient-to-r from-amber-600 to-amber-500 text-stone-900 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300"
                  :disabled="isLoading"
                >
                  Save Changes
                </button>
                <button 
                  type="button" 
                  class="px-6 py-2 bg-stone-700 text-amber-500 rounded-lg hover:bg-stone-600 transition-colors duration-300"
                  @click="isEditing = false"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>

          <!-- Style Preferences -->
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-amber-500 mb-4">Style Preferences</h2>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="style in preferences.styles"
                :key="style"
                class="px-3 py-1 bg-stone-700 text-amber-500 rounded-full text-sm"
              >
                {{ style }}
              </span>
              <button 
                @click="isEditingPreferences = true"
                class="px-3 py-1 border border-amber-900/20 text-amber-500 rounded-full text-sm hover:bg-stone-700"
              >
                <span class="material-icons text-sm align-middle">add</span>
                Add Style
              </button>
            </div>
          </div>

          <!-- Body Type -->
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-amber-500 mb-4">Body Type</h2>
            <div class="grid grid-cols-2 gap-4">
              <div class="flex items-center gap-4 p-4 bg-stone-700 rounded-lg border border-amber-900/20">
                <span class="material-icons text-amber-500">height</span>
                <div>
                  <p class="text-sm text-stone-400">Height</p>
                  <p class="font-medium text-amber-500">{{ preferences.height || 'Not set' }}</p>
                </div>
              </div>
              <div class="flex items-center gap-4 p-4 bg-stone-700 rounded-lg border border-amber-900/20">
                <span class="material-icons text-amber-500">straighten</span>
                <div>
                  <p class="text-sm text-stone-400">Body Type</p>
                  <p class="font-medium text-amber-500">{{ preferences.bodyType || 'Not set' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-3 gap-4 mb-8">
            <div class="text-center p-4 bg-stone-700 rounded-lg border border-amber-900/20">
              <p class="text-2xl font-bold text-amber-500">{{ stats.outfits }}</p>
              <p class="text-sm text-stone-400">Outfits Created</p>
            </div>
            <div class="text-center p-4 bg-stone-700 rounded-lg border border-amber-900/20">
              <p class="text-2xl font-bold text-amber-500">{{ stats.saved }}</p>
              <p class="text-sm text-stone-400">Saved Looks</p>
            </div>
            <div class="text-center p-4 bg-stone-700 rounded-lg border border-amber-900/20">
              <p class="text-2xl font-bold text-amber-500">{{ stats.shared }}</p>
              <p class="text-sm text-stone-400">Shared Outfits</p>
            </div>
          </div>

          <!-- Settings -->
          <div>
            <h2 class="text-lg font-semibold text-amber-500 mb-4">Settings</h2>
            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 bg-stone-700 rounded-lg border border-amber-900/20">
                <div>
                  <p class="font-medium text-amber-500">Language</p>
                  <p class="text-sm text-stone-400">Change your preferred language</p>
                </div>
                <select v-model="preferences.language" class="px-4 py-2 bg-stone-800 text-amber-500 rounded-lg border border-amber-900/20 focus:outline-none focus:border-amber-500/50">
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                </select>
              </div>
              <div class="flex items-center justify-between p-4 bg-stone-700 rounded-lg border border-amber-900/20">
                <div>
                  <p class="font-medium text-amber-500">Dark Mode</p>
                  <p class="text-sm text-stone-400">Toggle dark mode theme</p>
                </div>
                <button 
                  @click="toggleDarkMode"
                  class="relative inline-flex h-6 w-11 items-center rounded-full"
                  :class="isDarkMode ? 'bg-amber-500' : 'bg-stone-600'"
                >
                  <span class="sr-only">Toggle dark mode</span>
                  <span
                    :class="isDarkMode ? 'translate-x-6 bg-stone-900' : 'translate-x-1 bg-stone-400'"
                    class="inline-block h-4 w-4 transform rounded-full transition"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Not Authenticated -->
      <div v-else class="text-center py-12">
        <span class="material-icons text-6xl text-primary-300">account_circle</span>
        <h2 class="text-2xl font-semibold text-primary-800 mt-4">Sign In Required</h2>
        <p class="text-primary-500 mt-2">Please sign in to view your profile.</p>
        <router-link to="/auth" class="btn-primary inline-block mt-6">
          Sign In
        </router-link>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../main'

const router = useRouter()
const authStore = useAuthStore()
const isLoading = ref(false)
const error = ref<string | null>(null)
const isDarkMode = ref(false)
const isEditing = ref(false)
const isEditingPreferences = ref(false)

interface UserPreferences {
  styles: string[]
  height: string
  bodyType: string
  language: string
}

interface UserStats {
  outfits: number
  saved: number
  shared: number
}

const preferences = ref<UserPreferences>({
  styles: [],
  height: '',
  bodyType: '',
  language: 'en'
})

const stats = ref<UserStats>({
  outfits: 0,
  saved: 0,
  shared: 0
})

const editForm = ref({
  displayName: authStore.user?.displayName || '',
  photoURL: authStore.user?.photoURL || ''
})

const loadProfile = async () => {
  if (!authStore.user) return

  try {
    isLoading.value = true
    error.value = null

    const userDoc = await getDoc(doc(db, 'users', authStore.user.uid))
    
    if (userDoc.exists()) {
      const data = userDoc.data()
      preferences.value = data.preferences || preferences.value
      stats.value = data.stats || stats.value
    } else {
      // Create default profile
      await setDoc(doc(db, 'users', authStore.user.uid), {
        preferences: preferences.value,
        stats: stats.value
      })
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load profile'
  } finally {
    isLoading.value = false
  }
}

const handleUpdateProfile = async () => {
  if (!authStore.user) return

  try {
    isLoading.value = true
    error.value = null

    // Update user profile
    await updateDoc(doc(db, 'users', authStore.user.uid), {
      preferences: preferences.value
    })

    isEditing.value = false
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to update profile'
  } finally {
    isLoading.value = false
  }
}

const handleSignOut = async () => {
  try {
    await authStore.signOut()
    router.push('/')
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to sign out'
  }
}

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.classList.toggle('dark')
}

onMounted(() => {
  if (authStore.user) {
    loadProfile()
  }
})
</script>

<style>
.bg-noise {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}
</style> 