<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const drawer = ref(false)
const router = useRouter()

const navItems = [
  { title: 'My Trips', icon: '📍', to: '/' },
]
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- Navbar -->
    <nav class="sticky top-0 z-50 bg-primary text-white shadow-md">
      <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <button class="md:hidden p-2 rounded-lg hover:bg-white/10" @click="drawer = !drawer">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
        <span class="font-extrabold text-xl tracking-wide cursor-pointer select-none" @click="router.push('/')">
          ✈️ TripMemories
        </span>
        <div class="hidden md:flex items-center gap-1">
          <router-link
            v-for="item in navItems" :key="item.to" :to="item.to"
            class="px-4 py-2 rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors"
          >{{ item.icon }} {{ item.title }}</router-link>
          <router-link to="/trips/new" class="ml-2 px-4 py-2 rounded-xl text-sm font-bold border border-white/60 hover:bg-white hover:text-primary transition-colors">
            + New Trip
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Mobile drawer overlay -->
    <Transition name="fade">
      <div v-if="drawer" class="fixed inset-0 bg-black/40 z-40 md:hidden" @click="drawer = false" />
    </Transition>

    <!-- Mobile drawer -->
    <Transition name="slide">
      <div v-if="drawer" class="fixed top-0 left-0 bottom-0 w-72 bg-white shadow-2xl z-50 md:hidden">
        <div class="p-5 border-b border-gray-100">
          <div class="font-extrabold text-lg text-primary">✈️ TripMemories</div>
          <div class="text-sm text-gray-400">Your vacation journal</div>
        </div>
        <nav class="p-3 flex flex-col gap-1">
          <router-link
            v-for="item in navItems" :key="item.to" :to="item.to"
            class="px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-primary-light transition-colors"
            @click="drawer = false"
          >{{ item.icon }} {{ item.title }}</router-link>
          <hr class="my-2 border-gray-100" />
          <router-link to="/trips/new" class="px-4 py-3 rounded-xl text-sm font-bold text-primary hover:bg-primary-light transition-colors" @click="drawer = false">
            ➕ New Trip
          </router-link>
        </nav>
      </div>
    </Transition>

    <main>
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-enter-active, .slide-leave-active { transition: transform 0.25s ease; }
.slide-enter-from, .slide-leave-to { transform: translateX(-100%); }
</style>

