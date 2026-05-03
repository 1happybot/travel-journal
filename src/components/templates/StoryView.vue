<script setup lang="ts">
import type { Memory } from '@/types'
import { MOOD_META } from '@/types'
import { useMemoriesStore } from '@/stores/memories'

defineProps<{ memories: Memory[]; tripId: string }>()
const memoriesStore = useMemoriesStore()

const rotations = [-3, 2, -1.5, 3, -2, 1, -2.5, 2.5]

function rotation(i: number) {
  return rotations[i % rotations.length]
}
</script>

<template>
  <div class="story-bg py-10">
    <v-container>
      <div class="story-grid">
        <div
          v-for="(memory, i) in memories"
          :key="memory.id"
          class="polaroid"
          :style="{ '--rot': `${rotation(i)}deg`, animationDelay: `${i * 100}ms` }"
        >
          <!-- Photo area -->
          <div class="polaroid-photo">
            <template v-if="memory.media.length > 0">
              <img
                v-if="memory.media[0]?.type === 'image'"
                :src="memory.media[0]?.url"
                :alt="memory.title"
                style="width:100%;height:100%;object-fit:cover;"
              />
              <div
                v-else
                style="width:100%;height:100%;background:#222;display:flex;align-items:center;justify-content:center;"
              >
                <v-icon color="white" size="40">mdi-play-circle</v-icon>
              </div>
            </template>
            <div
              v-else
              class="d-flex align-center justify-center h-100"
              style="background: linear-gradient(135deg, #E8D5FF, #B3E5FC);"
            >
              <v-icon color="primary" size="48">mdi-image-outline</v-icon>
            </div>

            <!-- More media badge -->
            <div
              v-if="memory.media.length > 1"
              class="media-count-badge"
            >
              +{{ memory.media.length - 1 }}
            </div>

            <!-- Mood badge -->
            <div v-if="memory.mood" class="mood-badge">
              {{ MOOD_META[memory.mood].emoji }}
            </div>
          </div>

          <!-- Polaroid caption area -->
          <div class="polaroid-caption">
            <div class="font-caveat memory-title">{{ memory.title }}</div>
            <div class="font-caveat memory-date">
              {{ new Date(memory.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}
            </div>
            <div v-if="memory.location" class="memory-location">
              <v-icon size="12" color="grey">mdi-map-marker</v-icon>
              <span>{{ memory.location }}</span>
            </div>
            <p v-if="memory.description" class="memory-desc font-caveat">{{ memory.description }}</p>
          </div>

          <!-- Delete btn -->
          <v-btn
            icon
            size="x-small"
            variant="text"
            color="error"
            class="delete-btn"
            @click="memoriesStore.deleteMemory(memory.id)"
          >
            <v-icon size="14">mdi-close</v-icon>
          </v-btn>
        </div>
      </div>
    </v-container>
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

.story-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 28px;
  justify-content: center;
}

.polaroid {
  background: white;
  padding: 12px 12px 20px;
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

.polaroid-photo {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f0f0f0;
  position: relative;
}

.polaroid-caption {
  padding-top: 10px;
}

.memory-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #222;
  line-height: 1.2;
  margin-bottom: 2px;
}

.memory-date {
  font-size: 0.95rem;
  color: #888;
  margin-bottom: 4px;
}

.memory-location {
  font-size: 0.7rem;
  color: #aaa;
  display: flex;
  align-items: center;
  gap: 2px;
  margin-bottom: 4px;
}

.memory-desc {
  font-size: 0.95rem;
  color: #555;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.media-count-badge {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0,0,0,0.6);
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 20px;
}

.mood-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  font-size: 1.3rem;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));
}

.delete-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  opacity: 0;
  transition: opacity 0.2s;
  background: white;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}

.polaroid:hover .delete-btn {
  opacity: 1;
}

@keyframes popIn {
  from { opacity: 0; transform: rotate(var(--rot)) scale(0.7); }
  to   { opacity: 1; transform: rotate(var(--rot)) scale(1); }
}
</style>
