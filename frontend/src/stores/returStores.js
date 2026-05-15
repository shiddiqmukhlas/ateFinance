import { defineStore } from 'pinia';
import { ref } from 'vue';
import customFetch from '@/api';

export const useReturStore = defineStore('retur', () => {
  const isLoading = ref(false);
  const errorAlert = ref(false);
  const errorMsg = ref('');
  const returList = ref([]); // kalau kamu butuh tampilkan semua data retur
  const returDetail = ref(null);

  // Create a new retur
  const createRetur = async ({ originalTransactionId, returnedItems, reason }) => {
    try {
      isLoading.value = true;
      errorAlert.value = false;
      errorMsg.value = '';

      const payload = {
        originalTransactionId,
        returnedItems,
        reason,
      };

      const { data } = await customFetch.post('/retur', payload);
      returList.value.push(data); // optional: hanya kalau kamu mau simpan di state
      return data;
    } catch (error) {
      errorAlert.value = true;
      errorMsg.value = error.response?.data?.message || 'Gagal membuat retur.';
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchAllRetur = async () => {
  try {
    isLoading.value = true;
    errorAlert.value = false;
    errorMsg.value = '';

    const { data } = await customFetch.get('/retur');
    returList.value = data;
  } catch (error) {
    errorAlert.value = true;
    errorMsg.value = error.response?.data?.message || 'Gagal mengambil data retur.';
    throw error;
  } finally {
    isLoading.value = false;
  }
};

const fetchReturById = async (id) => {
  try {
    isLoading.value = true;
    errorAlert.value = false;
    errorMsg.value = '';

    const { data } = await customFetch.get(`/retur/${id}`);
    console.log('✅ Data retur detail:', data);
    returDetail.value = data;
  } catch (error) {
    errorAlert.value = true;
    errorMsg.value = error.response?.data?.message || 'Gagal mengambil data retur.';
    throw error;
  } finally {
    isLoading.value = false;
  }
};

  return {
    returList,
    isLoading,
    errorAlert,
    errorMsg,
    returDetail,
    createRetur,
    fetchAllRetur,
    fetchReturById
  };
});
