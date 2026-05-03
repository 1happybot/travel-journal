<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTripsStore } from '@/stores/trips'
import { useMemoriesStore } from '@/stores/memories'
import MediaUploader from '@/components/MediaUploader.vue'
import MoodPicker from '@/components/MoodPicker.vue'
import type { MediaItem, MemoryMood } from '@/types'

const router = useRouter()
const route = useRoute()
const tripsStore = useTripsStore()
const memoriesStore = useMemoriesStore()

const tripId = computed(() => route.params.id as string)
const trip = computed(() => tripsStore.getTrip(tripId.value))

const title = ref('')
const description = ref('')
const date = ref(new Date().toISOString().split('T')[0])
const location = ref('')
const mood = ref<MemoryMood | undefined>()
const tagInput = ref('')
const tags = ref<string[]>([])
const media = ref<MediaItem[]>([])

function addTag() {
  const t = tagInput.value.trim().toLowerCase()
  if (t && !tags.value.includes(t)) tags.value.push(t)
  tagInput.value = ''
}

function removeTag(tag: string) {
  tags.value = tags.value.filter((t) => t !== tag)
}

function onTagKey(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault()
    addTag()
  }
}

function submit() {
  if (!title.value || !date.value) return
  memoriesStore.addMemory({
    tripId: tripId.value,
    title: title.value,
    description: description.value,
    date: date.value,
    location: location.value || undefined,
    mood: mood.value,
    tags: tags.value,
    media: media.value,
  })
  router.push(`/trips/${tripId.value}`)
}
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 py-8">
    <button class="text-primary font-semibold text-sm mb-4 hover:underline" @click="router.back()">← Back</button>

    <h1 class="font-extrabold text-3xl text-primary mb-1">📷 New Memory</h1>
    <p v-if="trip" class="text-gray-500 mb-6">Adding to <strong>{{ trip.title }}</strong></p>

    <form @submit.prevent="submit" class="space-y-5">
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1">Memory Title</label>
        <input v-model="title" type="text" placeholder="e.g. Sunset at Oia" required
          class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Date</label>
          <input v-model="date" type="date" required
            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" />
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Location (optional)</label>
          <input v-model="location" type="text" placeholder="e.g. Oia, Santorini"
            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" />
        </div>
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1">Description</label>
        <textarea v-model="description" rows="3" placeholder="Describe this moment..."
          class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition resize-y"></textarea>
      </div>

      <!-- Mood picker -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-3">How were you feeling?</label>
        <MoodPicker v-model="mood" />
      </div>

      <!-- Tags -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1">Tags (press Enter to add)</label>
        <input v-model="tagInput" type="text" placeholder="e.g. beach, sunset, food"
          class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
          @keydown="onTagKey" @blur="addTag" />
        <div v-if="tags.length" class="flex flex-wrap gap-1.5 mt-2">
          <span v-for="tag in tags" :key="tag"
            class="inline-flex items-center gap-1 px-3 py-1 bg-primary-light text-primary text-xs font-semibold rounded-full">
            # {{ tag }}
            <button type="button" class="ml-0.5 hover:text-red-500" @click="removeTag(tag)">×</button>
          </span>
        </div>
      </div>

      <!-- Media uploader -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-3">Photos & Videos</label>
        <MediaUploader v-model="media" />
      </div>

      <button type="submit"
        class="w-full py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-base"
        :disabled="!title || !date">
        ✅ Save Memory
      </button>
    </form>
  </div>
</template>
