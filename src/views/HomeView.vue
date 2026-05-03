<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useTripsStore } from '@/stores/trips'

const router = useRouter()
const tripsStore = useTripsStore()

const features = [
  {
    icon: 'mdi-timeline-outline',
    color: 'primary',
    title: 'Timeline',
    desc: 'Watch your journey unfold day by day in a beautiful animated timeline.',
  },
  {
    icon: 'mdi-image-multiple',
    color: 'secondary',
    title: 'Gallery',
    desc: 'Relive moments through a stunning masonry photo and video gallery.',
  },
  {
    icon: 'mdi-book-open-variant',
    color: 'accent',
    title: 'Story',
    desc: 'Craft your memories into a charming polaroid scrapbook.',
  },
]
</script>

<template>
  <!-- Hero -->
  <div class="gradient-bg" style="min-height: 100vh; display: flex; flex-direction: column;">
    <v-container class="flex-grow-1 d-flex align-center justify-center" style="min-height: 88vh;">
      <v-row justify="center" align="center">
        <v-col cols="12" md="8" class="text-center">
          <div style="font-size: 5rem; margin-bottom: 8px;">✈️</div>
          <h1
            class="text-white font-weight-black mb-4"
            style="font-size: clamp(2.5rem, 6vw, 4.5rem); line-height: 1.1;"
          >
            Your Adventures,<br />
            <span style="opacity: 0.85;">Beautifully Remembered</span>
          </h1>
          <p class="text-white mb-8" style="font-size: 1.25rem; opacity: 0.9; max-width: 560px; margin: 0 auto 2rem;">
            Create stunning vacation journals with photos, videos, and memories. 
            Choose from Timeline, Gallery, or Story templates.
          </p>
          <div class="d-flex gap-4 justify-center flex-wrap">
            <v-btn
              size="x-large"
              color="white"
              rounded="xl"
              class="text-primary font-weight-bold px-8"
              elevation="4"
              @click="router.push('/trips/new')"
            >
              <v-icon start>mdi-plus-circle</v-icon>
              Start Your Journal
            </v-btn>
            <v-btn
              v-if="tripsStore.trips.length > 0"
              size="x-large"
              variant="outlined"
              color="white"
              rounded="xl"
              class="font-weight-bold px-8"
              @click="router.push('/trips')"
            >
              <v-icon start>mdi-map-marker-multiple</v-icon>
              My Trips
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- Wave divider -->
    <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" style="display:block; margin-bottom: -4px;">
      <path fill="#F8F6FF" d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z"/>
    </svg>
  </div>

  <!-- Features -->
  <v-container class="py-16">
    <v-row justify="center">
      <v-col cols="12" class="text-center mb-8">
        <h2 class="font-weight-black mb-2" style="font-size: 2rem; color: #6C3FC5;">
          Three Ways to Tell Your Story
        </h2>
        <p class="text-medium-emphasis" style="font-size: 1.1rem;">
          Pick the template that fits your adventure.
        </p>
      </v-col>
      <v-col
        v-for="f in features"
        :key="f.title"
        cols="12"
        sm="4"
      >
        <v-card class="pa-6 text-center h-100" elevation="0" border>
          <v-avatar :color="f.color" size="64" class="mb-4">
            <v-icon size="32" color="white">{{ f.icon }}</v-icon>
          </v-avatar>
          <h3 class="font-weight-bold mb-2" style="font-size: 1.3rem;">{{ f.title }}</h3>
          <p class="text-medium-emphasis">{{ f.desc }}</p>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <!-- How it works -->
  <div style="background: linear-gradient(135deg, #F3EEFF 0%, #E0F7FA 100%);">
    <v-container class="py-16">
      <v-row justify="center">
        <v-col cols="12" class="text-center mb-8">
          <h2 class="font-weight-black mb-2" style="font-size: 2rem; color: #6C3FC5;">
            How It Works
          </h2>
        </v-col>
        <v-col cols="12" sm="3" v-for="(step, i) in [
          { icon: 'mdi-map-plus',      label: 'Create a Trip',     desc: 'Name your adventure and pick a template.' },
          { icon: 'mdi-camera-plus',   label: 'Add Memories',      desc: 'Upload photos, videos and notes for each day.' },
          { icon: 'mdi-share-variant', label: 'Relive & Share',    desc: 'Browse your memories in beautiful layouts.' },
        ]" :key="i" class="text-center">
          <v-avatar color="primary" size="56" class="mb-3">
            <v-icon color="white">{{ step.icon }}</v-icon>
          </v-avatar>
          <div class="font-weight-bold mb-1">{{ step.label }}</div>
          <div class="text-medium-emphasis text-body-2">{{ step.desc }}</div>
        </v-col>
      </v-row>
    </v-container>
  </div>

  <!-- CTA -->
  <v-container class="py-16 text-center">
    <h2 class="font-weight-black mb-4" style="font-size: 2rem;">
      Ready to capture your next adventure?
    </h2>
    <v-btn
      size="x-large"
      color="primary"
      rounded="xl"
      class="px-10 font-weight-bold"
      @click="router.push('/trips/new')"
    >
      <v-icon start>mdi-airplane-takeoff</v-icon>
      Create Your First Trip
    </v-btn>
  </v-container>
</template>
