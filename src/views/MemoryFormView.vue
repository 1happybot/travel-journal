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
  <v-container class="py-8" style="max-width: 680px;">
    <v-btn variant="text" color="primary" class="mb-4" prepend-icon="mdi-arrow-left" @click="router.back()">
      Back
    </v-btn>

    <h1 class="font-weight-black mb-1" style="font-size: 2rem; color: #6C3FC5;">
      📷 New Memory
    </h1>
    <p v-if="trip" class="text-medium-emphasis mb-6">
      Adding to <strong>{{ trip.title }}</strong>
    </p>

    <v-form @submit.prevent="submit">
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="title"
            label="Memory Title"
            placeholder="e.g. Sunset at Oia"
            prepend-inner-icon="mdi-pencil"
            required
          />
        </v-col>

        <v-col cols="12" sm="6">
          <v-text-field
            v-model="date"
            label="Date"
            type="date"
            prepend-inner-icon="mdi-calendar"
            required
          />
        </v-col>

        <v-col cols="12" sm="6">
          <v-text-field
            v-model="location"
            label="Location (optional)"
            placeholder="e.g. Oia, Santorini"
            prepend-inner-icon="mdi-map-marker"
          />
        </v-col>

        <v-col cols="12">
          <v-textarea
            v-model="description"
            label="Description"
            placeholder="Describe this moment..."
            rows="3"
            auto-grow
            prepend-inner-icon="mdi-text"
          />
        </v-col>

        <!-- Mood picker -->
        <v-col cols="12">
          <p class="font-weight-semibold mb-3">How were you feeling?</p>
          <MoodPicker v-model="mood" />
        </v-col>

        <!-- Tags -->
        <v-col cols="12">
          <v-text-field
            v-model="tagInput"
            label="Tags (press Enter to add)"
            placeholder="e.g. beach, sunset, food"
            prepend-inner-icon="mdi-tag"
            @keydown="onTagKey"
            @blur="addTag"
          />
          <div v-if="tags.length" class="d-flex flex-wrap gap-1 mt-1">
            <v-chip
              v-for="tag in tags"
              :key="tag"
              closable
              size="small"
              color="primary"
              variant="tonal"
              @click:close="removeTag(tag)"
            >
              # {{ tag }}
            </v-chip>
          </div>
        </v-col>

        <!-- Media uploader -->
        <v-col cols="12">
          <p class="font-weight-semibold mb-3">Photos & Videos</p>
          <MediaUploader v-model="media" />
        </v-col>

        <v-col cols="12" class="pt-4">
          <v-btn
            type="submit"
            color="primary"
            size="large"
            block
            rounded="xl"
            class="font-weight-bold"
            :disabled="!title || !date"
          >
            <v-icon start>mdi-check-circle</v-icon>
            Save Memory
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>
