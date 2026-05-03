<script setup lang="ts">
import { ref } from 'vue'
import type { MediaItem } from '@/types'

const props = defineProps<{ modelValue: MediaItem[] }>()
const emit = defineEmits<{ 'update:modelValue': [items: MediaItem[]] }>()

const isDragging = ref(false)
const fileInput = ref<HTMLInputElement>()

function onDrop(e: DragEvent) {
  isDragging.value = false
  const files = e.dataTransfer?.files
  if (files) handleFiles(files)
}

function onFileChange(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (files) handleFiles(files)
}

function handleFiles(files: FileList) {
  Array.from(files).forEach((file) => {
    const type = file.type.startsWith('video') ? 'video' : 'image'
    const reader = new FileReader()
    reader.onload = (ev) => {
      const newItem: MediaItem = {
        id: crypto.randomUUID(),
        type,
        url: ev.target?.result as string,
        caption: '',
      }
      emit('update:modelValue', [...props.modelValue, newItem])
    }
    reader.readAsDataURL(file)
  })
}

function removeItem(id: string) {
  emit('update:modelValue', props.modelValue.filter((m) => m.id !== id))
}

function updateCaption(id: string, caption: string) {
  emit('update:modelValue', props.modelValue.map((m) => m.id === id ? { ...m, caption } : m))
}
</script>

<template>
  <div>
    <!-- Drop zone -->
    <div
      class="drop-zone"
      :class="{ 'drop-zone--active': isDragging }"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="onDrop"
      @click="fileInput?.click()"
    >
      <v-icon size="36" color="primary" class="mb-2">mdi-cloud-upload-outline</v-icon>
      <p class="font-weight-medium mb-1">Drop photos & videos here</p>
      <p class="text-caption text-medium-emphasis">or click to browse</p>
    </div>
    <input ref="fileInput" type="file" accept="image/*,video/*" multiple style="display:none" @change="onFileChange" />

    <!-- Previews -->
    <div v-if="modelValue.length > 0" class="previews-grid mt-3">
      <div
        v-for="item in modelValue"
        :key="item.id"
        class="preview-item"
      >
        <img
          v-if="item.type === 'image'"
          :src="item.url"
          style="width:100%;height:100%;object-fit:cover;"
        />
        <div
          v-else
          style="width:100%;height:100%;background:#222;display:flex;align-items:center;justify-content:center;"
        >
          <v-icon color="white" size="28">mdi-play-circle</v-icon>
        </div>

        <!-- Remove btn -->
        <v-btn
          icon
          size="x-small"
          color="error"
          class="remove-btn"
          @click.stop="removeItem(item.id)"
        >
          <v-icon size="14">mdi-close</v-icon>
        </v-btn>

        <!-- Caption input -->
        <div class="caption-bar">
          <input
            :value="item.caption"
            placeholder="Caption..."
            class="caption-input"
            @input="updateCaption(item.id, ($event.target as HTMLInputElement).value)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.drop-zone {
  border: 2px dashed #c0a8f0;
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
  background: #faf6ff;
}
.drop-zone:hover,
.drop-zone--active {
  background: #f0e8ff;
  border-color: #6C3FC5;
}
.previews-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 8px;
}
.preview-item {
  position: relative;
  height: 120px;
  border-radius: 12px;
  overflow: hidden;
  background: #eee;
}
.remove-btn {
  position: absolute;
  top: 4px;
  right: 4px;
}
.caption-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0,0,0,0.55);
  padding: 4px 6px;
}
.caption-input {
  background: transparent;
  border: none;
  outline: none;
  color: white;
  font-size: 0.7rem;
  width: 100%;
  font-family: 'Nunito', sans-serif;
}
.caption-input::placeholder { color: rgba(255,255,255,0.7); }
</style>
