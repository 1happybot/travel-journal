import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TripsView from '../views/TripsView.vue'
import TripFormView from '../views/TripFormView.vue'
import TripDetailView from '../views/TripDetailView.vue'
import MemoryFormView from '../views/MemoryFormView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/trips',
      name: 'trips',
      component: TripsView,
    },
    {
      path: '/trips/new',
      name: 'trip-new',
      component: TripFormView,
    },
    {
      path: '/trips/:id',
      name: 'trip-detail',
      component: TripDetailView,
    },
    {
      path: '/trips/:id/edit',
      name: 'trip-edit',
      component: TripFormView,
    },
    {
      path: '/trips/:id/memories/new',
      name: 'memory-new',
      component: MemoryFormView,
    },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

export default router
