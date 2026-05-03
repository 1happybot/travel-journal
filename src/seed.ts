import type { Trip, Memory } from '@/types'

const TRIPS_KEY = 'wanderlog_trips'
const MEMORIES_KEY = 'wanderlog_memories'

const trips: Trip[] = [
  {
    id: 'seed-trip-1',
    title: 'Japan Cherry Blossom Season',
    destination: 'Tokyo & Kyoto, Japan',
    description:
      'Two weeks exploring the Land of the Rising Sun during peak sakura season. From neon-lit Shinjuku to serene bamboo groves in Arashiyama.',
    coverImage: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=800&q=80',
    startDate: '2024-03-25',
    endDate: '2024-04-07',
    template: 'timeline',
    createdAt: '2024-03-01T10:00:00.000Z',
  },
  {
    id: 'seed-trip-2',
    title: 'Amalfi Coast Road Trip',
    destination: 'Amalfi Coast, Italy',
    description:
      'A sun-soaked road trip along the dramatic cliffs of southern Italy — fresh seafood, limoncello, and breathtaking coastal views at every turn.',
    coverImage: 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=800&q=80',
    startDate: '2024-06-10',
    endDate: '2024-06-20',
    template: 'gallery',
    createdAt: '2024-05-15T08:30:00.000Z',
  },
  {
    id: 'seed-trip-3',
    title: 'Patagonia Trekking Adventure',
    destination: 'Patagonia, Argentina & Chile',
    description:
      'An epic 12-day trek through Torres del Paine and Los Glaciares national parks. Raw wilderness, glaciers, and more stars than you can count.',
    coverImage: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
    startDate: '2024-11-01',
    endDate: '2024-11-12',
    template: 'story',
    createdAt: '2024-10-01T14:00:00.000Z',
  },
]

const memories: Memory[] = [
  // Trip 1 — Japan
  {
    id: 'seed-mem-1',
    tripId: 'seed-trip-1',
    title: 'First sight of Senso-ji',
    description:
      'Stepped through the Kaminarimon gate just as cherry blossoms were drifting down. The smell of incense mixed with street food was overwhelming in the best way.',
    date: '2024-03-26',
    location: 'Asakusa, Tokyo',
    mood: 'excited',
    tags: ['temple', 'sakura', 'tokyo'],
    media: [
      {
        id: 'sm1-img1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600&q=80',
        caption: 'Kaminarimon gate at dawn',
      },
    ],
    createdAt: '2024-03-26T09:00:00.000Z',
  },
  {
    id: 'seed-mem-2',
    tripId: 'seed-trip-1',
    title: 'Ramen in a tiny alley shop',
    description:
      'Found a 6-seat ramen place hidden in a Shinjuku back alley. Waited 45 minutes in the cold. Absolutely worth every second — best tonkotsu of my life.',
    date: '2024-03-28',
    location: 'Shinjuku, Tokyo',
    mood: 'happy',
    tags: ['food', 'ramen', 'hidden-gems'],
    media: [
      {
        id: 'sm2-img1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80',
        caption: 'Rich tonkotsu broth',
      },
    ],
    createdAt: '2024-03-28T19:30:00.000Z',
  },
  {
    id: 'seed-mem-3',
    tripId: 'seed-trip-1',
    title: 'Arashiyama Bamboo Grove at sunrise',
    description:
      'Woke up at 5am to beat the crowds. Walking through the bamboo in near-silence with soft golden light filtering through — one of those moments you never forget.',
    date: '2024-04-02',
    location: 'Arashiyama, Kyoto',
    mood: 'grateful',
    tags: ['nature', 'kyoto', 'sunrise', 'bamboo'],
    media: [
      {
        id: 'sm3-img1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=80',
        caption: 'Bamboo grove at first light',
      },
    ],
    createdAt: '2024-04-02T06:00:00.000Z',
  },

  // Trip 2 — Amalfi Coast
  {
    id: 'seed-mem-4',
    tripId: 'seed-trip-2',
    title: 'Driving the cliff road into Positano',
    description:
      'White-knuckle driving on a road barely wide enough for one car, with a sheer drop to the Tyrrhenian Sea on the left. The view of Positano cascading down the hillside made it all worthwhile.',
    date: '2024-06-11',
    location: 'Positano, Italy',
    mood: 'adventurous',
    tags: ['driving', 'views', 'positano'],
    media: [
      {
        id: 'sm4-img1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1534445638916-5e42f9f9e2b9?w=600&q=80',
        caption: 'Positano cliffside village',
      },
    ],
    createdAt: '2024-06-11T14:00:00.000Z',
  },
  {
    id: 'seed-mem-5',
    tripId: 'seed-trip-2',
    title: 'Sunset aperitivo in Ravello',
    description:
      'Perched 350m above the sea at Villa Rufolo, sipping Aperol spritz as the sun melted into the horizon. Jazz drifting from a live trio. Pure magic.',
    date: '2024-06-15',
    location: 'Ravello, Italy',
    mood: 'relaxed',
    tags: ['sunset', 'aperitivo', 'ravello', 'music'],
    media: [
      {
        id: 'sm5-img1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&q=80',
        caption: 'Golden hour over the Tyrrhenian Sea',
      },
    ],
    createdAt: '2024-06-15T19:00:00.000Z',
  },

  // Trip 3 — Patagonia
  {
    id: 'seed-mem-6',
    tripId: 'seed-trip-3',
    title: 'First view of Torres del Paine',
    description:
      'After 3 hours of hiking through grey drizzle, the clouds parted for exactly 4 minutes to reveal the towers in full. Everyone on the trail stopped and stared in silence.',
    date: '2024-11-03',
    location: 'Torres del Paine, Chile',
    mood: 'grateful',
    tags: ['hiking', 'mountains', 'patagonia', 'torres'],
    media: [
      {
        id: 'sm6-img1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80',
        caption: 'The towers emerging from the clouds',
      },
    ],
    createdAt: '2024-11-03T13:00:00.000Z',
  },
  {
    id: 'seed-mem-7',
    tripId: 'seed-trip-3',
    title: 'Camping under the Milky Way',
    description:
      'No light pollution for hundreds of kilometres. Lay outside the tent at midnight and watched satellites cross the sky. The Milky Way was so bright it cast a faint shadow.',
    date: '2024-11-07',
    location: 'Los Glaciares NP, Argentina',
    mood: 'adventurous',
    tags: ['camping', 'stars', 'milkyway', 'patagonia'],
    media: [],
    createdAt: '2024-11-07T23:30:00.000Z',
  },
]

export function seedDemoData() {
  const existingTrips = localStorage.getItem(TRIPS_KEY)
  const existingMemories = localStorage.getItem(MEMORIES_KEY)

  if (!existingTrips && !existingMemories) {
    localStorage.setItem(TRIPS_KEY, JSON.stringify(trips))
    localStorage.setItem(MEMORIES_KEY, JSON.stringify(memories))
  }
}
