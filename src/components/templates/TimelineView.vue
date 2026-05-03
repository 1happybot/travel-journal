<script setup lang="ts">
import type { Memory } from '@/types'
import { MOOD_META } from '@/types'
import { useMemoriesStore } from '@/stores/memories'

const props = defineProps<{ memories: Memory[]; tripId: string }>()
const memoriesStore = useMemoriesStore()

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}
</script>

<template>
  <v-container class="py-8">
    <v-timeline side="end" align="start" truncate-line="both">
      <v-timeline-item
        v-for="(memory, i) in memories"
        :key="memory.id"
        :dot-color="memory.mood ? `${MOOD_META[memory.mood].color}-lighten-1` : 'primary'"
        size="small"
        fill-dot
      >
        <template #opposite>
          <div class="text-right text-body-2 text-medium-emphasis font-weight-medium" style="min-width: 100px;">
            {{ new Date(memory.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }}
          </div>
        </template>

        <v-card
          class="timeline-card mb-4"
          elevation="2"
          :style="{ animationDelay: `${i * 80}ms` }"
        >
          <!-- Media strip -->
          <div v-if="memory.media.length > 0" class="media-strip d-flex overflow-x-auto" style="gap: 4px;">
            <template v-for="item in memory.media.slice(0, 4)" :key="item.id">
              <div class="media-thumb flex-shrink-0" style="width: 160px; height: 120px; position: relative;">
                <img
                  v-if="item.type === 'image'"
                  :src="item.url"
                  style="width:100%;height:100%;object-fit:cover;"
                  :alt="item.caption || memory.title"
                />
                <div
                  v-else
                  style="width:100%;height:100%;background:#111;display:flex;align-items:center;justify-content:center;"
                >
                  <v-icon color="white" size="32">mdi-play-circle</v-icon>
                </div>
              </div>
            </template>
            <div
              v-if="memory.media.length > 4"
              class="flex-shrink-0 d-flex align-center justify-center bg-grey-darken-3"
              style="width: 80px; height: 120px; color: white; font-weight: 700; font-size: 1.1rem;"
            >
              +{{ memory.media.length - 4 }}
            </div>
          </div>

          <v-card-item>
            <template #prepend>
              <span v-if="memory.mood" style="font-size: 1.4rem;">{{ MOOD_META[memory.mood].emoji }}</span>
            </template>
            <v-card-title class="font-weight-bold pa-0">{{ memory.title }}</v-card-title>
            <v-card-subtitle class="pa-0">
              <v-icon size="13" class="mr-1">mdi-calendar</v-icon>
              {{ fmtDate(memory.date) }}
              <span v-if="memory.location" class="ml-2">
                <v-icon size="13" class="mr-1">mdi-map-marker</v-icon>{{ memory.location }}
              </span>
            </v-card-subtitle>
          </v-card-item>

          <v-card-text v-if="memory.description" class="pt-0">
            <p class="text-body-2">{{ memory.description }}</p>
          </v-card-text>

          <v-card-actions v-if="memory.tags.length > 0" class="pt-0 px-4 pb-3 flex-wrap gap-1">
            <v-chip
              v-for="tag in memory.tags"
              :key="tag"
              size="x-small"
              color="primary"
              variant="tonal"
            >
              # {{ tag }}
            </v-chip>
            <v-spacer />
            <v-btn icon size="x-small" variant="text" color="error" @click="memoriesStore.deleteMemory(memory.id)">
              <v-icon>mdi-delete-outline</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-timeline-item>
    </v-timeline>
  </v-container>
</template>

<style scoped>
.timeline-card {
  animation: slideInLeft 0.4s ease both;
}
@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-24px); }
  to   { opacity: 1; transform: translateX(0); }
}
.media-strip::-webkit-scrollbar { height: 4px; }
.media-strip::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.2); border-radius: 4px; }
</style>
