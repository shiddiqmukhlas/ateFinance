<template>
    <div class="flex justify-center items-center mt-6">
      <button
        v-if="expenseStore.pagination.currentPage > 1"
        class="flex items-center !p-0 rounded-md hover:text-rose-700"
        @click="fetchPreviousPage"
      >
        Previous
      </button>
      <div class="flex items-center space-x-2 mx-4">
        <button
          v-for="page in visiblePages"
          :key="page"
          :class="[
            '!px-3 !py-1 rounded-sm hover:text-rose-600 cursor-pointer',
            { 'border-b-2 border-rose-600 text-gray-800': page === expenseStore.pagination.currentPage }
          ]"
          @click="fetchPage(page)"
        >
          {{ page === '...' ? '...' : page }}
        </button>
      </div>
      <button
        v-if="expenseStore.pagination.currentPage < expenseStore.pagination.totalPages"
        class="flex items-center !p-0 rounded-md hover:text-rose-700"
        @click="fetchNextPage"
      >
        Next
      </button>
    </div>
  </template>
  
  <script setup>
  import { useExpenseStore } from '@/stores/expenseStores';
  import { computed } from 'vue';
  
  const expenseStore = useExpenseStore();
  const props = defineProps({
    filters: {
      type: Object,
      required: true,
    },
  });
  
  const fetchPreviousPage = () => {
    if (expenseStore.pagination.currentPage > 1) {
      expenseStore.fetchExpenses(expenseStore.pagination.currentPage - 1, props.filters);
    }
  };
  
  const fetchNextPage = () => {
    if (expenseStore.pagination.currentPage < expenseStore.pagination.totalPages) {
      expenseStore.fetchExpenses(expenseStore.pagination.currentPage + 1, props.filters);
    }
  };
  
  const fetchPage = (page) => {
    if (page !== '...' && page !== expenseStore.pagination.currentPage) {
      expenseStore.fetchExpenses(page, props.filters);
    }
  };
  
  const visiblePages = computed(() => {
    const totalPages = expenseStore.pagination.totalPages;
    const currentPage = expenseStore.pagination.currentPage;
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
  