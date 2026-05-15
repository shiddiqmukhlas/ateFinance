<template>
    <div class="flex justify-center items-center mt-6">
      <button
        v-if="transactionStore.pagination.currentPage > 1"
        class="flex items-center !p-0 rounded-md hover:text-[#F43264]"
        @click="fetchPreviousPage"
      >
        Previous
      </button>
      <div class="flex items-center space-x-2 mx-4">
        <button
          v-for="page in visiblePages"
          :key="page"
          :class="[ 
            '!px-3 !py-1 rounded-sm hover:text-[#F43264] cursor-pointer', 
            { 'border-b-2 border-[#F43264] text-gray-800': page === transactionStore.pagination.currentPage }
          ]"
          @click="fetchPage(page)"
        >
          {{ page === '...' ? '...' : page }}
        </button>
      </div>
      <button
        v-if="transactionStore.pagination.currentPage < transactionStore.pagination.totalPages"
        class="flex items-center !p-0 rounded-md hover:text-[#F43264]"
        @click="fetchNextPage"
      >
        Next
      </button>
    </div>
  </template>
  
  <script setup>
  import { useTransactionStore } from '@/stores/transactionStores';
  import { computed } from 'vue';
  
  const transactionStore = useTransactionStore();
  const props = defineProps({
    filters: {
      type: Object,
      required: true,
    },
  });
  
  const fetchPreviousPage = () => {
    if (transactionStore.pagination.currentPage > 1) {
      transactionStore.fetchTransactions(transactionStore.pagination.currentPage - 1, props.filters);
    }
  };
  
  const fetchNextPage = () => {
    if (transactionStore.pagination.currentPage < transactionStore.pagination.totalPages) {
      transactionStore.fetchTransactions(transactionStore.pagination.currentPage + 1, props.filters);
    }
  };
  
  const fetchPage = (page) => {
    if (page !== '...' && page !== transactionStore.pagination.currentPage) {
      transactionStore.fetchTransactions(page, props.filters);
    }
  };
  
  const visiblePages = computed(() => {
    const totalPages = transactionStore.pagination.totalPages;
    const currentPage = transactionStore.pagination.currentPage;
    const pages = [];
  
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
  
    return pages;
  });
  </script>
  