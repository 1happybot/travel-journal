import './assets/main.css'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

import App from './App.vue'
import router from './router'
import { seedDemoData } from './seed'

if (import.meta.env.DEV) {
  seedDemoData()
}

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'wanderlog',
    themes: {
      wanderlog: {
        dark: false,
        colors: {
          primary: '#6C3FC5',
          secondary: '#00BCD4',
          accent: '#FF6F61',
          background: '#F8F6FF',
          surface: '#FFFFFF',
          'on-primary': '#FFFFFF',
          'on-secondary': '#FFFFFF',
          success: '#4CAF50',
          warning: '#FF9800',
          error: '#F44336',
        },
      },
    },
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
  defaults: {
    VCard: { rounded: 'xl' },
    VBtn: { rounded: 'xl' },
    VChip: { rounded: 'xl' },
    VTextField: { rounded: 'xl', variant: 'outlined' },
    VTextarea: { rounded: 'xl', variant: 'outlined' },
    VSelect: { rounded: 'xl', variant: 'outlined' },
  },
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')
