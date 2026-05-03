<script setup lang="ts">
import type { MemoryMood } from '@/types'
import { MOOD_META } from '@/types'

defineProps<{ modelValue?: MemoryMood }>()
const emit = defineEmits<{ 'update:modelValue': [mood: MemoryMood | undefined] }>()

const moods = Object.entries(MOOD_META) as [MemoryMood, typeof MOOD_META[MemoryMood]][]

function select(mood: MemoryMood) {
  emit('update:modelValue', mood)
}
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <button
      v-for="[key, meta] in moods"
      :key="key"
      type="button"
      class="mood-btn"
      :class="{ 'mood-btn--active': modelValue === key }"
      @click="select(key)"
    >
      <span class="mood-emoji">{{ meta.emoji }}</span>
      <span class="mood-label">{{ meta.label }}</span>
    </button>
  </div>
</template>

<style scoped>
.mood-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 14px;
  border-radius: 16px;
  border: 2px solid #e0d5f5;
  background: white;
  cursor: pointer;
  transition: all 0.18s;
  font-family: 'Nunito', sans-serif;
}
.mood-btn:hover {
  border-color: #6C3FC5;
  transform: translateY(-2px);
}
.mood-btn--active {
  border-color: #6C3FC5;
  background: #f0e8ff;
}
.mood-emoji {
  font-size: 1.6rem;
}
.mood-label {
  font-size: 0.72rem;
  font-weight: 600;
  color: #555;
}
</style>
