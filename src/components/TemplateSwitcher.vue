<script setup lang="ts">
import type { TripTemplate } from '@/types'
import { TEMPLATE_META } from '@/types'

defineProps<{ modelValue: TripTemplate }>()
const emit = defineEmits<{ 'update:modelValue': [value: TripTemplate] }>()

const templates = Object.entries(TEMPLATE_META) as [TripTemplate, typeof TEMPLATE_META[TripTemplate]][]
</script>

<template>
  <v-btn-group rounded="xl" variant="outlined" density="comfortable">
    <v-btn
      v-for="[key, meta] in templates"
      :key="key"
      :color="modelValue === key ? 'primary' : undefined"
      :variant="modelValue === key ? 'flat' : 'text'"
      :prepend-icon="meta.icon"
      @click="emit('update:modelValue', key)"
    >
      {{ meta.label }}
    </v-btn>
  </v-btn-group>
</template>
