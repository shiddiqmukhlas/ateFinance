<template>
    <nav class="bg-[#F7F7F8] h-20 !px-12 !py-4 fixed top-0 left-60 right-0">
      <div class="flex justify-between items-center">
        <!-- Judul Halaman -->
        <div class="text-black text-[1.75rem] font-bold !pt-2">
          <slot>{{ pageTitle }}</slot>
        </div>


        <!-- Dropdown User -->
        <div class="relative flex items-center gap-2 !pt-2">

            <!-- Dropdown User -->
            <div>
            <button @click="toggleDropdown" class="flex items-center gap-2 text-black font-semibold !px-2 !py-1 rounded transition-all hover:bg-gray-200 hover:shadow cursor-pointer">
                <!-- Tambahkan Icon -->
                <ion-icon name="person-circle-outline" class="w-8 h-8"></ion-icon>
                <span class="!pr-1.5">{{ user.name }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <div v-if="dropdownOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg">
                <button @click="LogoutUser" class="block w-full text-left !px-4 !py-2 text-gray-800 hover:bg-gray-200">
                Logout
                </button>
            </div>
            </div>
        </div>
        </div>
    </nav>
  </template>
  
  <script setup>
  import {ref, onMounted} from 'vue'
  import customFetch from '@/api'
  import { useAuthStore } from "@/stores/authStores";


  // Pinia Store
  const authStores = useAuthStore();
  const { LogoutUser } = authStores;

  
  // State
  const dropdownOpen = ref(false);
  const user = ref("User")
  const pageTitle = ref("Halaman"); // Default judul halaman
  
  // Methods
  const toggleDropdown = () => {
    dropdownOpen.value = !dropdownOpen.value;
  };

  const getUser = async () => {
      const {data} = await customFetch.get('/auth/getUser')
      console.log(data)
      user.value = data.user
  }



  onMounted(() => {
      getUser()
  })




</script>
  
<style scoped>
button {
position: relative;
outline: none;
font-weight: 500;
}

button span {
position: relative;
display: inline-block;
}


button:hover {
position: relative;
}


</style>
  