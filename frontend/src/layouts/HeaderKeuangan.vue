<template>
    <nav class="bg-[#F7F7F8] h-20 !px-12 !py-4 fixed top-0 left-60 right-0">
      <div class="flex justify-between items-center">
        <!-- Judul Halaman -->
        <div class="text-black text-[1.75rem] font-bold !pt-2">
          <slot>{{ pageTitle }}</slot>
        </div>

        <!-- Navtab -->

        <div class="flex gap-0 shadow-sm rounded-md w-[16] mt-5">
            <button
            v-for="tab in tabs"
            :key="tab.name"
            :class="[
                '!px-6 !pt-2 !pb-2.5 text-black rounded-md transition-all cursor-pointer',
                activeTab === tab.name
                ? 'active-tab'
                : 'hover:bg-pink-100 hover:text-rose-500'
            ]"
            @click="navigateTo(tab.name)"
            >
            <span>{{ tab.name }}</span>
            </button>
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
  import {ref, onMounted, watchEffect} from 'vue'
  import customFetch from '@/api'
  import { useAuthStore } from "@/stores/authStores";
  import { useRouter, useRoute } from 'vue-router';

  const router = useRouter();
  const route = useRoute();
    
  const tabs = [
  { name: 'Pemasukan', route: '/keuangan/pemasukan' },
  { name: 'Pengeluaran', route: '/keuangan/pengeluaran' },
  // { name: 'Arus Kas', route: '/keuangan/aruskas' },
  
  ];

  const activeTab = ref('income');
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

  const navigateTo = (name) => {
  const tab = tabs.find((tab) => tab.name === name); // Temukan tab berdasarkan nama
  if (tab) {
  router.push(tab.route); // Navigasi berdasarkan rute tab
  activeTab.value = name; // Perbarui tab aktif
  }
  };

  // Perbarui `activeTab` berdasarkan rute saat ini
  watchEffect(() => {
  const currentRoute = route.path; // Dapatkan path rute saat ini
  const active = tabs.find((tab) => tab.route === currentRoute);
  activeTab.value = active ? active.name : '';
  });

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

button.active-tab {
  color: #FF2056; /* Warna teks untuk tab aktif */
  position: relative; /* Pastikan posisi relatif di tombol */
}

button.active-tab::after {
  content: '';
  position: absolute;
  bottom: -2px; /* Posisikan di bawah tombol */
  left: 0;
  width: 100%; /* Sesuaikan dengan lebar tombol */
  height: 2.6px; /* Ketebalan garis */
  background-color: #FF2056; /* Warna pink */
}

button:hover {
position: relative;
}


/* button.active-tab:hover {
  background-color: #fce7ec; 
  color: #FF2056; 
} */
</style>
  