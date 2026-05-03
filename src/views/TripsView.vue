<script setup lang="ts">
import { useTripsStore } from '@/stores/trips'
import TripCard from '@/components/TripCard.vue'
import { useRouter } from 'vue-router'

const tripsStore = useTripsStore()
const router = useRouter()
</script>

<template>
  <v-container class="py-8">
    <!-- Header -->
    <v-row align="center" class="mb-6">
      <v-col>
        <h1 class="font-weight-black" style="font-size: 2rem; color: #6C3FC5;">My Trips</h1>
        <p class="text-medium-emphasis">{{ tripsStore.trips.length }} adventure{{ tripsStore.trips.length !== 1 ? 's' : '' }} captured</p>
      </v-col>
      <v-col cols="auto">
        <v-btn
          color="primary"
          rounded="xl"
          prepend-icon="mdi-plus"
          @click="router.push('/trips/new')"
        >
          New Trip
        </v-btn>
      </v-col>
    </v-row>

    <!-- Empty state -->
    <div v-if="tripsStore.trips.length === 0" class="text-center py-16">
      <div style="font-size: 5rem;">🗺️</div>
      <h2 class="font-weight-bold mt-4 mb-2">No trips yet!</h2>
      <p class="text-medium-emphasis mb-6">Start capturing your vacation memories.</p>
      <v-btn color="primary" rounded="xl" size="large" prepend-icon="mdi-airplane-takeoff" @click="router.push('/trips/new')">
        Create your first trip
      </v-btn>
    </div>

    <!-- Trips grid -->
    <v-row v-else>
      <v-col
        v-for="trip in tripsStore.trips"
        :key="trip.id"
        cols="12"
        sm="6"
        lg="4"
      >
        <TripCard :trip="trip" />
      </v-col>
    </v-row>
  </v-container>
</template>
