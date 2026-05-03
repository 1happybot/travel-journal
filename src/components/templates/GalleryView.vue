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
  <v-container class="py-8">
    <div class="gallery-grid">
      <div
        v-for="(memory, mi) in memories"
        :key="memory.id"
        class="gallery-memory"
        :style="{ animationDelay: `${mi * 60}ms` }"
      >
        <!-- Memory header -->
        <div class="d-flex align-center gap-2 mb-2 px-1">
          <span v-if="memory.mood" style="font-size: 1.2rem;">{{ MOOD_META[memory.mood].emoji }}</span>
          <span class="font-weight-bold text-body-1">{{ memory.title }}</span>
          <v-spacer />
          <span class="text-caption text-medium-emphasis">
            {{ new Date(memory.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }}
          </span>
          <v-btn icon size="x-small" variant="text" color="error" @click="memoriesStore.deleteMemory(memory.id)">
            <v-icon>mdi-delete-outline</v-icon>
          </v-btn>
        </div>

        <!-- Media grid for this memory -->
        <div v-if="memory.media.length > 0" class="media-masonry">
          <div
            v-for="(item, ii) in memory.media"
            :key="item.id"
            class="media-item"
            :class="{
              'media-wide': memory.media.length === 1 || (memory.media.length === 3 && ii === 0),
            }"
            @click="openLightbox(item, memory)"
          >
            <img
              v-if="item.type === 'image'"
              :src="item.url"
              :alt="item.caption || memory.title"
              style="width:100%;height:100%;object-fit:cover;"
            />
            <div
              v-else
              style="width:100%;height:100%;background:#222;display:flex;align-items:center;justify-content:center;"
            >
              <v-icon color="white" size="40">mdi-play-circle</v-icon>
            </div>
            <div class="media-overlay">
              <p v-if="item.caption" class="text-white text-caption ma-0 pa-2">{{ item.caption }}</p>
              <v-icon color="white">{{ item.type === 'video' ? 'mdi-play' : 'mdi-magnify-plus-outline' }}</v-icon>
            </div>
          </div>
        </div>

        <!-- No media card -->
        <v-card v-else elevation="0" border class="pa-4">
          <p class="text-body-2 mb-0">{{ memory.description }}</p>
        </v-card>

        <div v-if="memory.location || memory.tags.length" class="d-flex align-center flex-wrap gap-1 mt-2 px-1">
          <v-chip v-if="memory.location" size="x-small" variant="tonal">
            <v-icon start size="12">mdi-map-marker</v-icon>{{ memory.location }}
          </v-chip>
          <v-chip
            v-for="tag in memory.tags"
            :key="tag"
            size="x-small"
            color="primary"
            variant="tonal"
          ># {{ tag }}</v-chip>
        </div>
      </div>
    </div>
  </v-container>

  <!-- Lightbox -->
  <v-dialog v-model="lightbox.open" max-width="900" scrollable>
    <v-card v-if="lightbox.item" rounded="xl" style="overflow: hidden;">
      <div class="d-flex justify-end pa-2" style="position: absolute; top: 0; right: 0; z-index: 10;">
        <v-btn icon variant="text" color="white" @click="lightbox.open = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
      <img
        v-if="lightbox.item.type === 'image'"
        :src="lightbox.item.url"
        style="width:100%;max-height:80vh;object-fit:contain;display:block;background:#000;"
      />
      <video
        v-else
        :src="lightbox.item.url"
        controls
        style="width:100%;max-height:80vh;background:#000;"
      />
      <v-card-text v-if="lightbox.item.caption || lightbox.memory?.title" class="pa-4">
        <p class="font-weight-bold mb-1">{{ lightbox.memory?.title }}</p>
        <p v-if="lightbox.item.caption" class="text-body-2 text-medium-emphasis mb-0">
          {{ lightbox.item.caption }}
        </p>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.gallery-grid {
  display: flex;
  flex-direction: column;
  gap: 28px;
}
.gallery-memory {
  animation: fadeUp 0.4s ease both;
}
.media-masonry {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  grid-auto-rows: 200px;
  gap: 4px;
  border-radius: 16px;
  overflow: hidden;
}
.media-wide {
  grid-column: span 2;
}
.media-item {
  position: relative;
  cursor: pointer;
  overflow: hidden;
}
.media-item:hover .media-overlay {
  opacity: 1;
}
.media-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  opacity: 0;
  transition: opacity 0.25s;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
