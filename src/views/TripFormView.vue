<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTripsStore } from '@/stores/trips'
import type { TripTemplate } from '@/types'
import { TEMPLATE_META } from '@/types'

const router = useRouter()
const route = useRoute()
const tripsStore = useTripsStore()

const tripId = computed(() => route.params.id as string | undefined)
const isEdit = computed(() => !!tripId.value)
const existingTrip = computed(() => tripId.value ? tripsStore.getTrip(tripId.value) : undefined)

const title = ref('')
const destination = ref('')
const description = ref('')
const startDate = ref('')
const endDate = ref('')
const template = ref<TripTemplate>('timeline')
const coverImage = ref<string | undefined>()
const coverPreview = ref<string | undefined>()

onMounted(() => {
  if (existingTrip.value) {
    const t = existingTrip.value
    title.value = t.title
    destination.value = t.destination
    description.value = t.description
    startDate.value = t.startDate
    endDate.value = t.endDate
    template.value = t.template
    coverImage.value = t.coverImage
    coverPreview.value = t.coverImage
  }
})

const templates = Object.entries(TEMPLATE_META) as [TripTemplate, typeof TEMPLATE_META[TripTemplate]][]

function onCoverFile(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    coverImage.value = ev.target?.result as string
    coverPreview.value = ev.target?.result as string
  }
  reader.readAsDataURL(file)
}

function submit() {
  if (!title.value || !destination.value || !startDate.value || !endDate.value) return
  const data = {
    title: title.value,
    destination: destination.value,
    description: description.value,
    startDate: startDate.value,
    endDate: endDate.value,
    template: template.value,
    coverImage: coverImage.value,
  }
  if (isEdit.value && tripId.value) {
    tripsStore.updateTrip(tripId.value, data)
    router.push(`/trips/${tripId.value}`)
  } else {
    const trip = tripsStore.addTrip(data)
    router.push(`/trips/${trip.id}`)
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 py-8">
    <button class="text-primary font-semibold text-sm mb-4 hover:underline" @click="router.back()">← Back</button>

    <h1 class="font-extrabold text-3xl text-primary mb-6">
      {{ isEdit ? 'Edit Trip' : '✈️ New Trip' }}
    </h1>

    <form @submit.prevent="submit" class="space-y-5">
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1">Trip Title</label>
        <input v-model="title" type="text" placeholder="e.g. Summer in Santorini" required
          class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" />
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1">Destination</label>
        <input v-model="destination" type="text" placeholder="e.g. Santorini, Greece" required
          class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Start Date</label>
          <input v-model="startDate" type="date" required
            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" />
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">End Date</label>
          <input v-model="endDate" type="date" required
            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" />
        </div>
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1">Description</label>
        <textarea v-model="description" rows="3" placeholder="Describe your trip..."
          class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition resize-y"></textarea>
      </div>

      <!-- Cover image -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">Cover Image</label>
        <div v-if="coverPreview" class="mb-3 rounded-xl overflow-hidden">
          <img :src="coverPreview" class="w-full h-44 object-cover" />
        </div>
        <button type="button" class="px-4 py-2 bg-primary-light text-primary font-semibold rounded-xl text-sm hover:bg-primary/20 transition-colors"
          @click="($refs.coverInput as HTMLInputElement).click()">
          {{ coverPreview ? '🔄 Change Cover' : '🖼️ Upload Cover Image' }}
        </button>
        <input ref="coverInput" type="file" accept="image/*" class="hidden" @change="onCoverFile" />
      </div>

      <!-- Template -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-3">Display Template</label>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button type="button"
            v-for="[key, meta] in templates" :key="key"
            class="p-4 rounded-xl border-2 text-center transition-all cursor-pointer"
            :class="template === key ? 'border-primary bg-primary text-white' : 'border-gray-200 hover:border-primary/40'"
            @click="template = key">
            <div class="text-2xl mb-1">{{ meta.icon }}</div>
            <div class="font-bold text-sm">{{ meta.label }}</div>
            <div class="text-xs mt-0.5" :class="template === key ? 'text-white/80' : 'text-gray-400'">{{ meta.description }}</div>
          </button>
        </div>
      </div>

      <button type="submit"
        class="w-full py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-base"
        :disabled="!title || !destination || !startDate || !endDate">
        {{ isEdit ? '💾 Save Changes' : '✈️ Create Trip' }}
      </button>
    </form>
  </div>
</template>
