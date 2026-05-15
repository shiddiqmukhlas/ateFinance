<template>
    <div class="flex flex-col lg:flex-row gap-13 mt-20">
      <!-- Bagian Menu Grid -->
      <div class="w-full lg:w-2/3">
            <!-- Filter -->
            <div class="mb-9 flex flex-col sm:flex-row gap-4">
            <input
                type="text"
                v-model="filters.keyword"
                placeholder="Cari menu..."
                class="w-full sm:w-1/2 !px-4 !py-2 border border-gray-400 rounded-lg shadow-sm hover:border-pink-600 focus:outline-none focus:ring-pink-600 focus:border-pink-600"
                @input="applyFilters"
            />
            <select
                v-model="filters.category"
                class="w-full sm:w-1/4 !px-4 !py-2 rounded-lg shadow-xl bg-[#F43264] text-white"
                @change="applyFilters"
            >
                <option value="">Semua Kategori</option>
                <option value="makanan">Makanan</option>
                <option value="minuman">Minuman</option>
                <option value="cemilan">Cemilan</option>
                <option value="tambahan">Tambahan</option>
            </select>
            </div>
    
            <!-- Grid Menu -->
            <div
            v-if="!isLoading && menus.length > 0"
            class="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6"
            >
            <div
                v-for="menu in menus"
                :key="menu._id"
                :class="[ 
                    'bg-gray-50 shadow rounded-xl flex flex-col items-center justify-between', 
                    cartItem(menu._id)?.quantity > 0 ? 'border-2 border-[#F43264]' : 'border border-gray-100' 
                ]"
                >
                <div class="h-50 w-50 bg-gray-300 flex items-center justify-center text-gray-700">
                    <img
                    :src="getImageUrl(menu.fotoMenu)"
                    alt="Menu Photo"
                    class="w-full h-60 object-contain rounded-xl"
                    @error="console.error('Gambar tidak ditemukan:', menu.fotoMenu)"
                    />
                </div>
                <h2 class="mt-4 text-lg font-semibold">{{ menu.namaMenu }}</h2>
                <p class="text-gray-600 mt-2">Rp {{ formatHarga(menu.harga) }}</p>
                
                <!-- Tambahkan mt-auto agar posisi elemen counter atau tombol selalu di bawah -->
                <div class="mt-auto w-full flex justify-center">
                    <div 
                    v-if="cartItem(menu._id)" 
                    class="w-full flex bg-[#F43264] text-white items-center space-x-12 !px-[13px] rounded-lg"
                    >
                    <button
                        class="!px-4 !py-1 cursor-pointer hover:bg-[#F43264] rounded-lg"
                        @click="cartItem(menu._id) && updateCartQuantity(menu._id, cartItem(menu._id).quantity - 1)"
                    >
                        <span class="font-semibold text-4xl text-white">-</span>
                    </button>
                    
                    <span 
                        class="font-semibold text-2xl w-10 text-center"
                    >
                        {{ cartItem(menu._id)?.quantity || 0 }}
                    </span>
                    
                    <button
                        class="!px-4 !py-1 cursor-pointer hover:bg-[#F43264] rounded-lg"
                        @click="updateCartQuantity(menu._id, (cartItem(menu._id)?.quantity || 0) + 1)"
                    >
                        <span class="font-semibold text-3xl text-white">+</span>
                    </button>
                    </div>
                    <button
                    v-else
                    :disabled="menu.status !== 'aktif'"
                    class="mt-4 mb-6 max-w-[200px] w-auto !px-3 !py-2 rounded-lg text-rose-600 border border-rose-600 hover:bg-rose-500 hover:text-white disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
                    @click="addToCart(menu)"
                    >
                    {{ menu.status === 'aktif' ? 'Add to Cart' : 'Stok Habis' }}
                    </button>
                </div>
                </div>

            </div>
            <p v-else-if="!isLoading" class="text-gray-500">Menu tidak ditemukan.</p>
            <p v-else class="text-gray-500">Memuat menu...</p>
      </div>
  
      <!-- Bagian Cart -->
      <Cart />
    </div>
  </template>
  
  <script setup>
  import { computed, onMounted } from "vue";
  import { useMenuStore } from "@/stores/menuStores.js";
  import { useTransactionStore } from "@/stores/transactionStores.js";
  import Cart from "./Cart.vue";
  
  // Akses Pinia Store
  const menuStore = useMenuStore();
  const transactionStore = useTransactionStore();
  
  // Reactive data dari menuStore
  const menus = computed(() => menuStore.menus);
  const filters = menuStore.filters;
  const isLoading = menuStore.isLoading;
  
  // Reactive data dari transactionStore
  const cart = computed(() => transactionStore.cart);
  
  // Fetch menu saat pertama kali halaman diakses
  menuStore.fetchMenus();
  
  const addToCart = (menu) => {
    transactionStore.addToCart(menu);
  };
  
  const updateCartQuantity = (id, quantity) => {
    transactionStore.updateCartQuantity(id, quantity);
  };
  
  const cartItem = (id) => {
    return cart.value.find((item) => item._id === id);
  };
  
  const getImageUrl = (path) => {
    return path.startsWith('http')
      ? path
      : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/${path}`;
  };
  
  onMounted(() => {
    menuStore.fetchMenus().then(() => {
      menuStore.menus = menuStore.menus.map((menu) => ({
        ...menu,
        fotoMenu: menu.fotoMenu.startsWith('http') 
          ? menu.fotoMenu 
          : menu.fotoMenu.replace(/\\/g, '/'), // Ganti backslash dengan slash
      }));
    });
  });

  const formatHarga = (harga) => {
  return harga.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

  
  // Fungsi untuk menerapkan filter
  const applyFilters = async () => {
    await menuStore.fetchMenus();
  };
  </script>
  
  