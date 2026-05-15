<template>
    <div>
      <!-- Filter Section & Buttons -->
      <div class="flex items-center justify-between flex-wrap space-y-2 mb-3 mt-18">
        <!-- Left: Filters -->
        <div class="flex items-center space-x-5">
          <!-- Search Input -->
          <div class="flex items-center space-x-2">
            <input
              id="search"
              type="text"
              v-model="filters.keyword"
              autocomplete="off"
              @input="applyFilters"
              placeholder="Search..."
              class="block w-full !px-3 !py-2 border border-gray-200 hover:border-blue-600 rounded-lg shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
            />
          </div>
  
          <!-- Category Dropdown -->
          <div class="flex items-center space-x-2">
            <select
              id="category"
              v-model="filters.category"
              @change="applyFilters"
              class="block w-full !p-1 !py-2 bg-[#6452F0] text-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:bg-[#623DE3] sm:text-sm cursor-pointer"
            >
              <option value="">All Categories</option>
              <option
                v-for="category in categories"
                :key="category"
                :value="category"
              >
                {{ toPascalCase(category) }}
              </option>
            </select>
          </div>
  
          <!-- Status Dropdown -->
          <div class="flex items-center space-x-2">
            <select
              id="status"
              v-model="filters.status"
              @change="applyFilters"
              class="block w-full !p-1 !py-2 bg-[#6452F0] text-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:bg-[#623DE3] sm:text-sm cursor-pointer"
            >
                <option value="">All Status</option>
                <option value="aktif">Aktif</option>
                <option value="stok habis">Stok Habis</option>
            </select>
          </div>
        </div>
  
        <!-- Right: Buttons -->
        <div class="flex space-x-4 mb-4">
          <MainButton @click="openAddMenu = true" class="flex items-center space-x-2" bg-class="bg-[#F43264]" hoverClass="hover:bg-rose-500">
            <ion-icon name="add-outline" class="w-[20px] h-[20px] text-white"></ion-icon>
            <span>Add Menu</span>
          </MainButton>
        </div>
      </div>
      
  
      <!-- AddMenu Modal -->
      <AddMenu v-if="openAddMenu" @close="openAddMenu = false" />
  
      <!-- Error Alert -->
      <div
        v-if="menuStore.errorAlert"
        class="bg-red-200 text-red-700 px-4 py-3 rounded-md mb-4"
      >
        {{ menuStore.errorMsg }}
      </div>
  
      <!-- Menu Table -->
      <div class="shadow-md overflow-hidden rounded-lg border-t border-gray-200">
        <table class="table-auto w-full border-collapse table-fixed"> <!-- Tambahkan 'table-fixed' -->
            <thead>
            <tr class="bg-gray-100">
                <th class="!px-4 !py-3 w-1/3">Menu</th> <!-- Atur lebar kolom -->
                <th class="!px-4 !py-3 w-1/6">Kategori</th>
                <th class="!px-4 !py-3 w-1/6">Harga</th>
                <th class="!px-4 !py-3 w-1/6">Status</th>
                <th class="!px-4 !py-3 w-1/6">Actions</th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="(menu, index) in filteredMenus"
                :key="menu._id"
                :class="index % 2 === 0 ? 'bg-gray-50' : 'bg-white'"
                class="text-center border-b border-gray-100"
            >
                <td class="!px-18 !py-3 flex items-center space-x-10">
                <img :src="getImageUrl(menu.fotoMenu)" 
                    alt="Menu Photo" 
                    class="w-20 h-20 object-cover rounded-lg" 
                    @error="console.error('Gambar tidak ditemukan:', menu.fotoMenu)" />
                <span class="truncate">{{ menu.namaMenu }}</span> <!-- Tambahkan 'truncate' -->
                </td>
                <td class="!px-4 !py-3">{{ toPascalCase(menu.kategoriMenu) }}</td>
                <td class="!px-4 !py-3">{{ formatCurrency(menu.harga) }}</td>
                <td class="!px-4 !py-3">
                <span :class="menu.status === 'aktif' ? 'text-[#6452F0]' : 'text-red-600'">
                    {{ toPascalCase(menu.status) }}
                </span>
                </td>
                <td class="!px-4 !py-3">
                <div class="flex justify-center space-x-4">
                    <button
                    class="text-blue-600 hover:text-blue-800"
                    @click="editAction(menu._id)"
                    >
                    Edit
                    </button>
                    <button
                    class="text-red-600 hover:text-red-800"
                    @click="deleteAction(menu._id)"
                    >
                    Delete
                    </button>
                </div>
                </td>
            </tr>
            </tbody>
        </table>
        </div>

  
      <!-- Pagination -->
      <PaginationMenu :filters="filters" />
  
      <!-- EditMenu Modal -->
      <EditMenu v-if="openEditMenu" :menu="menuToEdit" @close="openEditMenu = false" />
    </div>
  </template>

  
  <script setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import { useMenuStore } from '@/stores/menuStores';
  import MainButton from '@/elements/MainButton.vue';
  import AddMenu from '@/components/AddMenu.vue';
  import EditMenu from '@/components/EditMenu.vue';
  import PaginationMenu from '@/layouts/PaginationMenu.vue';
  
  const openAddMenu = ref(false);
  const openEditMenu = ref(false);
  const menuToEdit = ref(null);
  const menuStore = useMenuStore();
  const filters = ref({
    keyword: '',
    category: '',
    status: '',
  });
  
  const categories = ref(['makanan', 'tambahan', 'cemilan', 'minuman']);

  
  const toPascalCase = (str) => {
    if (!str) return '';
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
};

  
  const applyFilters = () => {
    menuStore.filters = { ...filters.value };
    menuStore.fetchMenus(1);
  };
  
  const filteredMenus = computed(() => {
  const keyword = filters.value.keyword.toLowerCase();
  return menuStore.menus.filter((menu) => {
    const matchesKeyword = keyword
      ? menu.namaMenu.toLowerCase().includes(keyword) ||
        menu.kategoriMenu.toLowerCase().includes(keyword)
      : true;

    const matchesCategory = filters.value.category
      ? menu.kategoriMenu === filters.value.category
      : true;

    const matchesStatus = filters.value.status
      ? menu.status === filters.value.status
      : true;

    return matchesKeyword && matchesCategory && matchesStatus;
  });
});

  
const editAction = (id) => {
  menuStore.currentMenuId = id; // Set ID yang sedang diedit
  openEditMenu.value = true;
};

  
  const deleteAction = async (id) => {
    if (!confirm('Are you sure you want to delete this menu?')) return;
  
    try {
      await menuStore.deleteMenu(id);
      alert('Menu deleted successfully.');
    } catch (error) {
      alert('Failed to delete menu.');
    }
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




  </script>
  
  <style scoped>
  .bg-gray-50 {
    background-color: #f6f7f9;
  }
  </style>
  