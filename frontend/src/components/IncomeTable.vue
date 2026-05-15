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
            class="block w-full !px-3 !py-2 border border-gray-200 hover:border-pink-600 rounded-lg shadow-sm focus:outline-none focus:ring-pink-600 focus:border-pink-600 sm:text-sm"
          />
        </div>

        <!-- Date Range Picker -->
        <div class="flex items-center space-x-3">
          <label for="from" class="text-sm font-medium text-gray-700">From</label>
          <flat-pickr
            id="from"
            v-model="filters.from"
            :config="{
              dateFormat: 'd M Y',
            }"
            class="block w-full !px-3 !py-2 border border-gray-200 hover:border-pink-600 rounded-lg shadow-sm focus:outline-none focus:ring-pink-600 focus:border-pink-600 sm:text-sm"
            @change="applyFilters"
          />

          <label for="to" class="text-sm font-medium text-gray-700">To</label>
          <flat-pickr
            id="to"
            v-model="filters.to"
            :config="{
              dateFormat: 'd M Y',
            }"
            class="block w-full !px-3 !py-2 border border-gray-200 hover:border-pink-600 rounded-lg shadow-sm focus:outline-none focus:ring-pink-600 focus:border-pink-600 sm:text-sm"
            @change="applyFilters"
          />
        </div>

        <!-- Category Dropdown -->
        <div class="flex items-center space-x-2">
          <select
            id="category"
            v-model="filters.category"
            @change="applyFilters"
            class="block w-full !p-1 !py-2 bg-[#F43C6E] text-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:bg-rose-500 sm:text-sm cursor-pointer"
          >
            <option value="">Semua Kategori</option>
            <option
              v-for="category in categories"
              :key="category"
              :value="category"
            >
              {{ toPascalCase(category) }}
            </option>
          </select>
        </div>
      </div>

      <!-- Right: Buttons -->
      <div class="flex space-x-4 mb-4">
        <MainButton @click="openAddIncome = true" class="flex items-center space-x-2">
          <ion-icon name="add-outline" class="w-[20px] h-[20px] text-white"></ion-icon>
          <span>Tambah Pemasukan</span>
        </MainButton>
        <MainButton @click="handleExport" class="flex items-center space-x-2">
          <ion-icon name="download-outline" class="w-[20px] h-[20px]"></ion-icon>
          <span>Export</span>
        </MainButton>
      </div>
    </div>

    <!-- Tampilkan AddIncome berdasarkan openAddIncome -->
    <AddIncome v-if="openAddIncome" @close="openAddIncome = false"/>
    
    <!-- Error Alert -->
    <div
      v-if="incomeStore.errorAlert"
      class="bg-red-200 text-pink-700 px-4 py-3 rounded-md mb-4"
    >
      {{ incomeStore.errorMsg }}
    </div>

    <!-- Income Table -->
    <div class="shadow-md overflow-hidden rounded-lg border-t border-gray-200">
      <table class="table-auto w-full border-collapse">
        <thead>
          <tr class="bg-gray-100">
            <th class="!px-4 !py-3">Tanggal</th>
            <th class="!px-4 !py-3">Deskripsi</th>
            <th class="!px-4 !py-3">Nominal</th>
            <th class="!px-4 !py-3">Kategori</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(income, index) in filteredIncomes"
            :key="income._id"
            :class="index % 2 === 0 ? 'bg-gray-50' : 'bg-white'"
            class="text-center border-b border-gray-100"
          >
            <td class="px-4 !py-[15px]">
              {{
                formatTanggal(income.tanggal)
              }}
            </td>

            <td class="!px-4 !py-3.5">{{ income.deskripsi }}</td>
            <td class="!px-2 !py-3">
              <span class="!px-4 !py-0.75 rounded-lg text-rose-700">
                {{ income.nominal }}
              </span>
            </td>
            <td class="!px-5 !py-3">{{ toPascalCase(income.kategori) }}</td>
            <!-- Update Delete -->
              <td class="!px-5 !py-3 relative">
              <!-- Icon Ellipsis -->
              <ion-icon
                v-if="activeRowId !== income._id"
                name="ellipsis-horizontal-outline"
                class="absolute top-1/2 left-4 transform -translate-y-1/2 h-5 w-5 cursor-pointer"
                @click.stop="toggleMenu(income._id)" 
                ref="ellipsis"
              ></ion-icon>

              <!-- Menu untuk Edit dan Delete -->
              <div
                v-else
                class="absolute top-1/2 left-0 transform -translate-y-1/2 flex bg-white gap-4 rounded-lg shadow-lg z-50"
                ref="menu"
              >
                <button
                  class="flex items-center gap-2 text-sm hover:text-blue-500 cursor-pointer"
                  @click="editAction(income._id)"
                >
                  <ion-icon name="create-outline" class="h-5 w-5"></ion-icon>
                </button>
                <button
                  class="flex items-center gap-2 text-sm hover:text-red-500 cursor-pointer"
                  @click="deleteAction(income._id)"
                >
                  <ion-icon name="trash-outline" class="h-5 w-5"></ion-icon>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->

    
    <PaginationIncome :filters="filters"/>
    
    <EditIncome 
      v-if="openEditIncome" 
      :income="incomeToEdit" 
      @close="openEditIncome = false"/>


  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue';
