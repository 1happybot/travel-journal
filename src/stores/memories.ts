import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { Memory } from '@/types'

const STORAGE_KEY = 'tripmemories_memories'

function load(): Memory[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

export const useMemoriesStore = defineStore('memories', () => {
  const memories = ref<Memory[]>(load())

  watch(memories, (val) => localStorage.setItem(STORAGE_KEY, JSON.stringify(val)), { deep: true })

  function addMemory(data: Omit<Memory, 'id' | 'createdAt'>): Memory {
    const memory = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...data } as Memory
    memories.value.unshift(memory)
    return memory
  }

  function updateMemory(id: string, data: Partial<Omit<Memory, 'id' | 'createdAt'>>) {
    const i = memories.value.findIndex((m) => m.id === id)
    if (i !== -1) memories.value[i] = { ...memories.value[i], ...data } as Memory
  }

  function deleteMemory(id: string) {
    memories.value = memories.value.filter((m) => m.id !== id)
  }

  function getMemoriesByTrip(tripId: string): Memory[] {
    return memories.value
      .filter((m) => m.tripId === tripId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  function deleteMemoriesByTrip(tripId: string) {
    memories.value = memories.value.filter((m) => m.tripId !== tripId)
  }

  return { memories, addMemory, updateMemory, deleteMemory, getMemoriesByTrip, deleteMemoriesByTrip }
})
