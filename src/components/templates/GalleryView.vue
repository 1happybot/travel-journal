<script setup lang="ts">
import { ref } from 'vue'
import type { Memory, MediaItem } from '@/types'
import { MOOD_META } from '@/types'
import { useMemoriesStore } from '@/stores/memories'

defineProps<{ memories: Memory[]; tripId: string }>()
const memoriesStore = useMemoriesStore()

const lightbox = ref<{ open: boolean; item?: MediaItem; memory?: Memory }>({ open: false })

function openLightbox(item: MediaItem, memory: Memory) {
  lightbox.value = { open: true, item, memory }
}
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 py-8">
    <div class="flex flex-col gap-7">
      <div
        v-for="(memory, mi) in memories" :key="memory.id"
        class="gallery-memory"
        :style="{ animationDelay: `${mi * 60}ms` }"
      >
        <!-- Memory header -->
        <div class="flex items-center gap-2 mb-2 px-1">
          <span v-if="memory.mood" class="text-lg">{{ MOOD_META[memory.mood].emoji }}</span>
          <span class="font-bold text-sm">{{ memory.title }}</span>
          <div class="flex-1" />
          <span class="text-xs text-gray-400">
            {{ new Date(memory.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }}
          </span>
          <button class="text-gray-400 hover:text-red-500 text-sm transition-colors" @click="memoriesStore.deleteMemory(memory.id)">🗑️</button>
        </div>

        <!-- Media grid -->
        <div v-if="memory.media.length > 0" class="grid gap-1 rounded-2xl overflow-hidden" style="grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); grid-auto-rows: 200px;">
          <div
            v-for="(item, ii) in memory.media" :key="item.id"
            class="relative cursor-pointer overflow-hidden group"
            :class="{ 'col-span-2': memory.media.length === 1 || (memory.media.length === 3 && ii === 0) }"
            @click="openLightbox(item, memory)"
          >
            <img v-if="item.type === 'image'" :src="item.url" :alt="item.caption || memory.title" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full bg-gray-900 flex items-center justify-center">
              <span class="text-white text-3xl">▶️</span>
            </div>
            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
              <p v-if="item.caption" class="text-white text-xs px-2 mb-1">{{ item.caption }}</p>
              <span class="text-white text-xl">{{ item.type === 'video' ? '▶️' : '🔍' }}</span>
            </div>
          </div>
        </div>

        <!-- No media -->
        <div v-else class="bg-white rounded-2xl border border-gray-100 p-4">
          <p class="text-sm text-gray-600">{{ memory.description }}</p>
        </div>

        <div v-if="memory.location || memory.tags.length" class="flex items-center flex-wrap gap-1 mt-2 px-1">
          <span v-if="memory.location" class="text-[0.65rem] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">📍 {{ memory.location }}</span>
          <span v-for="tag in memory.tags" :key="tag" class="bg-primary-light text-primary text-[0.65rem] font-semibold px-2 py-0.5 rounded-full">
            # {{ tag }}
          </span>
        </div>
      </div>
    </div>
  </div>

  <!-- Lightbox -->
  <Transition name="fade">
    <div v-if="lightbox.open" class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" @click.self="lightbox.open = false">
      <div v-if="lightbox.item" class="relative bg-black rounded-2xl overflow-hidden max-w-4xl w-full max-h-[85vh]">
        <button class="absolute top-3 right-3 z-10 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/80" @click="lightbox.open = false">×</button>
        <img v-if="lightbox.item.type === 'image'" :src="lightbox.item.url" class="w-full max-h-[80vh] object-contain" />
        <video v-else :src="lightbox.item.url" controls class="w-full max-h-[80vh]" />
        <div v-if="lightbox.item.caption || lightbox.memory?.title" class="p-4 bg-white">
          <p class="font-bold text-sm mb-0.5">{{ lightbox.memory?.title }}</p>
          <p v-if="lightbox.item.caption" class="text-gray-500 text-xs">{{ lightbox.item.caption }}</p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.gallery-memory { animation: fadeUp 0.4s ease both; }
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
