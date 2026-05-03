<script setup lang="ts">
import { useTripsStore } from '@/stores/trips'
import TripCard from '@/components/TripCard.vue'
import { useRouter } from 'vue-router'

const tripsStore = useTripsStore()
const router = useRouter()
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="font-extrabold text-3xl text-primary">My Trips</h1>
        <p class="text-gray-500">{{ tripsStore.trips.length }} adventure{{ tripsStore.trips.length !== 1 ? 's' : '' }} captured</p>
      </div>
      <button class="px-5 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors" @click="router.push('/trips/new')">
        + New Trip
      </button>
    </div>

    <!-- Empty state -->
    <div v-if="tripsStore.trips.length === 0" class="text-center py-20">
      <div class="text-7xl">🗺️</div>
      <h2 class="font-bold text-xl mt-4 mb-2">No trips yet!</h2>
      <p class="text-gray-500 mb-6">Start capturing your vacation memories.</p>
      <button class="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors" @click="router.push('/trips/new')">
        ✈️ Create your first trip
      </button>
    </div>

    <!-- Trips grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <TripCard v-for="trip in tripsStore.trips" :key="trip.id" :trip="trip" />
    </div>
  </div>
</template>
