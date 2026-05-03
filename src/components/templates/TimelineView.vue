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
  <div class="max-w-4xl mx-auto px-4 py-8">
    <!-- Journey title -->
    <div class="text-center mb-10">
      <div class="inline-block px-4 py-1 bg-primary/10 rounded-full text-primary text-sm font-semibold mb-2">🗺️ Journey Timeline</div>
      <p class="text-gray-400 text-sm">Scroll through your adventure, one moment at a time</p>
    </div>

    <!-- Alternating timeline -->
    <div class="relative">
      <!-- Central spine -->
      <div class="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/60 via-secondary/40 to-accent/60 hidden md:block" />
      <!-- Mobile spine -->
      <div class="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary/60 via-secondary/40 to-accent/60 md:hidden" />

      <div
        v-for="(memory, i) in memories" :key="memory.id"
        class="timeline-entry relative mb-12 md:mb-16"
        :class="i % 2 === 0 ? 'md:pr-[52%]' : 'md:pl-[52%]'"
        :style="{ animationDelay: `${i * 120}ms` }"
      >
        <!-- Central node -->
        <div class="hidden md:flex absolute left-1/2 -translate-x-1/2 top-4 z-10 w-10 h-10 rounded-full items-center justify-center text-lg shadow-lg"
          :class="[
            i % 3 === 0 ? 'bg-primary text-white' : '',
            i % 3 === 1 ? 'bg-secondary text-white' : '',
            i % 3 === 2 ? 'bg-accent text-white' : '',
          ]"
        >
          {{ memory.mood ? MOOD_META[memory.mood].emoji : '📍' }}
        </div>

        <!-- Mobile node -->
        <div class="md:hidden absolute left-4 top-4 z-10 w-5 h-5 rounded-full shadow-md"
          :class="[
            i % 3 === 0 ? 'bg-primary' : '',
            i % 3 === 1 ? 'bg-secondary' : '',
            i % 3 === 2 ? 'bg-accent' : '',
          ]"
        />

        <!-- Card -->
        <div class="ml-12 md:ml-0 bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow overflow-hidden border border-gray-100">
          <!-- Colored top accent -->
          <div class="h-1"
            :class="[
              i % 3 === 0 ? 'bg-primary' : '',
              i % 3 === 1 ? 'bg-secondary' : '',
              i % 3 === 2 ? 'bg-accent' : '',
            ]"
          />

          <!-- Media -->
          <div v-if="memory.media.length > 0" class="relative">
            <div v-if="memory.media.length === 1" class="h-48 sm:h-56">
              <img v-if="memory.media[0].type === 'image'" :src="memory.media[0].url" :alt="memory.title" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full bg-gray-900 flex items-center justify-center">
                <span class="text-white text-4xl">▶️</span>
              </div>
            </div>
            <div v-else class="grid grid-cols-2 gap-0.5">
              <div v-for="item in memory.media.slice(0, 4)" :key="item.id" class="h-28 sm:h-32 relative">
                <img v-if="item.type === 'image'" :src="item.url" :alt="item.caption || memory.title" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full bg-gray-900 flex items-center justify-center">
                  <span class="text-white text-xl">▶️</span>
                </div>
              </div>
              <div v-if="memory.media.length > 4" class="absolute bottom-2 right-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded-full">
                +{{ memory.media.length - 4 }} more
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="p-4 sm:p-5">
            <!-- Date pill -->
            <div class="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3"
              :class="[
                i % 3 === 0 ? 'bg-primary/10 text-primary' : '',
                i % 3 === 1 ? 'bg-secondary/10 text-secondary' : '',
                i % 3 === 2 ? 'bg-accent/10 text-accent' : '',
              ]"
            >
              {{ shortDate(memory.date) }}
            </div>

            <h3 class="font-bold text-lg mb-1">{{ memory.title }}</h3>
            <div class="text-xs text-gray-400 mb-3 flex items-center gap-3 flex-wrap">
              <span>📅 {{ fmtDate(memory.date) }}</span>
              <span v-if="memory.location">📍 {{ memory.location }}</span>
            </div>
            <p v-if="memory.description" class="text-sm text-gray-600 leading-relaxed">{{ memory.description }}</p>
          </div>

          <!-- Tags + delete -->
          <div v-if="memory.tags.length > 0 || true" class="flex items-center flex-wrap gap-1.5 px-4 sm:px-5 pb-4">
            <span v-for="tag in memory.tags" :key="tag" class="bg-gray-100 text-gray-600 text-[0.65rem] font-semibold px-2 py-0.5 rounded-full">
              #{{ tag }}
            </span>
            <div class="flex-1" />
            <button class="text-gray-300 hover:text-red-500 text-sm transition-colors" @click="memoriesStore.deleteMemory(memory.id)">🗑️</button>
          </div>
        </div>

        <!-- Connector arrow (desktop) -->
        <div class="hidden md:block absolute top-6"
          :class="i % 2 === 0 ? 'right-[48%]' : 'left-[48%]'"
        >
          <div class="w-4 h-px"
            :class="[
              i % 3 === 0 ? 'bg-primary/40' : '',
              i % 3 === 1 ? 'bg-secondary/40' : '',
              i % 3 === 2 ? 'bg-accent/40' : '',
            ]"
          />
        </div>
      </div>

      <!-- Journey end marker -->
      <div class="flex justify-center pt-4">
        <div class="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xl shadow-lg">
          🏁
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.timeline-entry {
  animation: fadeUp 0.5s ease both;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
