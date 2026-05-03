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
  <v-card
    class="trip-card h-100"
    elevation="2"
    :ripple="false"
    style="cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;"
    @click="router.push(`/trips/${trip.id}`)"
  >
    <!-- Cover image -->
    <v-img
      :src="trip.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80'"
      height="200"
      cover
      class="position-relative"
    >
      <div
        style="position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.6));"
      />
      <!-- Template badge -->
      <v-chip
        :color="templateMeta.icon === 'mdi-timeline-outline' ? 'primary' : templateMeta.icon === 'mdi-image-multiple' ? 'secondary' : 'accent'"
        size="small"
        class="position-absolute font-weight-bold"
        style="top: 12px; right: 12px;"
      >
        <v-icon start size="14">{{ templateMeta.icon }}</v-icon>
        {{ templateMeta.label }}
      </v-chip>
      <!-- Destination on image -->
      <div class="position-absolute pa-3" style="bottom: 0; left: 0; right: 0;">
        <div class="text-white font-weight-bold" style="font-size: 1.15rem; text-shadow: 0 1px 4px rgba(0,0,0,0.5);">
          {{ trip.destination }}
        </div>
      </div>
    </v-img>

    <v-card-item>
      <v-card-title class="font-weight-black pa-0" style="font-size: 1.1rem;">
        {{ trip.title }}
      </v-card-title>
      <v-card-subtitle class="pa-0 mt-1">
        <v-icon size="14" class="mr-1">mdi-calendar</v-icon>
        {{ dateRange }}
      </v-card-subtitle>
    </v-card-item>

    <v-card-text class="pt-0">
      <p v-if="trip.description" class="text-medium-emphasis text-body-2 mb-3" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
        {{ trip.description }}
      </p>
      <div class="d-flex align-center gap-3">
        <v-chip size="small" color="primary" variant="tonal">
          <v-icon start size="14">mdi-image-multiple</v-icon>
          {{ memoryCount }} {{ memoryCount === 1 ? 'memory' : 'memories' }}
        </v-chip>
      </div>
    </v-card-text>

    <v-card-actions>
      <v-btn variant="tonal" color="primary" size="small" :to="`/trips/${trip.id}`" @click.stop>
        <v-icon start>mdi-eye</v-icon> View
      </v-btn>
      <v-btn variant="text" color="secondary" size="small" :to="`/trips/${trip.id}/memories/new`" @click.stop>
        <v-icon start>mdi-plus</v-icon> Add Memory
      </v-btn>
      <v-spacer />
      <v-btn icon size="small" variant="text" color="error" @click.stop="deleteTrip">
        <v-icon>mdi-delete-outline</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.trip-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(108, 63, 197, 0.18) !important;
}
</style>
