<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTripsStore } from '@/stores/trips'
import { useMemoriesStore } from '@/stores/memories'
import TemplateSwitcher from '@/components/TemplateSwitcher.vue'
import TimelineView from '@/components/templates/TimelineView.vue'
import GalleryView from '@/components/templates/GalleryView.vue'
import StoryView from '@/components/templates/StoryView.vue'
import JourneyMap from '@/components/JourneyMap.vue'
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
watch(activeTemplate, (val) => { if (trip.value) tripsStore.setTemplate(trip.value.id, val) })

const deleteDialog = ref(false)
function confirmDelete() {
  tripsStore.deleteTrip(tripId.value)
  memoriesStore.deleteMemoriesByTrip(tripId.value)
  router.push('/')
}
</script>

<template>
  <div v-if="trip">
    <!-- Hero header -->
    <div class="relative" style="min-height: 300px;"
      :style="{ background: trip.coverImage ? `url(${trip.coverImage}) center/cover` : 'linear-gradient(135deg, #6C3FC5 0%, #00BCD4 100%)' }">
      <div class="absolute inset-0 bg-gradient-to-b from-black/20 to-black/65" />
      <div class="relative z-10 max-w-5xl mx-auto px-4 pt-20 pb-10">
        <button class="text-white/80 hover:text-white text-sm font-semibold mb-4 inline-block" @click="router.push('/')">
          ← All Trips
        </button>
        <div class="flex items-center flex-wrap gap-2 mb-2">
          <span class="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">📍 {{ trip.destination }}</span>
          <span class="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">
            📅 {{ new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }} – {{ new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}
          </span>
          <span class="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">🖼️ {{ memories.length }} memories</span>
        </div>
        <h1 class="text-white font-extrabold mb-2" style="font-size: clamp(1.8rem, 4vw, 3rem);">{{ trip.title }}</h1>
        <p v-if="trip.description" class="text-white/85 max-w-xl">{{ trip.description }}</p>
        <div class="flex gap-2 mt-3">
          <router-link :to="`/trips/${trip.id}/edit`" class="px-4 py-1.5 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-xl hover:bg-white/30 transition-colors">
            ✏️ Edit
          </router-link>
          <button class="px-4 py-1.5 bg-red-500/80 text-white text-sm font-semibold rounded-xl hover:bg-red-600 transition-colors" @click="deleteDialog = true">
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Template switcher bar -->
    <div class="bg-white border-b border-gray-100 sticky top-16 z-10">
      <div class="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-2">
        <TemplateSwitcher v-model="activeTemplate" />
        <router-link :to="`/trips/${trip.id}/memories/new`" class="px-5 py-2 bg-primary text-white font-bold rounded-xl text-sm hover:bg-primary/90 transition-colors">
          + Add Memory
        </router-link>
      </div>
    </div>

    <!-- Memories content -->
    <div>
      <div v-if="memories.length === 0" class="text-center py-20 max-w-lg mx-auto px-4">
        <div class="text-6xl">📷</div>
        <h2 class="font-bold text-xl mt-4 mb-2">No memories yet</h2>
        <p class="text-gray-500 mb-6">Start adding photos, videos and notes to this trip.</p>
        <router-link :to="`/trips/${trip.id}/memories/new`" class="inline-block px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors">
          + Add First Memory
        </router-link>
      </div>

      <template v-else>
        <transition name="page-transition" mode="out-in">
          <TimelineView v-if="activeTemplate === 'timeline'" key="timeline" :memories="memories" :trip-id="trip.id" />
          <GalleryView v-else-if="activeTemplate === 'gallery'" key="gallery" :memories="memories" :trip-id="trip.id" />
          <StoryView v-else key="story" :memories="memories" :trip-id="trip.id" />
        </transition>

        <!-- Journey Map -->
        <JourneyMap :memories="memories" :destination="trip.destination" />
      </template>
    </div>

    <!-- FAB -->
    <router-link :to="`/trips/${trip.id}/memories/new`"
      class="fixed bottom-8 right-8 z-50 w-14 h-14 bg-primary text-white rounded-full shadow-xl flex items-center justify-center text-2xl hover:scale-110 hover:shadow-2xl transition-all">
      +
    </router-link>

    <!-- Delete confirm dialog -->
    <Transition name="fade">
      <div v-if="deleteDialog" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" @click.self="deleteDialog = false">
        <div class="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
          <h3 class="font-bold text-lg mb-2">Delete Trip?</h3>
          <p class="text-gray-600 text-sm mb-5">
            This will permanently delete <strong>{{ trip.title }}</strong> and all {{ memories.length }} memories. This cannot be undone.
          </p>
          <div class="flex justify-end gap-3">
            <button class="px-4 py-2 text-gray-600 font-medium rounded-xl hover:bg-gray-100 transition-colors" @click="deleteDialog = false">Cancel</button>
            <button class="px-4 py-2 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors" @click="confirmDelete">Delete</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>

  <!-- Trip not found -->
  <div v-else class="text-center py-20">
    <div class="text-5xl">🔍</div>
    <h2 class="mt-4 mb-4 font-bold text-xl">Trip not found</h2>
    <router-link to="/" class="px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors">
      Back to Trips
    </router-link>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
