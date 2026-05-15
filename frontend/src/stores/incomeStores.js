import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';
import customFetch from '@/api';


export const useIncomeStore = defineStore('income', () => {
  const incomes = ref([]);
  const pagination = reactive({
    currentPage: 1,
    totalPages: 1,
  });
  const dateRange = ref({ oldestDate: '', newestDate: '' });
  const filters = ref({ keyword: '', from: '', to: '', category: '' });
  const isLoading = ref(false);
  const errorAlert = ref(false);
  const errorMsg = ref('');



  // Fungsi untuk mengambil pemasukan
  const fetchIncomes = async (page = 1) => {
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
  
      const { data } = await customFetch.get('/income', { params });
  
      incomes.value = data.data || [];
      pagination.currentPage = data.page || 1;
      pagination.totalPages = data.totalPages || Math.ceil((data.total || 0) / 6);
      pagination.totalItems = data.total || 0;
  
      dateRange.value.oldestDate = data.oldestDate || '';
      dateRange.value.newestDate = data.newestDate || '';
    } catch (error) {
      errorAlert.value = true;
      errorMsg.value = error.response?.data?.message || 'Gagal mengambil data pemasukan.';
    } finally {
      isLoading.value = false;
    }
  };
  
  
const createIncome = async (incomeData) => {
    isLoading.value = true;
    errorAlert.value = false;
    errorMsg.value = '';

    try {
        // Format tanggal sebelum dikirim ke backend
        const formattedData = {
            ...incomeData,
            tanggal: incomeData.tanggal instanceof Date
              ? incomeData.tanggal.toISOString()
              : new Date(incomeData.tanggal).toISOString(),

        };

        const { data } = await customFetch.post('/income', formattedData);

        // Cek apakah tanggal pemasukan baru lebih lampau dari oldestDate
        const newTransactionDate = new Date(incomeData.tanggal);
        const oldestDate = dateRange.value.oldestDate ? new Date(dateRange.value.oldestDate) : null;

        if (!oldestDate || newTransactionDate < oldestDate) {
            // Perbarui data seluruhnya jika tanggal baru lebih lampau dari oldestDate
            await fetchIncomes(1);
        } else {
            // Jika tidak, cukup refresh halaman pertama
            await fetchIncomes(pagination.currentPage);
        }

        return data.data;
    } catch (error) {
        errorAlert.value = true;
        errorMsg.value = error.response?.data?.message || 'Gagal menambah pemasukan.';
        throw error;
    } finally {
        isLoading.value = false;
    }
};


const deleteIncome = async (id) => {
  try {
    isLoading.value = true;
    errorAlert.value = false;
    errorMsg.value = '';

    await customFetch.delete(`/income/${id}`);
  } catch (error) {
    errorAlert.value = true;
    errorMsg.value = error.response?.data?.message || 'Gagal menghapus data pemasukan.';
    throw error;
  } finally {
    isLoading.value = false;
  }
};


const getIncomeById = async (id) => {
  try {
    isLoading.value = true;
    errorAlert.value = false;
    errorMsg.value = '';

    const { data } = await customFetch.get(`/income/${id}`);
    return data;
  } catch (error) {
    errorAlert.value = true;
    errorMsg.value = error.response?.data?.message || 'Gagal mengambil data pemasukan.';
    throw error;
  } finally {
    isLoading.value = false;
  }
};

const updateIncome = async (id, incomeData) => {
  isLoading.value = true;
  errorAlert.value = false;
  errorMsg.value = '';

  try {
    const formattedData = {
      ...incomeData,
      tanggal: incomeData.tanggal instanceof Date
        ? incomeData.tanggal.toISOString()
        : new Date(incomeData.tanggal).toISOString(),
    };

    const { data } = await customFetch.put(`/income/${id}`, formattedData);
    await fetchIncomes(pagination.currentPage);
    return data;
  } catch (error) {
    errorAlert.value = true;
    errorMsg.value = error.response?.data?.message || 'Gagal memperbarui data pemasukan.';
    throw error;
  } finally {
    isLoading.value = false;
  }
};


  return {
    incomes,
    pagination,
    dateRange,
    filters,
    isLoading,
    errorAlert,
    errorMsg,
    fetchIncomes,
    createIncome,
    deleteIncome,
    getIncomeById,
    updateIncome,

  };

});
