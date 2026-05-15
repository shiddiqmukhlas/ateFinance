<template>
    <div>
      <!-- Filter Section -->
      <div class="flex items-center justify-between flex-wrap space-y-2 mb-3 mt-18">
        <div class="flex items-center space-x-5">
          <!-- Search Input -->
          <div class="flex items-center space-x-2">
            <input
              id="search"
              type="text"
              v-model="filters.keyword"
              @input="applyFilters"
              placeholder="Search..."
              class="block w-full !px-3 !py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
  
          <!-- Date Range Picker -->
          <div class="flex items-center space-x-3">
            <label for="from" class="text-sm font-medium text-gray-700">From</label>
            <input
              id="from"
              type="date"
              v-model="filters.from"
              @change="applyFilters"
              class="block w-full !px-3 !py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
  
            <label for="to" class="text-sm font-medium text-gray-700">To</label>
            <input
              id="to"
              type="date"
              v-model="filters.to"
              @change="applyFilters"
              class="block w-full !px-3 !py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
  
          <!-- Category Dropdown -->
          <div class="flex items-center space-x-2">
            <select
              id="transactionType"
              v-model="filters.transactionType"
              @change="applyFilters"
              class="block w-full !p-2 bg-[#6452F0] text-white border border-gray-300 rounded-lg shadow-sm focus:outline-none bg-[#623DE3] sm:text-sm"
            >
              <option value="">Semua Tipe</option>
              <option value="asli">Asli</option>
              <option value="retur">Retur</option>
                
            </select>
          </div>
        </div>
      </div>
  
      <!-- Transaction Table -->
      <div class="shadow-md overflow-hidden rounded-lg border-t border-gray-200">
        <table class="table-auto w-full border-collapse">
          <thead>
            <tr class="bg-gray-100">
              <th class="!px-4 !py-3">ID Transaksi</th>
              <th class="!px-4 !py-3">Tanggal</th>
              <th class="!px-4 !py-3">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(transaction, index) in filteredTransactions"
              :key="transaction._id"
              :class="index % 2 === 0 ? 'bg-gray-50' : 'bg-white'"
              class="text-center border-b border-gray-100"
            >
              <td class="!px-4 !py-3">{{ transaction._id }}</td>
              <td class="!px-4 !py-3">{{ formatDate(transaction.tanggalTransaksi) }}</td>
              <td class="!px-4 !py-3">{{ formatCurrency(transaction.grandTotal) }}</td>
              <td class="!px-4 !py-3">
                <div class="flex justify-center space-x-4">
                    <button
                    class="text-blue-600 hover:text-blue-800"
                    @click="clickTransactionDetail(transaction._id)"
                    >
                    <ion-icon name="eye-outline" class="text-[#6452F0] text-lg cursor-pointer"></ion-icon>
                    </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- tampilkan transactionDetail berdasarkan openTransactionDetail -->
      <TransactionDetail v-if="openTransactionDetail" :transactionId="selectedTransactionId" @close="openTransactionDetail = false" />
      <ReturDetail v-if="openReturDetail" :transactionId="selectedTransactionId" :retur-id="selectedReturId" @close="openReturDetail = false" />
  
      <!-- Pagination -->
      <PaginationTransaction :filters="filters" />
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, watchEffect } from "vue";
  import { useTransactionStore } from "@/stores/transactionStores.js";
  import PaginationTransaction from "@/layouts/PaginationTransaction.vue";
  import TransactionDetail from "./TransactionDetail.vue";
  import ReturDetail from "./ReturDetail.vue";
  
  const transactionStore = useTransactionStore();
  const filters = ref({
    keyword: "",
    from: "",
    to: "",
    transactionType: "",
  });

  const openTransactionDetail = ref(false);
  const openReturDetail = ref(false);
  const selectedTransactionId = ref(null);
  const selectedReturId = ref('');
  
const clickTransactionDetail = (transactionId, returId) => {
  selectedTransactionId.value = transactionId;
  selectedReturId.value = returId;

  // Cari object transaksi berdasarkan ID
  const transaction = transactionStore.transactions.find(t => t._id === transactionId);
  if (!transaction) {
    console.error("Transaksi tidak ditemukan");
    return;
  }

  // Cek apakah totalHarga, subtotal, atau grandTotal negatif
  if (
    (transaction.totalHarga && transaction.totalHarga < 0) ||
    (transaction.subtotal && transaction.subtotal < 0) ||
    (transaction.grandTotal && transaction.grandTotal < 0)
  ) {
    openReturDetail.value = true;
    openTransactionDetail.value = false;
  } else {
    openTransactionDetail.value = true;
    openReturDetail.value = false;
  }
};


  
  const formatDate = (datetime) => {
    const date = new Date(datetime);
    return date.toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };
  
  onMounted(async () => {
  await transactionStore.fetchEarliestTransactionDate();

  // Pastikan tanggal awal tersedia
  if (!filters.value.from) {
    console.error("Tanggal awal tidak ditemukan!");
    return;
  }

  // Set tanggal akhir ke hari ini
  const today = new Date();
    filters.value.to = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;


  // Ambil transaksi awal dengan pagination
  await transactionStore.fetchTransactions(transactionStore.pagination.currentPage);

  console.log("Tanggal From:", filters.value.from);
  console.log("Tanggal To:", filters.value.to);
  console.log("Data Transaksi:", transactionStore.transactions);
});






  
const applyFilters = () => {
  if (!filters.value.from && !filters.value.to) return;

  // Validasi range tanggal
  if (filters.value.from && filters.value.to) {
    const fromDate = new Date(filters.value.from);
    const toDate = new Date(filters.value.to);
    if (fromDate > toDate) {
      console.error("Tanggal 'from' tidak boleh lebih besar dari 'to'");
      return;
    }
  }

  transactionStore.filters = { ...filters.value };
  transactionStore.fetchTransactions(1); // Reset ke halaman pertama
};


const filteredTransactions = computed(() => {
  return transactionStore.transactions;
});





watchEffect(() => {
  if (!filters.value.from && transactionStore.filters.from) {
    filters.value.from = transactionStore.filters.from;
  }
});


  

  </script>
  
  <style scoped>
  .bg-gray-50 {
    background-color: #f9fafb;
  }
  </style>
  