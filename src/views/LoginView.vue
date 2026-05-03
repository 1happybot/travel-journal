<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const password = ref('')
const error = ref(false)

function unlock() {
  if (password.value === 'akshay') {
    sessionStorage.setItem('tripmemories_auth', '1')
    router.replace('/')
  } else {
    error.value = true
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-[var(--color-background)] px-4">
    <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm text-center">
      <div class="text-5xl mb-4">🔒</div>
      <h1 class="text-2xl font-extrabold text-primary mb-2">TripMemories</h1>
      <p class="text-gray-500 mb-6">Enter password to continue</p>
      <form @submit.prevent="unlock" class="space-y-4">
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          autofocus
          class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-center text-lg"
          :class="{ 'border-red-400 ring-2 ring-red-100': error }"
          @input="error = false"
        />
        <p v-if="error" class="text-red-500 text-sm">Incorrect password</p>
        <button
          type="submit"
          class="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors"
        >
          Unlock
        </button>
      </form>
    </div>
  </div>
</template>
