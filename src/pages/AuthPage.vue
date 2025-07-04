<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import { login as apiLogin, register as apiRegister } from '../api.js'

const showLogin = ref(true)
const message = ref('')
const router = useRouter()

function isLoggedIn() {
  return !!localStorage.getItem('token')
}

onMounted(() => {
  if (isLoggedIn()) {
    router.replace('/dashboard')
  }
})

async function handleLogin(data) {
  message.value = ''
  try {
    const res = await apiLogin(data)
    if (res.token) {
      localStorage.setItem('token', res.token)
      message.value = 'Login berhasil!'
      router.replace('/dashboard')
    } else {
      message.value = res.message || 'Login gagal.'
    }
  } catch (e) {
    message.value = 'Terjadi kesalahan saat login.'
  }
}

async function handleRegister(data) {
  message.value = ''
  try {
    const res = await apiRegister(data)
    if (res.name) {
      message.value = `Register User ${res.name} berhasil! Silakan login.`
      showLogin.value = true
    } else {
      message.value = res.message || 'Register gagal.'
    }
  } catch (e) {
    message.value = 'Terjadi kesalahan saat register.'
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100">
    <div v-if="message" class="mb-4 px-4 py-2 rounded bg-blue-100 text-blue-800">{{ message }}</div>
    <Login v-if="showLogin" @login="handleLogin" @show-register="showLogin = false" />
    <Register v-else @register="handleRegister" @show-login="showLogin = true" />
  </div>
</template>
