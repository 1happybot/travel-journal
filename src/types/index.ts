export type MemoryMood = 'happy' | 'excited' | 'relaxed' | 'adventurous' | 'grateful'
export type TripTemplate = 'timeline' | 'gallery' | 'story'
export type MediaType = 'image' | 'video'

export interface MediaItem {
  id: string
  type: MediaType
  url: string
  caption?: string
}

export interface Memory {
  id: string
  tripId: string
  title: string
  description: string
  date: string
  location?: string
  mood?: MemoryMood
  tags: string[]
  media: MediaItem[]
  createdAt: string
}

export interface Trip {
  id: string
  title: string
  destination: string
  description: string
  coverImage?: string
  startDate: string
  endDate: string
  template: TripTemplate
  createdAt: string
}

export const MOOD_META: Record<MemoryMood, { emoji: string; label: string; color: string }> = {
  happy:       { emoji: '😊', label: 'Happy',       color: 'amber' },
  excited:     { emoji: '🤩', label: 'Excited',     color: 'orange' },
  relaxed:     { emoji: '😌', label: 'Relaxed',     color: 'teal' },
  adventurous: { emoji: '🧗', label: 'Adventurous', color: 'deep-orange' },
  grateful:    { emoji: '🙏', label: 'Grateful',    color: 'purple' },
}

export const TEMPLATE_META: Record<TripTemplate, { icon: string; label: string; description: string }> = {
  timeline: { icon: 'mdi-timeline-outline',  label: 'Timeline', description: 'Chronological story' },
  gallery:  { icon: 'mdi-image-multiple',    label: 'Gallery',  description: 'Photo & video grid'  },
  story:    { icon: 'mdi-book-open-variant', label: 'Story',    description: 'Scrapbook style'     },
}
