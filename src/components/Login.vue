<template>
    <div class="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#032D42] via-[#0a4a5c] to-[#032D42] text-white px-4 relative overflow-hidden">
      <!-- Background decorative elements -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-20 left-10 w-32 h-32 bg-[#00AAFF] rounded-lg transform rotate-12"></div>
        <div class="absolute bottom-20 right-10 w-24 h-24 bg-[#2EB67D] rounded-lg transform -rotate-12"></div>
        <div class="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-lg transform rotate-45"></div>
      </div>
  
      <div class="w-full max-w-md relative z-10">
        <form
          @submit.prevent="onSubmit"
          class="bg-[#032D42]/80 backdrop-blur-sm border border-[#00AAFF]/30 rounded-2xl p-8 space-y-6 shadow-2xl"
        >
          <!-- Header -->
          <div class="text-center mb-8">
            <h2 class="text-4xl font-bold text-white mb-2">Sign In</h2>
            <p class="text-gray-300 text-sm">Welcome back! Please sign in to your account.</p>
          </div>
  
          <!-- Name Field -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-300">Name</label>
            <input
              v-model="name"
              type="name"
              required
              placeholder="e.g John Doe"
              class="w-full bg-[#0a4a5c]/50 border border-[#2EB67D]/30 rounded-lg px-4 py-3 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#00AAFF] focus:border-transparent transition-all duration-200"
            />
          </div>
  
          <!-- Password Field -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-300">Password</label>
            <div class="relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                placeholder="Enter your password"
                class="w-full bg-[#0a4a5c]/50 border border-[#2EB67D]/30 rounded-lg px-4 py-3 pr-12 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#00AAFF] focus:border-transparent transition-all duration-200"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
                </svg>
              </button>
            </div>
          </div>
  
          <!-- Remember me and Forgot password -->
          <div class="flex items-center justify-between text-sm">
            <label class="flex items-center space-x-2 text-gray-300">
              <input 
                type="checkbox" 
                class="w-4 h-4 text-[#2EB67D] bg-transparent border-2 border-gray-600 rounded focus:ring-[#00AAFF] focus:ring-2"
              />
              <span>Remember me</span>
            </label>
            <!-- <a href="#" class="text-[#2EB67D] hover:text-[#2EB67D]/80 transition-colors">
              Forgot password?
            </a> -->
          </div>
  
          <!-- Submit Button -->
          <button
            type="submit"
            class="w-full py-3 bg-white text-[#032D42] font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Sign In
          </button>
  
          <!-- Sign up link -->
          <p class="text-sm text-center text-gray-300 mt-6">
            Don't have an account?
            <a
              href="#"
              @click.prevent="$emit('show-register')"
              class="text-[#2EB67D] hover:text-[#2EB67D]/80 font-medium transition-colors ml-1"
            >
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const name = ref('')
  const password = ref('')
  const showPassword = ref(false)
  
  function onSubmit() {
    emit('login', { name: name.value, password: password.value })
  }
  
  const emit = defineEmits(['login', 'show-register'])
  </script>