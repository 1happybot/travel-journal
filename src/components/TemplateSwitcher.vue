<script setup lang="ts">
import type { TripTemplate } from '@/types'
import { TEMPLATE_META } from '@/types'

defineProps<{ modelValue: TripTemplate }>()
const emit = defineEmits<{ 'update:modelValue': [value: TripTemplate] }>()

const templates = Object.entries(TEMPLATE_META) as [TripTemplate, typeof TEMPLATE_META[TripTemplate]][]
</script>

<template>
  <div class="inline-flex rounded-xl border border-gray-200 overflow-hidden">
    <button
      v-for="[key, meta] in templates" :key="key"
      class="px-4 py-2 text-sm font-semibold transition-colors"
      :class="modelValue === key ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'"
      @click="emit('update:modelValue', key)"
    >
      {{ meta.icon }} {{ meta.label }}
    </button>
  </div>
</template>
