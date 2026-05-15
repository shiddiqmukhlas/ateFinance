import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';
import customFetch from '@/api';

export const useMenuStore = defineStore('menu', () => {
  const menus = ref([]);
  const pagination = reactive({
    currentPage: 1,
    totalPages: 1,
  });
  const filters = ref({ keyword: '', category: '', status: '' });
  const isLoading = ref(false);
  const errorAlert = ref(false);
  const errorMsg = ref('');

  // Fungsi untuk mengambil menu
  const fetchMenus = async (page = 1) => {
    isLoading.value = true;
    errorAlert.value = false;
    errorMsg.value = '';
    try {
      const params = { page };
      if (filters.value.keyword) params.keyword = filters.value.keyword;
      if (filters.value.category && filters.value.category.trim() !== '') {
        params.category = filters.value.category.trim();
      }
      if (filters.value.status && filters.value.status.trim() !== '') {
        params.status = filters.value.status.trim();
      }

      const { data } = await customFetch.get('/menu', { params });

      menus.value = data.data || [];
      pagination.currentPage = data.page || 1;
      pagination.totalPages = data.totalPages || Math.ceil((data.total || 0) / 10);
      pagination.totalItems = data.total || 0;
    } catch (error) {
      errorAlert.value = true;
      errorMsg.value = error.response?.data?.message || 'Gagal mengambil data menu.';
    } finally {
      isLoading.value = false;
    }
  };

  const createMenu = async (menuData) => {
    isLoading.value = true;
    errorAlert.value = false;
    errorMsg.value = '';

    try {
      const { data } = await customFetch.post('/menu', menuData);

      // Refresh halaman pertama setelah penambahan menu baru
      await fetchMenus(1);

      return data.data;
    } catch (error) {
      errorAlert.value = true;
      errorMsg.value = error.response?.data?.message || 'Gagal menambah menu.';
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteMenu = async (id) => {
    try {
      isLoading.value = true;
      errorAlert.value = false;
      errorMsg.value = '';

      await customFetch.delete(`/menu/${id}`);

      // Refresh halaman setelah penghapusan
      await fetchMenus(pagination.currentPage);
    } catch (error) {
      errorAlert.value = true;
      errorMsg.value = error.response?.data?.message || 'Gagal menghapus data menu.';
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const getMenuById = async (id) => {
    try {
      isLoading.value = true;
      errorAlert.value = false;
      errorMsg.value = '';

      const { data } = await customFetch.get(`/menu/${id}`);
      return data;
    } catch (error) {
      errorAlert.value = true;
      errorMsg.value = error.response?.data?.message || 'Gagal mengambil data menu.';
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const updateMenu = async (id, menuData) => {
    isLoading.value = true;
    errorAlert.value = false;
    errorMsg.value = '';

    try {
      const { data } = await customFetch.put(`/menu/${id}`, menuData);
      await fetchMenus(pagination.currentPage);
      return data;
    } catch (error) {
      errorAlert.value = true;
      errorMsg.value = error.response?.data?.message || 'Gagal memperbarui data menu.';
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    menus,
    pagination,
    filters,
    isLoading,
    errorAlert,
    errorMsg,
    fetchMenus,
    createMenu,
    deleteMenu,
    getMenuById,
    updateMenu,
  };
});
