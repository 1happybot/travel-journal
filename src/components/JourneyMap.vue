<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Memory } from '@/types'

const props = defineProps<{ memories: Memory[]; destination: string }>()

const mapContainer = ref<HTMLElement | null>(null)
const loading = ref(true)
const error = ref(false)
let map: L.Map | null = null

interface GeoPoint {
  lat: number
  lng: number
  label: string
  date: string
  index: number
}

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search'

async function geocode(location: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const res = await fetch(`${NOMINATIM_URL}?q=${encodeURIComponent(location)}&format=json&limit=1`, {
      headers: { 'Accept': 'application/json' },
    })
    const data = await res.json()
    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
    }
  } catch {
    // geocoding failed for this location
  }
  return null
}

async function buildMap() {
  loading.value = true
  error.value = false

  // Collect unique locations in chronological order
  const sorted = [...props.memories]
    .filter((m) => m.location)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  if (sorted.length === 0) {
    // Fall back to trip destination
    const destGeo = await geocode(props.destination)
    if (destGeo && mapContainer.value) {
      initMap([{ ...destGeo, label: props.destination, date: '', index: 0 }])
    } else {
      error.value = true
    }
    loading.value = false
    return
  }

  // Deduplicate locations while keeping order
  const seen = new Set<string>()
  const uniqueLocations: { location: string; date: string }[] = []
  for (const m of sorted) {
    const key = m.location!.toLowerCase().trim()
    if (!seen.has(key)) {
      seen.add(key)
      uniqueLocations.push({ location: m.location!, date: m.date })
    }
  }

  // Geocode all locations (with small delay to respect Nominatim rate limits)
  const points: GeoPoint[] = []
  for (let i = 0; i < uniqueLocations.length; i++) {
    const geo = await geocode(uniqueLocations[i].location)
    if (geo) {
      points.push({
        ...geo,
        label: uniqueLocations[i].location,
        date: uniqueLocations[i].date,
        index: i + 1,
      })
    }
    // Nominatim asks for max 1 req/sec
    if (i < uniqueLocations.length - 1) {
      await new Promise((r) => setTimeout(r, 1100))
    }
  }

  if (points.length === 0) {
    error.value = true
    loading.value = false
    return
  }

  initMap(points)
  loading.value = false
}

function initMap(points: GeoPoint[]) {
  if (!mapContainer.value) return

  // Clean up previous map
  if (map) {
    map.remove()
    map = null
  }

  map = L.map(mapContainer.value, {
    zoomControl: true,
    scrollWheelZoom: false,
  })

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 18,
  }).addTo(map)

  const markerGroup = L.featureGroup()

  // Add numbered markers
  points.forEach((pt) => {
    const icon = L.divIcon({
      className: 'journey-marker',
      html: `<div class="marker-pin">${pt.index}</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    })

    const dateStr = pt.date
      ? new Date(pt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : ''

    const marker = L.marker([pt.lat, pt.lng], { icon })
      .bindPopup(`<strong>${pt.label}</strong>${dateStr ? `<br/><small>${dateStr}</small>` : ''}`)
    markerGroup.addLayer(marker)
  })

  markerGroup.addTo(map)

  // Draw journey path if more than 1 point
  if (points.length > 1) {
    const latlngs = points.map((p) => [p.lat, p.lng] as L.LatLngTuple)
    L.polyline(latlngs, {
      color: '#6C3FC5',
      weight: 3,
      opacity: 0.7,
      dashArray: '8, 8',
    }).addTo(map)
  }

  // Fit bounds with padding
  map.fitBounds(markerGroup.getBounds().pad(0.2))
}

onMounted(() => {
  nextTick(() => buildMap())
})

watch(() => props.memories, () => buildMap(), { deep: true })
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
      <!-- Header -->
      <div class="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">🗺️</div>
        <div>
          <h3 class="font-bold text-base text-gray-900">Your Journey Map</h3>
          <p class="text-xs text-gray-400">{{ destination }} &middot; {{ memories.filter(m => m.location).length }} locations traced</p>
        </div>
      </div>

      <!-- Map -->
      <div class="relative" style="height: 380px;">
        <!-- Loading -->
        <div v-if="loading" class="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 z-10">
          <div class="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin mb-3" />
          <p class="text-sm text-gray-400">Mapping your journey...</p>
        </div>

        <!-- Error -->
        <div v-if="error && !loading" class="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 z-10">
          <div class="text-4xl mb-2">📍</div>
          <p class="text-sm text-gray-500">Couldn't map the locations</p>
          <p class="text-xs text-gray-400 mt-1">Add locations to your memories to see the map</p>
        </div>

        <div ref="mapContainer" class="w-full h-full" />
      </div>

      <!-- Legend -->
      <div v-if="!error" class="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center gap-4 flex-wrap text-xs text-gray-500">
        <span class="flex items-center gap-1.5">
          <span class="inline-block w-3 h-3 rounded-full bg-primary" /> Stop
        </span>
        <span class="flex items-center gap-1.5">
          <span class="inline-block w-6 border-t-2 border-dashed border-primary/70" /> Route
        </span>
        <span class="ml-auto text-gray-400">Click markers for details</span>
      </div>
    </div>
  </div>
</template>

<style>
.journey-marker {
  background: none !important;
  border: none !important;
}
.marker-pin {
  width: 32px;
  height: 32px;
  border-radius: 50% 50% 50% 0;
  background: #6C3FC5;
  color: white;
  font-weight: 700;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(-45deg);
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
}
.marker-pin > * {
  transform: rotate(45deg);
}
</style>