import { exportIncomeToPDF } from '@/utils/exportPDF';
import FlatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import { useIncomeStore } from '@/stores/incomeStores';
import MainButton from '@/elements/MainButton.vue';
import AddIncome from '@/components/AddIncome.vue';
import EditIncome from '@/components/EditIncome.vue';


import PaginationIncome from '@/layouts/PaginationIncome.vue';

const openAddIncome = ref(false);
const activeRowId = ref(null); // Menyimpan ID baris yang sedang aktif
const menuRef = ref(null);
const ellipsisRef = ref(null);
const openEditIncome = ref(false);
const incomeToEdit = ref(null);


const incomeStore = useIncomeStore();
const filters = ref({
  keyword: '',
  from: '',
  to: '',
  category: '',
});

const categories = ref(["pendapatan online", "pendapatan offline", "investasi", "lainnya"]); // Example categories

const toPascalCase = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const formatTanggal = (date) => {
  if (!date) return '';
  
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
};


onMounted(async () => {
  await incomeStore.fetchIncomes();

  if (incomeStore.dateRange) {
    filters.value.from = incomeStore.dateRange.oldestDate
      ? new Date(incomeStore.dateRange.oldestDate).toISOString()
      : '';
    filters.value.to = new Date().toISOString(); // Tanggal hari ini dalam format ISO
  }

  applyFilters();
});


  const toDate = filters.value.to ? new Date(filters.value.to) : null;

  if (toDate) {
    toDate.setHours(23, 59, 59, 999);
    filters.value.to = toDate.toISOString(); // Kirim dalam format ISO
  }

  const applyFilters = () => {
  const fromDate = filters.value.from ? new Date(filters.value.from) : null;
  const toDate = filters.value.to ? new Date(filters.value.to) : null;

  if (fromDate) {
    filters.value.from = fromDate.toISOString(); // Format ke ISO
  }

  if (toDate) {
    toDate.setHours(23, 59, 59, 999); // Pastikan sampai akhir hari
    filters.value.to = toDate.toISOString(); // Format ke ISO
  }

  incomeStore.filters = { ...filters.value };
  incomeStore.fetchIncomes(1);
};



const filteredIncomes = computed(() => {
  const keyword = filters.value.keyword.toLowerCase();

  return incomeStore.incomes.filter((income) => {
    // Cek apakah keyword cocok dengan salah satu atribut
    const matchesKeyword = keyword
      ? (
          (income.deskripsi && income.deskripsi.toLowerCase().includes(keyword)) ||
          (income.kategori && income.kategori.toLowerCase().includes(keyword)) ||
          (income.nominal && income.nominal.toString().includes(keyword)) ||
          (income.tanggal && income.tanggal.includes(keyword)) // Tanggal dalam format YYYY-MM-DD
        )
      : true;

    // Cek apakah cocok dengan kategori yang dipilih
    const matchesCategory = filters.value.category
      ? income.kategori === filters.value.category
      : true;
    
    // Cek apakah cocok dengan rentang tanggal
    const matchesDate = filters.value.from || filters.value.to
    ? new Date(income.tanggal) >= new Date(filters.value.from || '1900-01-01') &&
      new Date(income.tanggal) <= new Date(filters.value.to || '3000-12-31').setHours(23, 59, 59, 999)
    : true;



    return matchesKeyword && matchesCategory && matchesDate;
  });
});

watch(
  () => incomeStore.dateRange,
  (newDateRange) => {
    if (newDateRange) {
      filters.value.from = formatTanggal(newDateRange.oldestDate);
      filters.value.to = formatTanggal(new Date()); // Tanggal hari ini
    }
  }
);

const handleExport = () => {
  // Data yang ingin diekspor (gunakan filteredIncomes)
  const dataToExport = filteredIncomes.value;

  if (dataToExport.length === 0) {
    alert("Tidak ada data untuk diekspor.");
    return;
  }

  exportIncomeToPDF(dataToExport, "Laporan Pemasukan");
};




// Deteksi klik di luar elemen
const handleClickOutside = (event) => {
  const clickedInsideMenu = menuRef.value?.contains(event.target);
  const clickedOnEllipsis = ellipsisRef.value?.contains(event.target);

  // Tutup menu jika klik di luar elemen menu atau ikon ellipsis
  if (!clickedInsideMenu && !clickedOnEllipsis) {
    activeRowId.value = null;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

const toggleMenu = (id) => {
  activeRowId.value = activeRowId.value === id ? null : id; // Aktifkan atau nonaktifkan menu
};



const editAction = (id) => {
  incomeStore.currentIncomeId = id;
  openEditIncome.value = true;
};


const deleteAction = async (id) => {
  if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;

  try {
    // Panggil endpoint delete di backend
    await incomeStore.deleteIncome(id);

    // Refresh data setelah penghapusan
    await incomeStore.fetchIncomes();
    alert("Data berhasil dihapus.");
  } catch (error) {
    alert("Gagal menghapus data.");
    console.error(error);
  }
};



</script>

<style scoped>
/* Warna latar belakang selang-seling */
.bg-gray-50 {
  background-color: #f6f7f9; /* Warna abu muda */
}

input::placeholder {
  color: #22262c; /* Gunakan warna abu-abu gelap */
  opacity: 1; /* Pastikan opasitasnya penuh */
}



</style>
