<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Trip } from '@/types'
import { TEMPLATE_META } from '@/types'
import { useMemoriesStore } from '@/stores/memories'
import { useTripsStore } from '@/stores/trips'

const props = defineProps<{ trip: Trip }>()
const router = useRouter()
const memoriesStore = useMemoriesStore()
const tripsStore = useTripsStore()

const memoryCount = computed(() => memoriesStore.getMemoriesByTrip(props.trip.id).length)
const templateMeta = computed(() => TEMPLATE_META[props.trip.template])

const dateRange = computed(() => {
  const fmt = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  return `${fmt(props.trip.startDate)} – ${fmt(props.trip.endDate)}`
})

function deleteTrip() {
  tripsStore.deleteTrip(props.trip.id)
  memoriesStore.deleteMemoriesByTrip(props.trip.id)
}
</script>

<template>
  <div
    class="trip-card bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl"
    @click="router.push(`/trips/${trip.id}`)"
  >
    <!-- Cover image -->
    <div class="relative h-48 overflow-hidden">
      <img
        :src="trip.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80'"
        class="w-full h-full object-cover"
        :alt="trip.title"
      />
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
      <!-- Template badge -->
      <span class="absolute top-3 right-3 bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-full">
        {{ templateMeta.icon }} {{ templateMeta.label }}
      </span>
      <!-- Destination -->
      <div class="absolute bottom-0 left-0 right-0 p-3">
        <div class="text-white font-bold text-sm" style="text-shadow: 0 1px 4px rgba(0,0,0,0.5);">
          {{ trip.destination }}
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-4">
      <h3 class="font-extrabold text-base mb-0.5 text-gray-900">{{ trip.title }}</h3>
      <div class="text-xs text-gray-500 mb-2">📅 {{ dateRange }}</div>
      <p v-if="trip.description" class="text-gray-500 text-sm mb-3 line-clamp-2">{{ trip.description }}</p>
      <div class="flex items-center gap-2">
        <span class="bg-primary-light text-primary text-xs font-semibold px-2.5 py-1 rounded-full">
          🖼️ {{ memoryCount }} {{ memoryCount === 1 ? 'memory' : 'memories' }}
        </span>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-2 px-4 pb-4">
      <router-link :to="`/trips/${trip.id}`" class="px-3 py-1.5 bg-primary-light text-primary text-xs font-bold rounded-lg hover:bg-primary/20 transition-colors" @click.stop>
        👁️ View
      </router-link>
      <router-link :to="`/trips/${trip.id}/memories/new`" class="px-3 py-1.5 text-secondary text-xs font-bold rounded-lg hover:bg-gray-100 transition-colors" @click.stop>
        + Add Memory
      </router-link>
      <div class="flex-1" />
      <button class="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg" @click.stop="deleteTrip">
        🗑️
      </button>
    </div>
  </div>
</template>
