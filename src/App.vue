<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const drawer = ref(false)
const router = useRouter()

const navItems = [
  { title: 'Home',    icon: 'mdi-home',        to: '/'      },
  { title: 'My Trips', icon: 'mdi-map-marker', to: '/trips' },
]
</script>

<template>
  <v-app>
    <v-app-bar flat color="primary" elevation="0">
      <v-app-bar-nav-icon
        class="d-md-none"
        color="white"
        @click="drawer = !drawer"
      />
      <v-app-bar-title>
        <span
          class="font-weight-black text-white cursor-pointer"
          style="font-size: 1.3rem; letter-spacing: 0.5px;"
          @click="router.push('/')"
        >
          ✈️ WanderLog
        </span>
      </v-app-bar-title>

      <template #append>
        <div class="d-none d-md-flex ga-1 mr-2">
          <v-btn
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            :prepend-icon="item.icon"
            variant="text"
            color="white"
          >
            {{ item.title }}
          </v-btn>
          <v-btn to="/trips/new" color="white" variant="outlined" prepend-icon="mdi-plus" class="ml-2">
            New Trip
          </v-btn>
        </div>
      </template>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary>
      <v-list-item
        prepend-icon="mdi-airplane"
        title="WanderLog"
        subtitle="Your vacation journal"
        class="py-4"
      />
      <v-divider />
      <v-list nav>
        <v-list-item
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
          rounded="xl"
          @click="drawer = false"
        />
        <v-divider class="my-2" />
        <v-list-item
          to="/trips/new"
          prepend-icon="mdi-plus-circle"
          title="New Trip"
          rounded="xl"
          color="primary"
          @click="drawer = false"
        />
      </v-list>
    </v-navigation-drawer>

    <v-main style="background: #F8F6FF;">
      <router-view v-slot="{ Component }">
        <transition name="page-transition" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </v-main>
  </v-app>
</template>

