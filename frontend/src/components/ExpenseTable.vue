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
            class="block w-full !p-1 !py-2 bg-[#6452F0] text-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:bg-[#623DE3] sm:text-sm cursor-pointer"
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
        <MainButton @click="openAddExpense = true" class="flex items-center space-x-2" bg-class="bg-[#6452F0]" hoverClass="hover:bg-[#623DE3]">
          <ion-icon name="add-outline" class="w-[20px] h-[20px] text-white"></ion-icon>
          <span>Tambah Pengeluaran</span>
        </MainButton>
        <MainButton @click="handleExport" class="flex items-center space-x-2" bg-class="bg-[#6452F0]" hoverClass="hover:bg-[#623DE3]">
          <ion-icon name="download-outline" class="w-[20px] h-[20px]"></ion-icon>
          <span>Export</span>
        </MainButton>
      </div>
    </div>

    <!-- Tampilkan AddExpense berdasarkan openAddExpense -->
    <AddExpense v-if="openAddExpense" @close="openAddExpense = false" />

    <!-- Error Alert -->
    <div
      v-if="expenseStore.errorAlert"
      class="bg-red-200 text-pink-700 px-4 py-3 rounded-md mb-4"
    >
      {{ expenseStore.errorMsg }}
    </div>

    <!-- Expense Table -->
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
            v-for="(expense, index) in filteredExpenses"
            :key="expense._id"
            :class="index % 2 === 0 ? 'bg-gray-50' : 'bg-white'"
            class="text-center border-b border-gray-100"
          >
            <td class="px-4 !py-[15px]">
              {{ formatTanggal(expense.tanggal) }}
            </td>

            <td class="!px-4 !py-3.5">{{ expense.deskripsi }}</td>
            <td class="!px-2 !py-3">
              <span class="!px-4 !py-0.75 rounded-lg text-[#5C39D6]">
                {{ expense.nominal }}
              </span>
            </td>
            <td class="!px-5 !py-3">{{ toPascalCase(expense.kategori) }}</td>
            <!-- Update Delete -->
            <td class="!px-5 !py-3 relative">
              <!-- Icon Ellipsis -->
              <ion-icon
                v-if="activeRowId !== expense._id"
                name="ellipsis-horizontal-outline"
                class="absolute top-1/2 left-4 transform -translate-y-1/2 h-5 w-5 cursor-pointer"
                @click.stop="toggleMenu(expense._id)" 
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
                  @click="editAction(expense._id)"
                >
                  <ion-icon name="create-outline" class="h-5 w-5"></ion-icon>
                </button>
                <button
                  class="flex items-center gap-2 text-sm hover:text-red-500 cursor-pointer"
                  @click="deleteAction(expense._id)"
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
    <PaginationExpense :filters="filters" />

    <EditExpense 
      v-if="openEditExpense" 
      :expense="expenseToEdit" 
      @close="openEditExpense = false" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue';
import { exportExpenseToPDF } from '@/utils/exportPDF';
import FlatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import { useExpenseStore } from '@/stores/expenseStores';
import MainButton from '@/elements/MainButton.vue';
import AddExpense from '@/components/AddExpense.vue';
import EditExpense from '@/components/EditExpense.vue';
import PaginationExpense from '@/layouts/PaginationExpense.vue';

const openAddExpense = ref(false);
const activeRowId = ref(null); // Menyimpan ID baris yang sedang aktif
const menuRef = ref(null);
const ellipsisRef = ref(null);
const openEditExpense = ref(false);
const expenseToEdit = ref(null);

const expenseStore = useExpenseStore();
const filters = ref({
  keyword: '',
  from: '',
  to: '',
  category: '',
});

const categories = ref([
  'peralatan',
  'bahan baku',
  'kemasan',
  'gaji karyawan',
  'tagihan',
  'lainnya',
]);

const toPascalCase = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
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
  await expenseStore.fetchExpenses();

  if (expenseStore.dateRange) {
    filters.value.from = expenseStore.dateRange.oldestDate
      ? new Date(expenseStore.dateRange.oldestDate).toISOString()
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

  if (fromDate) filters.value.from = fromDate.toISOString();
  if (toDate) {
    toDate.setHours(23, 59, 59, 999);
    filters.value.to = toDate.toISOString();
  }

  expenseStore.filters = { ...filters.value };
  expenseStore.fetchExpenses(1);
};

const filteredExpenses = computed(() => {
  const keyword = filters.value.keyword.toLowerCase();

  return expenseStore.expenses.filter((expense) => {
    const matchesKeyword = keyword
      ? expense.deskripsi.toLowerCase().includes(keyword) ||
        expense.kategori.toLowerCase().includes(keyword)
      : true;

    const matchesCategory = filters.value.category
      ? expense.kategori === filters.value.category
      : true;

    const matchesDate = filters.value.from || filters.value.to
      ? new Date(expense.tanggal) >= new Date(filters.value.from || '1900-01-01') &&
        new Date(expense.tanggal) <= new Date(filters.value.to || '3000-12-31').setHours(23, 59, 59, 999)
      : true;

    return matchesKeyword && matchesCategory && matchesDate;
  });
});



watch(
  () => expenseStore.dateRange,
  (newDateRange) => {
    if (newDateRange) {
      filters.value.from = formatTanggal(newDateRange.oldestDate);
      filters.value.to = formatTanggal(new Date()); // Tanggal hari ini
    }
  }
);


const handleExport = () => {
  const dataToExport = filteredExpenses.value;

  if (dataToExport.length === 0) {
    alert("Tidak ada data untuk diekspor.");
    return;
  }

  exportExpenseToPDF(dataToExport, "Laporan Pengeluaran");
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
  expenseStore.currentExpenseId = id;
  openEditExpense.value = true;
};


const deleteAction = async (id) => {
  if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;

  try {
    // Panggil endpoint delete di backend
    await expenseStore.deleteExpense(id);

    // Refresh data setelah penghapusan
    await expenseStore.fetchExpenses();
    alert("Data berhasil dihapus.");
  } catch (error) {
    alert("Gagal menghapus data.");
    console.error(error);
  }
};

</script>

<style scoped>
.bg-gray-50 {
  background-color: #f6f7f9;
}

input::placeholder {
  color: #22262c;
  opacity: 1;
}
</style>
