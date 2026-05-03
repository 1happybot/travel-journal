<script setup lang="ts">
import type { Memory } from '@/types'
import { MOOD_META } from '@/types'
import { useMemoriesStore } from '@/stores/memories'

defineProps<{ memories: Memory[]; tripId: string }>()
const memoriesStore = useMemoriesStore()

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

function shortDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 py-8">
    <!-- Timeline line -->
    <div class="relative">
      <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-primary/20" />

      <div
        v-for="(memory, i) in memories" :key="memory.id"
        class="timeline-card relative pl-12 pb-8"
        :style="{ animationDelay: `${i * 80}ms` }"
      >
        <!-- Dot -->
        <div class="absolute left-2.5 top-1 w-3 h-3 rounded-full bg-primary ring-4 ring-primary-light" />

        <!-- Date label -->
        <div class="text-xs text-gray-400 font-medium mb-1.5">{{ shortDate(memory.date) }}</div>

        <!-- Card -->
        <div class="bg-white rounded-2xl shadow-md overflow-hidden">
          <!-- Media strip -->
          <div v-if="memory.media.length > 0" class="flex overflow-x-auto gap-1">
            <div v-for="item in memory.media.slice(0, 4)" :key="item.id" class="flex-shrink-0 w-40 h-28">
              <img v-if="item.type === 'image'" :src="item.url" :alt="item.caption || memory.title" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full bg-gray-900 flex items-center justify-center">
                <span class="text-white text-2xl">▶️</span>
              </div>
            </div>
            <div v-if="memory.media.length > 4" class="flex-shrink-0 w-20 h-28 bg-gray-800 flex items-center justify-center text-white font-bold">
              +{{ memory.media.length - 4 }}
            </div>
          </div>

          <div class="p-4">
            <div class="flex items-center gap-2 mb-1">
              <span v-if="memory.mood" class="text-lg">{{ MOOD_META[memory.mood].emoji }}</span>
              <h3 class="font-bold text-base">{{ memory.title }}</h3>
            </div>
            <div class="text-xs text-gray-400 mb-2">
              📅 {{ fmtDate(memory.date) }}
              <span v-if="memory.location" class="ml-2">📍 {{ memory.location }}</span>
            </div>
            <p v-if="memory.description" class="text-sm text-gray-600">{{ memory.description }}</p>
          </div>

          <div v-if="memory.tags.length > 0" class="flex items-center flex-wrap gap-1 px-4 pb-3">
            <span v-for="tag in memory.tags" :key="tag" class="bg-primary-light text-primary text-[0.65rem] font-semibold px-2 py-0.5 rounded-full">
              # {{ tag }}
            </span>
            <div class="flex-1" />
            <button class="text-gray-400 hover:text-red-500 text-sm transition-colors" @click="memoriesStore.deleteMemory(memory.id)">🗑️</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.timeline-card {
  animation: slideInLeft 0.4s ease both;
}
@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-24px); }
  to   { opacity: 1; transform: translateX(0); }
}
</style>
