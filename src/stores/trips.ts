import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { Trip, TripTemplate } from '@/types'

const STORAGE_KEY = 'wanderlog_trips'

function load(): Trip[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

export const useTripsStore = defineStore('trips', () => {
  const trips = ref<Trip[]>(load())

  watch(trips, (val) => localStorage.setItem(STORAGE_KEY, JSON.stringify(val)), { deep: true })

  function addTrip(data: Omit<Trip, 'id' | 'createdAt'>): Trip {
    const trip = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...data } as Trip
    trips.value.unshift(trip)
    return trip
  }

  function updateTrip(id: string, data: Partial<Omit<Trip, 'id' | 'createdAt'>>) {
    const i = trips.value.findIndex((t) => t.id === id)
    if (i !== -1) trips.value[i] = { ...trips.value[i], ...data } as Trip
  }

  function deleteTrip(id: string) {
    trips.value = trips.value.filter((t) => t.id !== id)
  }

  function getTrip(id: string): Trip | undefined {
    return trips.value.find((t) => t.id === id)
  }

  function setTemplate(id: string, template: TripTemplate) {
    updateTrip(id, { template })
  }

  return { trips, addTrip, updateTrip, deleteTrip, getTrip, setTemplate }
})
