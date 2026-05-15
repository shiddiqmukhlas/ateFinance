<script setup>
import ateFinance from '../assets/eatATEFinanceLogo.png';
import { useAuthStore } from "@/stores/authStores";
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const authStores = useAuthStore();
const { LogoutUser, currentUser } = authStores;
const route = useRoute();

const isActiveKeuangan = computed(() => {
  return route.path.startsWith('/keuangan/');
});

const isActiveTransaksi = computed(() => {
  return route.path.startsWith('/transaksi/');
});

// Reactive menu berdasarkan role
const navigationMenu = computed(() => {
  if (currentUser?.role === 'admin') {
    return [
      { name: 'Dashboard', path: '/', icon: 'grid-outline' },
      { name: 'Keuangan', path: '/keuangan/pemasukan', icon: 'wallet-outline' },
      { name: 'Transaksi', path: '/transaksi/pos', icon: 'repeat-outline' },
    ];
  } else {
    return [
      { name: 'Transaksi', path: '/transaksi/pos', icon: 'repeat-outline' },
    ];
  }
});


</script>

<template>
  <div class="fixed top-0 left-0 h-full w-[15rem] bg-[#FFF] text-gray-900 shadow-lg">
    <div class="my-8">
      <img :src="ateFinance" alt="Logo" class="mx-auto h-16 w-auto" />
    </div>
    <nav class="mt-10 mx-5">
      <ul class="space-y-3">
        <li
          v-for="menu in navigationMenu"
          :key="menu.name"
        >
          <router-link
            :to="menu.path"
            active-class="bg-rose-500 text-white"
            class="flex items-center py-2 px-4 hover:bg-[#FF4473] hover:text-white transition rounded-lg"
          >
            <ion-icon :name="menu.icon" class="w-[19px] h-[19px]"></ion-icon>
            <span class="ml-3 my-3">{{ menu.name }}</span>
          </router-link>
        </li>
        <!-- Logout Button -->
        <li>
          <button
            active-class="bg-rose-500 text-white"
            class="flex items-center py-2 !pr-26 hover:bg-[#FF4473] hover:text-white transition rounded-lg"
            @click="LogoutUser"
          >
            <ion-icon name="log-out-outline" class="w-[23px] h-[23px]"></ion-icon>
            <span class="ml-3 my-3">Logout</span>
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<style scoped>
ion-icon {
  margin-left: 1rem !important;
}
</style>
