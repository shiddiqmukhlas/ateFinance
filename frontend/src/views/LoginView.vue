<template>
    <div class="flex h-screen w-screen overflow-hidden">
      <!-- Left Section -->
      <div class="hidden md:flex relative flex-col justify-center items-center w-1/2" 
        style="background: linear-gradient(to right, #E52051, #E82B5A, #F33967);">
        <img 
          :src="futuristicPattern" 
          alt="Futuristic Pattern"
          class="absolute top-0 left-0 w-full h-full object-cover opacity-50"
        />
        <div class="relative text-center text-white space-y-6">
          <img 
            :src="ateLogo" 
            alt="ATE Logo" 
            class="h-40 w-auto m-auto mb-8"
          />
          <img 
            :src="ateFinance" 
            alt="Finance Icon" 
            class="h-24 w-auto"
          />
        </div>
      </div>
  
      <!-- Right Section -->
      <div class="flex flex-col justify-center items-center bg-gray-50 w-full md:w-1/2 px-6 md:px-16">
        <h2 class="text-5xl md:text-6xl font-extrabold text-rose-500 text-center mb-10" style="font-family: 'Poppins', sans-serif;">
          Login
        </h2>
  
        <!-- Error Alert -->
        <div v-if="authStores.errorAlert" class="bg-red-200 text-pink-700 px-4 py-3 rounded-md mb-6 w-full max-w-md">
          {{ authStores.errorMsg }}
        </div>
  
        <div class="w-full max-w-md">
          <!-- Form -->
          <form @submit.prevent="handleLogin" class="flex flex-col gap-8">
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
  
            <button
              type="submit"
              class="bg-rose-500 text-white font-bold py-3 rounded-lg hover:bg-rose-600 focus:ring focus:ring-rose-300 w-full text-lg"
            >
              Login
            </button>
          </form>
  
          <div class="text-center mt-6">
            <p class="text-gray-600 text-sm md:text-base">
              Belum punya akun? <span class="text-rose-500 font-bold cursor-pointer hover:underline" @click="goToRegister">Buat Akun</span>
            </p>
          </div>
        </div>
      </div>
    </div>
</template>
  
  <script setup>
  import { reactive, onMounted } from 'vue';
  import { useAuthStore } from '@/stores/authStores';
  import { useRouter } from 'vue-router';
  
  import ateFinance from '../assets/ATEFinance.png';
  import ateLogo from '../assets/ATELogo.png';
  import futuristicPattern from '../assets/futuristic-pattern.png';
  import '@/assets/fonts/fonts.css';
  
  const router = useRouter();
  const authStores = useAuthStore();
  const { LoginUser } = authStores;
  
  const userInput = reactive({
    email: '',
    password: '',
  });
  
  const validationErrors = reactive({});

  // Lifecycle hook untuk reset alert ketika halaman login dimuat
    onMounted(() => {
    authStores.errorAlert = false; 
    authStores.errorMsg = ''; 
    });
  
  const handleLogin = async () => {
    validationErrors.email = userInput.email ? '' : 'Email wajib diisi.';
    validationErrors.password = userInput.password ? '' : 'Password wajib diisi.';
  
    if (Object.values(validationErrors).some(error => error)) {
      return;
    }
    
    try {
        await LoginUser(userInput);
    } catch {
        userInput.password = '';
    }
  };
  
  const goToRegister = () => {
    router.push('/register');
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
  
  