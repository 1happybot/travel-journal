import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { seedDemoData } from './seed'

if (import.meta.env.DEV) {
  seedDemoData()
}

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
