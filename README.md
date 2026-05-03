# ✈️ WanderLog — Vacation Memories Journal

A beautiful, fully client-side vacation journal built with **Vue 3 + TypeScript + Vite + Vuetify 3**.  
Capture trips, upload photos & videos, and showcase memories in three stunning display templates.

---

## ✨ Features

- **📋 Trip Dashboard** — Visual grid of all your trips with cover images
- **🕐 Timeline Template** — Animated chronological story of your journey
- **🖼️ Gallery Template** — Masonry photo/video grid with lightbox expand
- **📷 Story Template** — Polaroid scrapbook with tilt effects & handwriting font
- **📸 Media Upload** — Drag-and-drop photos & videos (stored as base64)
- **😊 Mood Picker** — Tag each memory with an emotion
- **🏷️ Tags & Location** — Searchable tags and location per memory
- **💾 Offline-first** — All data persisted in `localStorage`, no backend needed
- **📱 Responsive** — Mobile nav drawer, works on all screen sizes

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) `>=22.12.0` (use `nvm use 22`)
- npm `>=10`

### Local Development

```bash
# Install dependencies
npm install

# Start dev server (hot reload)
npm run dev
# → http://localhost:5173
```

### Production Build

```bash
npm run build       # type-check + build
npm run preview     # preview the production build locally
```

### Type Check

```bash
npm run type-check
```

### Lint

```bash
npm run lint
```

---

## 🐳 Docker

### Build & Run with Docker

```bash
# Build the image
docker build -t wanderlog .

# Run on port 8080
docker run -p 8080:80 wanderlog
# → http://localhost:8080
```

### Using Docker Compose

```bash
docker compose up
# → http://localhost:8080

# Run in background
docker compose up -d

# Stop
docker compose down
```

---

## 📁 Project Structure

```
web-app/
├── src/
│   ├── App.vue                        # Root shell: nav bar + drawer
│   ├── main.ts                        # App entry, Vuetify theme setup
│   ├── seed.ts                        # Dev-only demo data seed (localStorage)
│   ├── types/
│   │   └── index.ts                   # Trip, Memory, MediaItem interfaces
│   ├── stores/
│   │   ├── trips.ts                   # Pinia store: trips CRUD + localStorage
│   │   └── memories.ts                # Pinia store: memories CRUD + localStorage
│   ├── router/
│   │   └── index.ts                   # Vue Router routes
│   ├── views/
│   │   ├── HomeView.vue               # Landing page
│   │   ├── TripsView.vue              # Trips dashboard
│   │   ├── TripFormView.vue           # Create / edit trip
│   │   ├── TripDetailView.vue         # Trip detail with template switcher
│   │   └── MemoryFormView.vue         # Add memory form
│   └── components/
│       ├── TripCard.vue               # Trip card for dashboard
│       ├── TemplateSwitcher.vue       # Timeline / Gallery / Story toggle
│       ├── MediaUploader.vue          # Drag-and-drop file upload
│       ├── MoodPicker.vue             # Emoji mood selector
│       └── templates/
│           ├── TimelineView.vue       # Timeline display template
│           ├── GalleryView.vue        # Gallery display template
│           └── StoryView.vue          # Polaroid scrapbook template
├── Dockerfile                         # Multi-stage Docker build
├── docker-compose.yml
├── nginx.conf                         # nginx config for SPA routing
└── .dockerignore
```

---

## 🌱 Demo / Seed Data

In **development mode** (`npm run dev`), the app automatically populates `localStorage` with sample trips and memories the first time it loads — so you can explore all features without adding data manually.

The seed data includes:

| Trip | Destination | Template |
|---|---|---|
| Japan Cherry Blossom Season | Tokyo & Kyoto, Japan | Timeline |
| Amalfi Coast Road Trip | Amalfi Coast, Italy | Gallery |
| Patagonia Trekking Adventure | Patagonia, Argentina & Chile | Story |

Each trip comes with 2–3 memories covering different moods, locations, tags, and cover images.

**Seeding only runs when both `wanderlog_trips` and `wanderlog_memories` are absent from `localStorage`** — it will never overwrite data you've already added.

To reset and re-seed:
```js
// Paste in the browser console, then refresh
localStorage.removeItem('wanderlog_trips')
localStorage.removeItem('wanderlog_memories')
```

The seed file lives at `src/seed.ts` and is **excluded from production builds** via the `import.meta.env.DEV` guard in `main.ts`.

---

## 🛣️ Routes

| Route | Page |
|---|---|
| `/` | Landing page |
| `/trips` | All trips dashboard |
| `/trips/new` | Create new trip |
| `/trips/:id` | Trip detail (memories + templates) |
| `/trips/:id/edit` | Edit trip |
| `/trips/:id/memories/new` | Add a memory |

---

## 🎨 Tech Stack

| Tool | Purpose |
|---|---|
| [Vue 3](https://vuejs.org/) | UI framework (Composition API) |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Vite 8](https://vite.dev/) | Build tool |
| [Vuetify 3](https://vuetifyjs.com/) | Material Design component library |
| [Pinia](https://pinia.vuejs.org/) | State management |
| [Vue Router 5](https://router.vuejs.org/) | Client-side routing |
| [Nunito + Caveat](https://fonts.google.com/) | Google Fonts |
| [@mdi/font](https://materialdesignicons.com/) | Icon set |

---

## 🤖 Copilot Cloud Agent

This repo includes `.github/workflows/copilot-setup-steps.yml` which pre-configures the GitHub Copilot coding agent environment with Node.js 22 and cached npm dependencies for fast task execution.

To change the AI model used by the Copilot coding agent:  
**GitHub → repo → Settings → Copilot → select model**
