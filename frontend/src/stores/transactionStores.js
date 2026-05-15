import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';
import customFetch from '@/api';

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref([]);
  const pagination = reactive({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });
  const filters = ref({
    keyword: '',
    from: '',
    to: '',
    transactionType: '',
  });

  const isLoading = ref(false);
  const errorAlert = ref(false);
  const errorMsg = ref('');

  const cart = ref([]); // Cart transaksi


  const addToCart = (menu) => {
    const existingItem = cart.value.find((item) => item._id === menu._id);
    if (existingItem) {
      existingItem.quantity += 1; // Tambahkan kuantitas jika item sudah ada
    } else {
      cart.value.push({ ...menu, quantity: 1 }); // Tambahkan item baru
    }
  };
  
  const removeFromCart = (id) => {
    cart.value = cart.value.filter((item) => item._id !== id); // Hapus item berdasarkan ID
  };
  
  const clearCart = () => {
    cart.value = []; // Kosongkan cart
  };

  const updateCartQuantity = (id, quantity) => {
    const itemIndex = cart.value.findIndex((item) => item._id === id);
  
    if (itemIndex !== -1) {
      if (quantity > 0) {
        cart.value[itemIndex].quantity = quantity; // Perbarui kuantitas
      } else {
        cart.value.splice(itemIndex, 1); // Hapus item jika kuantitas 0
      }
    }
  };
  
  
  
  


  const createTransaction = async (cartItems) => {
    try {
        console.log('Payload:', cartItems);
        console.log('Endpoint:', '/api/transaction'); // Pastikan endpoint ini benar

      isLoading.value = true;
      errorAlert.value = false;
      errorMsg.value = '';
  
      // Format data yang akan dikirim ke backend
      const payload = {
        items: cartItems.map((item) => ({
          namaMenu: item.namaMenu,
          quantity: item.quantity,
        })),
      };
      
      // Kirim data ke endpoint backend
      const { data } = await customFetch.post('/transaction', payload); 
      // Kosongkan cart setelah sukses
      clearCart();

      await fetchTransactions(1);

  
      return data;
    } catch (error) {
      errorAlert.value = true;
      errorMsg.value = error.response?.data?.message || 'Gagal melakukan transaksi.';
      throw error;
    } finally {
      isLoading.value = false;
    }
  };
  

// Ambil tanggal transaksi paling awal (tanpa pagination)
const fetchEarliestTransactionDate = async () => {
    try {
      const { data } = await customFetch.get("/transaction/earliest-date");
      if (data?.date) {
        // Validasi tambahan untuk memastikan format date yang diterima
        const parsedDate = new Date(data.date);
        if (!isNaN(parsedDate)) {
          filters.value.from = parsedDate.toISOString().split("T")[0];
        } else {
          console.error("Format tanggal tidak valid:", data.date);
        }
      }
    } catch (error) {
      console.error("Gagal mendapatkan tanggal transaksi paling awal:", error);
    }
  };
  
  
  // Fetch transaksi dengan filter dan pagination
  const fetchTransactions = async (page = 1) => {
    isLoading.value = true;
    errorAlert.value = false;
    errorMsg.value = "";
    try {
        const params = { page, limit: 10 }; // Pagination limit
        if (filters.value.keyword.trim()) params.keyword = filters.value.keyword.trim(); // Hilangkan spasi berlebih
        if (filters.value.transactionType) params.transactionType = filters.value.transactionType;
        if (filters.value.from) params.from = filters.value.from;
        if (filters.value.to) params.to = filters.value.to;

        const { data } = await customFetch.get("/transaction", { params });

        transactions.value = data.data || [];
        pagination.currentPage = data.page || 1;
        pagination.totalPages = data.totalPages || Math.ceil((data.total || 0) / 10);
        pagination.totalItems = data.total || 0;
    } catch (error) {
        errorAlert.value = true;
        errorMsg.value = error.response?.data?.message || "Gagal mengambil data transaksi.";
        console.error("Error fetching transactions:", error);
    } finally {
        isLoading.value = false;
    }
};

  
  

  // Get a transaction by ID
  const getTransactionById = async (id) => {
    try {
      isLoading.value = true;
      errorAlert.value = false;
      errorMsg.value = '';

      const { data } = await customFetch.get(`/transaction/${id}`);
      return data;
    } catch (error) {
      errorAlert.value = true;
      errorMsg.value = error.response?.data?.message || 'Gagal mengambil data transaksi.';
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  // Update a transaction
  const updateTransaction = async (id, transactionData) => {
    isLoading.value = true;
    errorAlert.value = false;
    errorMsg.value = '';

    try {
      const { data } = await customFetch.put(`/transaction/${id}`, transactionData);
      await fetchTransactions(pagination.currentPage);
      return data;
    } catch (error) {
      errorAlert.value = true;
      errorMsg.value = error.response?.data?.message || 'Gagal memperbarui transaksi.';
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  // Delete a transaction
  const deleteTransaction = async (id) => {
    try {
      isLoading.value = true;
      errorAlert.value = false;
      errorMsg.value = '';

      await customFetch.delete(`/transaction/${id}`);

      // Refresh transactions
      await fetchTransactions(pagination.currentPage);
    } catch (error) {
      errorAlert.value = true;
      errorMsg.value = error.response?.data?.message || 'Gagal menghapus transaksi.';
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    transactions,
    pagination,
    filters,
    isLoading,
    errorAlert,
    errorMsg,
    fetchTransactions,
    createTransaction,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
    fetchEarliestTransactionDate,
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    updateCartQuantity

  };
});
