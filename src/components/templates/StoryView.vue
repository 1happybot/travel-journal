<script setup lang="ts">
import type { Memory } from '@/types'
import { MOOD_META } from '@/types'
import { useMemoriesStore } from '@/stores/memories'

defineProps<{ memories: Memory[]; tripId: string }>()
const memoriesStore = useMemoriesStore()

const rotations = [-3, 2, -1.5, 3, -2, 1, -2.5, 2.5]
function rotation(i: number) { return rotations[i % rotations.length] }
</script>

<template>
  <div class="story-bg py-10">
    <div class="max-w-5xl mx-auto px-4">
      <div class="flex flex-wrap gap-7 justify-center">
        <div
          v-for="(memory, i) in memories" :key="memory.id"
          class="polaroid"
          :style="{ '--rot': `${rotation(i)}deg`, animationDelay: `${i * 100}ms` }"
        >
          <!-- Photo area -->
          <div class="w-full h-48 overflow-hidden bg-gray-100 relative">
            <template v-if="memory.media.length > 0">
              <img v-if="memory.media[0]?.type === 'image'" :src="memory.media[0]?.url" :alt="memory.title" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full bg-gray-900 flex items-center justify-center">
                <span class="text-white text-3xl">▶️</span>
              </div>
            </template>
            <div v-else class="flex items-center justify-center h-full bg-gradient-to-br from-purple-100 to-cyan-100">
              <span class="text-4xl">🖼️</span>
            </div>
            <!-- More media badge -->
            <div v-if="memory.media.length > 1" class="absolute bottom-2 right-2 bg-black/60 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              +{{ memory.media.length - 1 }}
            </div>
            <!-- Mood badge -->
            <div v-if="memory.mood" class="absolute top-2 left-2 text-xl drop-shadow-md">
              {{ MOOD_META[memory.mood].emoji }}
            </div>
          </div>

          <!-- Caption area -->
          <div class="pt-2.5 pb-1">
            <div class="font-caveat text-lg font-semibold text-gray-800 leading-tight">{{ memory.title }}</div>
            <div class="font-caveat text-sm text-gray-400">
              {{ new Date(memory.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}
            </div>
            <div v-if="memory.location" class="text-[0.65rem] text-gray-400 flex items-center gap-0.5 mt-0.5">
              📍 {{ memory.location }}
            </div>
            <p v-if="memory.description" class="font-caveat text-sm text-gray-500 mt-0.5 line-clamp-3">{{ memory.description }}</p>
          </div>

          <!-- Delete btn -->
          <button class="delete-btn" @click="memoriesStore.deleteMemory(memory.id)">×</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.story-bg {
  background:
    radial-gradient(circle at 20% 30%, rgba(108,63,197,0.07) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(0,188,212,0.07) 0%, transparent 50%),
    #faf8ff;
  min-height: 60vh;
}

.polaroid {
  background: white;
  padding: 12px 12px 16px;
  width: 240px;
  box-shadow: 4px 6px 20px rgba(0,0,0,0.14);
  transform: rotate(var(--rot));
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  animation: popIn 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
}

.polaroid:hover {
  transform: rotate(0deg) scale(1.04);
  box-shadow: 8px 12px 40px rgba(108,63,197,0.25);
  z-index: 10;
}

.delete-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 22px;
  height: 22px;
  background: white;
  border: none;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  font-size: 0.75rem;
  color: #F44336;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.polaroid:hover .delete-btn {
  opacity: 1;
}

@keyframes popIn {
  from { opacity: 0; transform: rotate(var(--rot)) scale(0.7); }
  to   { opacity: 1; transform: rotate(var(--rot)) scale(1); }
}
</style>
