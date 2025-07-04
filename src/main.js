import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import './style.css'
import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from './components/Dashboard.vue'
import AuthPage from './pages/AuthPage.vue'

// Hanya dashboard yang perlu di-route, halaman auth (login/register) di-handle oleh App.vue
const routes = [
  { path: '/', component: AuthPage },
  { path: '/dashboard', component: Dashboard },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

createApp(App).use(router).mount('#app')
