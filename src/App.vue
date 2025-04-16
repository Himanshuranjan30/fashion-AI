<template>
  <div class="min-h-screen bg-stone-900">
    <!-- Navigation -->
    <nav class="bg-stone-800 border-b border-amber-900/20">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <router-link to="/" class="text-xl font-bold text-amber-500">
            FashionFit
          </router-link>

          <div class="flex items-center gap-6">
            <router-link
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              class="text-stone-400 hover:text-amber-500 transition-colors"
              :class="{ 'text-amber-500 font-medium': isCurrentRoute(item.path) }"
            >
              {{ item.name }}
            </router-link>

            <button
              @click="toggleDarkMode"
              class="p-2 text-stone-400 hover:text-amber-500 transition-colors"
            >
              <span class="material-icons">
                {{ isDarkMode ? 'light_mode' : 'dark_mode' }}
              </span>
            </button>

            <router-link
              to="/profile"
              class="flex items-center gap-2 text-stone-400 hover:text-amber-500 transition-colors"
            >
              <span class="material-icons">account_circle</span>
              <span>Profile</span>
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <router-view v-slot="{ Component }">
      <transition
        name="fade"
        mode="out-in"
        @before-leave="beforeLeave"
        @enter="enter"
        @after-enter="afterEnter"
      >
        <component :is="Component" />
      </transition>
    </router-view>

    <!-- Footer -->
    <footer class="bg-stone-800 border-t border-amber-900/20 mt-12">
      <div class="container mx-auto px-4 py-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 class="text-lg font-semibold text-amber-500 mb-4">FashionFit</h3>
            <p class="text-stone-400">
              AI-powered fashion assistant helping you create perfect outfits.
            </p>
          </div>
          
          <div>
            <h4 class="text-amber-500 font-medium mb-4">Features</h4>
            <ul class="space-y-2">
              <li>
                <a href="#" class="text-stone-400 hover:text-amber-500 transition-colors">Outfit Generator</a>
              </li>
              <li>
                <a href="#" class="text-stone-400 hover:text-amber-500 transition-colors">Style Quiz</a>
              </li>
              <li>
                <a href="#" class="text-stone-400 hover:text-amber-500 transition-colors">Saved Looks</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 class="text-amber-500 font-medium mb-4">Company</h4>
            <ul class="space-y-2">
              <li>
                <a href="#" class="text-stone-400 hover:text-amber-500 transition-colors">About Us</a>
              </li>
              <li>
                <a href="#" class="text-stone-400 hover:text-amber-500 transition-colors">Blog</a>
              </li>
              <li>
                <a href="#" class="text-stone-400 hover:text-amber-500 transition-colors">Contact</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 class="text-amber-500 font-medium mb-4">Legal</h4>
            <ul class="space-y-2">
              <li>
                <a href="#" class="text-stone-400 hover:text-amber-500 transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" class="text-stone-400 hover:text-amber-500 transition-colors">Terms of Service</a>
              </li>
            </ul>
          </div>
        </div>

        <div class="mt-8 pt-8 border-t border-amber-900/20 text-center text-stone-400">
          <p>&copy; {{ new Date().getFullYear() }} FashionFit. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isDarkMode = ref(false)

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Saved Outfits', path: '/saved' }
]

const isCurrentRoute = (path: string) => route.path === path

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  // TODO: Implement dark mode toggle logic
}

// Page transition handlers
const beforeLeave = (el: Element) => {
  el.classList.add('opacity-0')
}

const enter = (el: Element) => {
  el.classList.remove('opacity-0')
}

const afterEnter = (el: Element) => {
  el.classList.add('opacity-100')
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>