<template>
    <div class="flex h-screen w-screen overflow-hidden">
      <!-- Left Section -->
      <div class="hidden md:flex relative flex-col justify-center items-center w-1/2" 
        style="background: linear-gradient(to right, #E52051, #E82B5A, #F33967);">
        <!-- Futuristic Pattern -->
        <img 
          :src="futuristicPattern" 
          alt="Futuristic Pattern"
          class="absolute top-0 left-0 w-full h-full object-cover opacity-50"
        />
  
        <!-- Content on top -->
        <div class="relative text-center text-white space-y-6">
          <!-- Logo -->
          <img 
            :src="ateLogo" 
            alt="ATE Logo" 
            class="h-40 w-auto m-auto mb-8"
          />
          <!-- Finance Icon -->
          <img 
            :src="ateFinance" 
            alt="Finance Icon" 
            class="h-24 w-auto"
          />
        </div>
      </div>
  
      <!-- Right Section -->
      <div class="flex flex-col justify-center items-center bg-gray-50 w-full md:w-1/2 px-6 md:px-16">
        <!-- Heading -->
        <h2 class="text-5xl md:text-6xl font-extrabold text-rose-500 text-center mb-20" style="font-family: 'Poppins', sans-serif;">
          Register
        </h2>
  
        <div class="w-full max-w-md">
          <!-- Form -->
          <form @submit.prevent="handleRegister" class="flex flex-col gap-8">
            <!-- Full Name -->
            <div class="flex flex-col gap-2">
              <label for="name" class="text-gray-700 font-medium">Nama Lengkap</label>
              <input
                id="name"
                type="text"
                v-model="userInput.name"
                :class="['border-b-2 px-3 py-2 focus:outline-none w-full text-lg', validationErrors.name ? 'border-red-500' : 'border-gray-400 focus:border-pink-500']"
              />
              <p v-if="validationErrors.name" class="text-red-500 text-sm">{{ validationErrors.name }}</p>
            </div>
  
            <!-- Email -->
            <div class="flex flex-col gap-2">
              <label for="email" class="text-gray-700 font-medium">Email</label>
              <input
                id="email"
                type="email"
                v-model="userInput.email"
                :class="['border-b-2 px-3 py-2 focus:outline-none w-full text-lg', validationErrors.email ? 'border-red-500' : 'border-gray-400 focus:border-pink-500']"
              />
              <p v-if="validationErrors.email" class="text-red-500 text-sm">{{ validationErrors.email }}</p>
            </div>
  
            <!-- Password -->
            <div class="flex flex-col gap-2">
              <label for="password" class="text-gray-700 font-medium">Password</label>
              <input
                id="password"
                type="password"
                v-model="userInput.password"
                :class="['border-b-2 px-3 py-2 focus:outline-none w-full text-lg', validationErrors.password ? 'border-red-500' : 'border-gray-400 focus:border-pink-500']"
              />
              <p v-if="validationErrors.password" class="text-red-500 text-sm">{{ validationErrors.password }}</p>
            </div>
  
            <!-- Confirm Password -->
            <div class="flex flex-col gap-2">
              <label for="confirmPassword" class="text-gray-700 font-medium">Konfirmasi Password</label>
              <input
                id="confirmPassword"
                type="password"
                v-model="userInput.confirmPassword"
                :class="['border-b-2 px-3 py-2 focus:outline-none w-full text-lg', validationErrors.confirmPassword ? 'border-red-500' : 'border-gray-400 focus:border-pink-500']"
              />
              <p v-if="validationErrors.confirmPassword" class="text-red-500 text-sm">{{ validationErrors.confirmPassword }}</p>
            </div>
  
            <!-- Submit Button -->
            <button
              type="submit"
              class="bg-rose-500 text-white font-bold py-3 rounded-lg hover:bg-rose-600 focus:ring focus:ring-rose-300 w-full text-lg"
            >
              Register
            </button>
          </form>
  
          <!-- Login Redirect -->
          <div class="text-center mt-6">
            <p class="text-gray-600 text-sm md:text-base">
              Sudah punya akun? <span class="text-rose-500 font-bold cursor-pointer hover:underline" @click="goToLogin">Login</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { reactive } from 'vue';
  import { useAuthStore } from '@/stores/authStores';
  import { useRouter } from 'vue-router';
  
  import ateFinance from '../assets/ATEFinance.png';
  import ateLogo from '../assets/ATELogo.png';
  import futuristicPattern from '../assets/futuristic-pattern.png';
  import '@/assets/fonts/fonts.css';
  
  const router = useRouter();
  const authStores = useAuthStore();
  const { RegisterUser } = authStores;
  
  const userInput = reactive({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const validationErrors = reactive({});
  
  const handleRegister = () => {
    validationErrors.name = userInput.name ? '' : 'Nama lengkap wajib diisi.';
    validationErrors.email = userInput.email ? '' : 'Email wajib diisi.';
    validationErrors.password = userInput.password ? '' : 'Password wajib diisi.';
    validationErrors.confirmPassword = userInput.confirmPassword ? '' : 'Konfirmasi password wajib diisi.';
  
    if (userInput.password && userInput.confirmPassword && userInput.password !== userInput.confirmPassword) {
      validationErrors.confirmPassword = 'Password dan konfirmasi password tidak cocok!';
    }
  
    if (Object.values(validationErrors).some(error => error)) {
      return;
    }
  
    RegisterUser(userInput);
    userInput.name = '';
    userInput.email = '';
    userInput.password = '';
    userInput.confirmPassword = '';
  };
  
  const goToLogin = () => {
    router.push('/login'); // Redirect to login page
  };
  </script>
  


<style scoped>
/* Tambahkan padding untuk tombol */
button {
padding: 0.5rem 1rem;
}

/* Tambahkan padding untuk input */
input {
padding: 0.5rem;
}
</style>