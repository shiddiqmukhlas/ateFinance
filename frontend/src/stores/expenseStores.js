import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';
import customFetch from '@/api';

export const useExpenseStore = defineStore('expense', () => {
  const expenses = ref([]);
  const pagination = reactive({
    currentPage: 1,
    totalPages: 1,
  });
  const dateRange = ref({ oldestDate: '', newestDate: '' });
  const filters = ref({ keyword: '', from: '', to: '', category: '' });
  const isLoading = ref(false);
  const errorAlert = ref(false);
  const errorMsg = ref('');
  
  

  // Fungsi untuk mengambil pengeluaran
  const fetchExpenses = async (page = 1) => {
    isLoading.value = true;
    errorAlert.value = false;
    errorMsg.value = '';
    try {
      const params = { page };
      if (filters.value.keyword) params.keyword = filters.value.keyword;
      if (filters.value.from) params.from = filters.value.from;
      if (filters.value.to) params.to = filters.value.to;
      if (filters.value.category && filters.value.category.trim() !== '') {
        params.category = filters.value.category.trim();
      }

      const { data } = await customFetch.get('/expense', { params });

      expenses.value = data.data || [];
      pagination.currentPage = data.page || 1;
      pagination.totalPages = data.totalPages || Math.ceil((data.total || 0) / 11);
      pagination.totalItems = data.total || 0;

      dateRange.value.oldestDate = data.oldestDate || '';
      dateRange.value.newestDate = data.newestDate || '';

      
    } catch (error) {
      errorAlert.value = true;
      errorMsg.value = error.response?.data?.message || 'Gagal mengambil data pengeluaran.';
    } finally {
      isLoading.value = false;
    }

    

  };

  const createExpense = async (expenseData) => {
    isLoading.value = true;
    errorAlert.value = false;
    errorMsg.value = '';

    try {
      const formattedData = {
        ...expenseData,
        tanggal: expenseData.tanggal instanceof Date
          ? expenseData.tanggal.toISOString()
          : new Date(expenseData.tanggal).toISOString(),
      };

      const { data } = await customFetch.post('/expense', formattedData);

      const newTransactionDate = new Date(expenseData.tanggal);
      const oldestDate = dateRange.value.oldestDate ? new Date(dateRange.value.oldestDate) : null;

      if (!oldestDate || newTransactionDate < oldestDate) {
        await fetchExpenses(1);
      } else {
        await fetchExpenses(pagination.currentPage);
      }

      return data.data;
    } catch (error) {
      errorAlert.value = true;
      errorMsg.value = error.response?.data?.message || 'Gagal menambah pengeluaran.';
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteExpense = async (id) => {
    try {
      isLoading.value = true;
      errorAlert.value = false;
      errorMsg.value = '';

      await customFetch.delete(`/expense/${id}`);
    } catch (error) {
      errorAlert.value = true;
      errorMsg.value = error.response?.data?.message || 'Gagal menghapus data pengeluaran.';
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const getExpenseById = async (id) => {
    try {
      isLoading.value = true;
      errorAlert.value = false;
      errorMsg.value = '';

      const { data } = await customFetch.get(`/expense/${id}`);
      return data;
    } catch (error) {
      errorAlert.value = true;
      errorMsg.value = error.response?.data?.message || 'Gagal mengambil data pengeluaran.';
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const updateExpense = async (id, expenseData) => {
    isLoading.value = true;
    errorAlert.value = false;
    errorMsg.value = '';

    try {
      const formattedData = {
        ...expenseData,
        tanggal: expenseData.tanggal instanceof Date
          ? expenseData.tanggal.toISOString()
          : new Date(expenseData.tanggal).toISOString(),
      };

      const { data } = await customFetch.put(`/expense/${id}`, formattedData);
      await fetchExpenses(pagination.currentPage);
      return data;
    } catch (error) {
      errorAlert.value = true;
      errorMsg.value = error.response?.data?.message || 'Gagal memperbarui data pengeluaran.';
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    expenses,
    pagination,
    dateRange,
    filters,
    isLoading,
    errorAlert,
    errorMsg,
    fetchExpenses,
    createExpense,
    deleteExpense,
    getExpenseById,
    updateExpense,
  };
});
