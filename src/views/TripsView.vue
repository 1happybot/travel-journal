<script setup lang="ts">
import { useTripsStore } from '@/stores/trips'
import TripCard from '@/components/TripCard.vue'
import { useRouter } from 'vue-router'

const tripsStore = useTripsStore()
const router = useRouter()
</script>

<template>
  <div class="min-h-[calc(100vh-4rem)] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiNlMGQ4ZjAiLz48L3N2Zz4=')] p-4 sm:p-8">
    <!-- Scrapbook header -->
    <div class="max-w-6xl mx-auto mb-6 sm:mb-8">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 class="font-[var(--font-caveat)] text-4xl sm:text-5xl text-primary -rotate-1">My Adventures</h1>
          <p class="text-gray-500 text-sm sm:text-base ml-1 mt-1">{{ tripsStore.trips.length }} adventure{{ tripsStore.trips.length !== 1 ? 's' : '' }} pinned ✨</p>
        </div>
        <button
          class="self-start sm:self-auto px-5 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary/90 hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm sm:text-base rotate-1"
          @click="router.push('/trips/new')"
        >
          📌 Pin New Trip
        </button>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="tripsStore.trips.length === 0" class="text-center py-16 sm:py-20 px-4">
      <div class="text-6xl sm:text-7xl">🗺️</div>
      <h2 class="font-[var(--font-caveat)] text-2xl sm:text-3xl mt-4 mb-2">No trips pinned yet!</h2>
      <p class="text-gray-500 mb-6 text-sm sm:text-base">Start capturing your vacation memories.</p>
      <button class="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors" @click="router.push('/trips/new')">
        ✈️ Create your first trip
      </button>
    </div>

    <!-- Scrapbook grid -->
    <div v-else class="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      <TripCard
        v-for="(trip, i) in tripsStore.trips"
        :key="trip.id"
        :trip="trip"
        :class="[
          i % 5 === 0 ? 'rotate-1' : '',
          i % 5 === 1 ? '-rotate-2' : '',
          i % 5 === 2 ? 'rotate-[0.5deg]' : '',
          i % 5 === 3 ? '-rotate-1' : '',
          i % 5 === 4 ? 'rotate-[1.5deg]' : '',
        ]"
      />
    </div>
  </div>
</template>
