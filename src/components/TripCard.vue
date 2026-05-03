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
    class="trip-card group bg-white rounded-sm shadow-[4px_4px_12px_rgba(0,0,0,0.12)] overflow-hidden cursor-pointer transition-all hover:-translate-y-2 hover:shadow-[6px_8px_20px_rgba(0,0,0,0.18)] p-2 sm:p-3"
    @click="router.push(`/trips/${trip.id}`)"
  >
    <!-- Tape decoration -->
    <div class="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-5 bg-yellow-200/80 -rotate-2 z-10 shadow-sm" />

    <!-- Photo -->
    <div class="relative h-44 sm:h-52 overflow-hidden rounded-sm">
      <img
        :src="trip.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80'"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        :alt="trip.title"
      />
      <!-- Template badge -->
      <span class="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-primary text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
        {{ templateMeta.icon }} {{ templateMeta.label }}
      </span>
      <!-- Location stamp -->
      <div class="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full">
        📍 {{ trip.destination }}
      </div>
    </div>

    <!-- Handwritten-style content -->
    <div class="pt-3 px-1">
      <h3 class="font-[var(--font-caveat)] text-xl sm:text-2xl text-gray-900 leading-tight">{{ trip.title }}</h3>
      <div class="text-xs text-gray-400 mt-1 font-medium">📅 {{ dateRange }}</div>
      <p v-if="trip.description" class="text-gray-500 text-xs sm:text-sm mt-2 line-clamp-2 italic">{{ trip.description }}</p>
      <div class="flex items-center gap-2 mt-3 mb-1">
        <span class="bg-primary-light text-primary text-xs font-semibold px-2.5 py-1 rounded-full">
          🖼️ {{ memoryCount }} {{ memoryCount === 1 ? 'memory' : 'memories' }}
        </span>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-1.5 sm:gap-2 pt-2 border-t border-dashed border-gray-200 mt-3">
      <router-link :to="`/trips/${trip.id}`" class="px-2.5 sm:px-3 py-1.5 bg-primary-light text-primary text-xs font-bold rounded-lg hover:bg-primary/20 transition-colors" @click.stop>
        👁️ View
      </router-link>
      <router-link :to="`/trips/${trip.id}/memories/new`" class="px-2.5 sm:px-3 py-1.5 text-secondary text-xs font-bold rounded-lg hover:bg-gray-100 transition-colors" @click.stop>
        + Memory
      </router-link>
      <div class="flex-1" />
      <button class="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg" @click.stop="deleteTrip">
        🗑️
      </button>
    </div>
  </div>
</template>
