import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth'
import { auth } from '../main'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value)

  const initialize = () => {
    onAuthStateChanged(auth, (firebaseUser) => {
      user.value = firebaseUser
    })
  }

  const signUp = async (email: string, password: string) => {
    try {
      isLoading.value = true
      error.value = null
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      user.value = userCredential.user
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to sign up'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      isLoading.value = true
      error.value = null
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      user.value = userCredential.user
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to sign in'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  const signOut = async () => {
    try {
      isLoading.value = true
      error.value = null
      await firebaseSignOut(auth)
      user.value = null
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to sign out'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    initialize,
    signUp,
    signIn,
    signOut
  }
})