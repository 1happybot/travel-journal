<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTripsStore } from '@/stores/trips'
import { useMemoriesStore } from '@/stores/memories'
import TemplateSwitcher from '@/components/TemplateSwitcher.vue'
import TimelineView from '@/components/templates/TimelineView.vue'
import GalleryView from '@/components/templates/GalleryView.vue'
import StoryView from '@/components/templates/StoryView.vue'
import type { TripTemplate } from '@/types'

const route = useRoute()
const router = useRouter()
const tripsStore = useTripsStore()
const memoriesStore = useMemoriesStore()

const tripId = computed(() => route.params.id as string)
const trip = computed(() => tripsStore.getTrip(tripId.value))
const memories = computed(() => memoriesStore.getMemoriesByTrip(tripId.value))

const activeTemplate = ref<TripTemplate>('timeline')

watch(trip, (t) => { if (t) activeTemplate.value = t.template }, { immediate: true })

watch(activeTemplate, (val) => {
  if (trip.value) tripsStore.setTemplate(trip.value.id, val)
})

const deleteDialog = ref(false)
function confirmDelete() {
  tripsStore.deleteTrip(tripId.value)
  memoriesStore.deleteMemoriesByTrip(tripId.value)
  router.push('/trips')
}
</script>

<template>
  <div v-if="trip">
    <!-- Parallax hero header -->
    <div
      class="trip-hero position-relative"
      :style="{
        background: trip.coverImage
          ? `url(${trip.coverImage}) center/cover`
          : 'linear-gradient(135deg, #6C3FC5 0%, #00BCD4 100%)',
        minHeight: '300px',
      }"
    >
      <div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.2),rgba(0,0,0,0.65));" />
      <v-container class="position-relative" style="z-index:1; padding-top: 80px; padding-bottom: 40px;">
        <v-btn
          variant="text"
          color="white"
          class="mb-4"
          prepend-icon="mdi-arrow-left"
          @click="router.push('/trips')"
        >
          All Trips
        </v-btn>
        <div class="d-flex align-center flex-wrap gap-2 mb-2">
          <v-chip color="white" variant="tonal" size="small">
            <v-icon start size="14">mdi-map-marker</v-icon>
            {{ trip.destination }}
          </v-chip>
          <v-chip color="white" variant="tonal" size="small">
            <v-icon start size="14">mdi-calendar</v-icon>
            {{ new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }}
            –
            {{ new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}
          </v-chip>
          <v-chip color="white" variant="tonal" size="small">
            <v-icon start size="14">mdi-image-multiple</v-icon>
            {{ memories.length }} memories
          </v-chip>
        </div>
        <h1 class="text-white font-weight-black mb-2" style="font-size: clamp(1.8rem, 4vw, 3rem);">
          {{ trip.title }}
        </h1>
        <p v-if="trip.description" class="text-white mb-0" style="opacity:0.85; max-width: 600px;">
          {{ trip.description }}
        </p>
        <div class="d-flex gap-2 mt-3">
          <v-btn size="small" variant="tonal" color="white" :to="`/trips/${trip.id}/edit`" prepend-icon="mdi-pencil">
            Edit
          </v-btn>
          <v-btn size="small" variant="tonal" color="error" prepend-icon="mdi-delete-outline" @click="deleteDialog = true">
            Delete
          </v-btn>
        </div>
      </v-container>
    </div>

    <!-- Template switcher bar -->
    <div style="background: white; border-bottom: 1px solid rgba(0,0,0,0.08); position: sticky; top: 64px; z-index: 10;">
      <v-container class="py-3 d-flex align-center justify-space-between flex-wrap gap-2">
        <TemplateSwitcher v-model="activeTemplate" />
        <v-btn color="primary" rounded="xl" prepend-icon="mdi-plus" :to="`/trips/${trip.id}/memories/new`">
          Add Memory
        </v-btn>
      </v-container>
    </div>

    <!-- Memories content -->
    <div>
      <!-- Empty state -->
      <v-container v-if="memories.length === 0" class="text-center py-16">
        <div style="font-size: 4rem;">📷</div>
        <h2 class="font-weight-bold mt-4 mb-2">No memories yet</h2>
        <p class="text-medium-emphasis mb-6">Start adding photos, videos and notes to this trip.</p>
        <v-btn color="primary" rounded="xl" size="large" prepend-icon="mdi-plus" :to="`/trips/${trip.id}/memories/new`">
          Add First Memory
        </v-btn>
      </v-container>

      <template v-else>
        <transition name="page-transition" mode="out-in">
          <TimelineView v-if="activeTemplate === 'timeline'" :key="'timeline'" :memories="memories" :trip-id="trip.id" />
          <GalleryView  v-else-if="activeTemplate === 'gallery'" :key="'gallery'" :memories="memories" :trip-id="trip.id" />
          <StoryView    v-else :key="'story'" :memories="memories" :trip-id="trip.id" />
        </transition>
      </template>
    </div>

    <!-- FAB -->
    <v-btn
      icon
      color="primary"
      size="x-large"
      elevation="6"
      :to="`/trips/${trip.id}/memories/new`"
      style="position: fixed; bottom: 32px; right: 32px; z-index: 100;"
    >
      <v-icon size="28">mdi-plus</v-icon>
    </v-btn>

    <!-- Delete confirm dialog -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card rounded="xl">
        <v-card-title class="pa-6 font-weight-bold">Delete Trip?</v-card-title>
        <v-card-text class="px-6">
          This will permanently delete <strong>{{ trip.title }}</strong> and all {{ memories.length }} memories. This cannot be undone.
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" variant="flat" rounded="xl" @click="confirmDelete">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>

  <!-- Trip not found -->
  <v-container v-else class="text-center py-16">
    <div style="font-size: 3rem;">🔍</div>
    <h2 class="mt-4 mb-2">Trip not found</h2>
    <v-btn color="primary" to="/trips">Back to Trips</v-btn>
  </v-container>
</template>
