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
      class="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors"
      :class="isDragging ? 'border-primary bg-primary-light' : 'border-purple-200 bg-purple-50/50 hover:bg-primary-light hover:border-primary'"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="onDrop"
      @click="fileInput?.click()"
    >
      <div class="text-3xl mb-2">☁️</div>
      <p class="font-medium text-sm mb-1">Drop photos & videos here</p>
      <p class="text-xs text-gray-400">or click to browse</p>
    </div>
    <input ref="fileInput" type="file" accept="image/*,video/*" multiple class="hidden" @change="onFileChange" />

    <!-- Previews -->
    <div v-if="modelValue.length > 0" class="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-2 mt-3">
      <div v-for="item in modelValue" :key="item.id" class="relative h-30 rounded-xl overflow-hidden bg-gray-100">
        <img v-if="item.type === 'image'" :src="item.url" class="w-full h-full object-cover" />
        <div v-else class="w-full h-full bg-gray-900 flex items-center justify-center">
          <span class="text-white text-2xl">▶️</span>
        </div>
        <!-- Remove btn -->
        <button class="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600" @click.stop="removeItem(item.id)">×</button>
        <!-- Caption input -->
        <div class="absolute bottom-0 left-0 right-0 bg-black/55 px-1.5 py-1">
          <input :value="item.caption" placeholder="Caption..." class="bg-transparent border-none outline-none text-white text-[0.65rem] w-full placeholder:text-white/60"
            @input="updateCaption(item.id, ($event.target as HTMLInputElement).value)" />
        </div>
      </div>
    </div>
  </div>
</template>
