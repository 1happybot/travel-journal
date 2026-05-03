import { createRouter, createWebHistory } from 'vue-router'
import TripsView from '../views/TripsView.vue'
import TripFormView from '../views/TripFormView.vue'
import TripDetailView from '../views/TripDetailView.vue'
import MemoryFormView from '../views/MemoryFormView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { public: true },
    },
    {
      path: '/',
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

router.beforeEach((to) => {
  const isAuthenticated = sessionStorage.getItem('tripmemories_auth') === '1'
  if (!to.meta.public && !isAuthenticated) {
    return { name: 'login' }
  }
})

export default router
