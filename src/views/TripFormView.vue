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
  <v-container class="py-8" style="max-width: 680px;">
    <v-btn variant="text" color="primary" class="mb-4" prepend-icon="mdi-arrow-left" @click="router.back()">
      Back
    </v-btn>

    <h1 class="font-weight-black mb-6" style="font-size: 2rem; color: #6C3FC5;">
      {{ isEdit ? 'Edit Trip' : '✈️ New Trip' }}
    </h1>

    <v-form @submit.prevent="submit">
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="title"
            label="Trip Title"
            placeholder="e.g. Summer in Santorini"
            prepend-inner-icon="mdi-pencil"
            required
          />
        </v-col>

        <v-col cols="12">
          <v-text-field
            v-model="destination"
            label="Destination"
            placeholder="e.g. Santorini, Greece"
            prepend-inner-icon="mdi-map-marker"
            required
          />
        </v-col>

        <v-col cols="12" sm="6">
          <v-text-field
            v-model="startDate"
            label="Start Date"
            type="date"
            prepend-inner-icon="mdi-calendar-start"
            required
          />
        </v-col>

        <v-col cols="12" sm="6">
          <v-text-field
            v-model="endDate"
            label="End Date"
            type="date"
            prepend-inner-icon="mdi-calendar-end"
            required
          />
        </v-col>

        <v-col cols="12">
          <v-textarea
            v-model="description"
            label="Description"
            placeholder="Describe your trip..."
            rows="3"
            auto-grow
            prepend-inner-icon="mdi-text"
          />
        </v-col>

        <!-- Cover image -->
        <v-col cols="12">
          <p class="font-weight-semibold mb-2">Cover Image</p>
          <v-card v-if="coverPreview" class="mb-3" rounded="xl" elevation="0">
            <v-img :src="coverPreview" height="180" cover rounded="xl" />
          </v-card>
          <v-btn variant="tonal" color="primary" prepend-icon="mdi-image-plus" @click="($refs.coverInput as HTMLInputElement).click()">
            {{ coverPreview ? 'Change Cover' : 'Upload Cover Image' }}
          </v-btn>
          <input ref="coverInput" type="file" accept="image/*" style="display:none" @change="onCoverFile" />
        </v-col>

        <!-- Template -->
        <v-col cols="12">
          <p class="font-weight-semibold mb-3">Display Template</p>
          <v-row>
            <v-col
              v-for="[key, meta] in templates"
              :key="key"
              cols="12"
              sm="4"
            >
              <v-card
                :color="template === key ? 'primary' : undefined"
                :variant="template === key ? 'flat' : 'outlined'"
                class="pa-4 text-center"
                style="cursor: pointer; transition: all 0.2s;"
                rounded="xl"
                @click="template = key"
              >
                <v-icon :color="template === key ? 'white' : 'primary'" size="32" class="mb-2">
                  {{ meta.icon }}
                </v-icon>
                <div :class="template === key ? 'text-white' : ''" class="font-weight-bold">{{ meta.label }}</div>
                <div :class="template === key ? 'text-white' : 'text-medium-emphasis'" class="text-caption">
                  {{ meta.description }}
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" class="pt-4">
          <v-btn
            type="submit"
            color="primary"
            size="large"
            block
            rounded="xl"
            class="font-weight-bold"
            :disabled="!title || !destination || !startDate || !endDate"
          >
            <v-icon start>{{ isEdit ? 'mdi-content-save' : 'mdi-airplane-takeoff' }}</v-icon>
            {{ isEdit ? 'Save Changes' : 'Create Trip' }}
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>
