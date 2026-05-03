<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useTripsStore } from '@/stores/trips'

const router = useRouter()
const tripsStore = useTripsStore()

const features = [
  { icon: '🕐', color: 'bg-primary', title: 'Timeline', desc: 'Watch your journey unfold day by day in a beautiful animated timeline.' },
  { icon: '🖼️', color: 'bg-secondary', title: 'Gallery', desc: 'Relive moments through a stunning masonry photo and video gallery.' },
  { icon: '📖', color: 'bg-accent', title: 'Story', desc: 'Craft your memories into a charming polaroid scrapbook.' },
]
</script>

<template>
  <!-- Hero -->
  <div class="gradient-bg min-h-screen flex flex-col">
    <div class="flex-1 flex items-center justify-center px-4" style="min-height: 88vh;">
      <div class="text-center max-w-2xl">
        <div class="text-7xl mb-2">✈️</div>
        <h1 class="text-white font-extrabold mb-4 leading-tight" style="font-size: clamp(2.5rem, 6vw, 4.5rem);">
          Your Adventures,<br />
          <span class="opacity-85">Beautifully Remembered</span>
        </h1>
        <p class="text-white/90 mb-8 text-lg max-w-xl mx-auto">
          Create stunning vacation journals with photos, videos, and memories.
          Choose from Timeline, Gallery, or Story templates.
        </p>
        <div class="flex gap-4 justify-center flex-wrap">
          <button
            class="px-8 py-3.5 bg-white text-primary font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all text-base"
            @click="router.push('/trips/new')"
          >
            ➕ Start Your Journal
          </button>
          <button
            v-if="tripsStore.trips.length > 0"
            class="px-8 py-3.5 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all text-base"
            @click="router.push('/trips')"
          >
            📍 My Trips
          </button>
        </div>
      </div>
    </div>
    <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" class="block -mb-1">
      <path fill="#F8F6FF" d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z"/>
    </svg>
  </div>

  <!-- Features -->
  <div class="max-w-5xl mx-auto px-4 py-16">
    <div class="text-center mb-10">
      <h2 class="font-extrabold text-3xl text-primary mb-2">Three Ways to Tell Your Story</h2>
      <p class="text-gray-500 text-lg">Pick the template that fits your adventure.</p>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div v-for="f in features" :key="f.title" class="bg-white rounded-2xl border border-gray-100 p-6 text-center hover:shadow-lg transition-shadow">
        <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl" :class="f.color">
          {{ f.icon }}
        </div>
        <h3 class="font-bold text-lg mb-2">{{ f.title }}</h3>
        <p class="text-gray-500 text-sm">{{ f.desc }}</p>
      </div>
    </div>
  </div>

  <!-- How it works -->
  <div class="bg-gradient-to-br from-purple-50 to-cyan-50">
    <div class="max-w-4xl mx-auto px-4 py-16">
      <h2 class="font-extrabold text-3xl text-primary text-center mb-10">How It Works</h2>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div v-for="(step, i) in [
          { icon: '🗺️', label: 'Create a Trip', desc: 'Name your adventure and pick a template.' },
          { icon: '📸', label: 'Add Memories', desc: 'Upload photos, videos and notes for each day.' },
          { icon: '🔗', label: 'Relive & Share', desc: 'Browse your memories in beautiful layouts.' },
        ]" :key="i" class="text-center">
          <div class="w-14 h-14 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 text-xl">
            {{ step.icon }}
          </div>
          <div class="font-bold mb-1">{{ step.label }}</div>
          <div class="text-gray-500 text-sm">{{ step.desc }}</div>
        </div>
      </div>
    </div>
  </div>

  <!-- CTA -->
  <div class="max-w-3xl mx-auto px-4 py-16 text-center">
    <h2 class="font-extrabold text-3xl mb-4">Ready to capture your next adventure?</h2>
    <button
      class="px-10 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 hover:shadow-lg transition-all text-base"
      @click="router.push('/trips/new')"
    >
      ✈️ Create Your First Trip
    </button>
  </div>
</template>
