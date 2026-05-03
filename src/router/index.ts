import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

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
      component: () => import('../views/TripsView.vue'),
    },
    {
      path: '/trips/new',
      name: 'trip-new',
      component: () => import('../views/TripFormView.vue'),
    },
    {
      path: '/trips/:id',
      name: 'trip-detail',
      component: () => import('../views/TripDetailView.vue'),
    },
    {
      path: '/trips/:id/edit',
      name: 'trip-edit',
      component: () => import('../views/TripFormView.vue'),
    },
    {
      path: '/trips/:id/memories/new',
      name: 'memory-new',
      component: () => import('../views/MemoryFormView.vue'),
    },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

export default router
