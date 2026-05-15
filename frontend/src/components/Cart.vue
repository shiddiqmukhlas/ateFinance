<template>
    <div class="w-full lg:w-1/3 bg-white shadow rounded-lg flex flex-col">
      <div class="!py-5 !px-6">
        <!-- Heading untuk jumlah item di cart dan tombol Clear -->
        <div class="flex justify-between items-center mb-10">
          <h2 class="text-xl">
            <span class="font-bold text-2xl">{{ cartItemCount }}</span>
            <span class="text-gray-700 text-md"> item in cart</span>
          </h2>
          <button
            v-if="cartItemCount > 0"
            @click="clearCart"
            class="text-md text-gray-600 hover:text-red-700 px-2 py-1 rounded"
          >
            Clear
          </button>
        </div>
  
        <!-- Daftar item dalam cart -->
        <ul v-if="cart && cart.length > 0" class="space-y-2">
          <li
            v-for="item in cart"
            :key="item._id"
            class="flex justify-between items-center text-lg !py-1"
          >
            <div>
              {{ item.namaMenu }} ({{ item.quantity }}x)
            </div>
            <div>
              Rp {{ formatHarga(item.quantity * item.harga) }}
            </div>
            <button
              @click="removeFromCart(item._id)"
              class="text-red-500 ml-2 hover:text-red-700"
            >
              Hapus
            </button>
          </li>
        </ul>
        <p v-else class="text-gray-500">Cart kosong.</p>
      </div>
  
      <!-- Total harga -->
    <div class="mt-auto mb-4 bg-gray-50 flex justify-between items-center mx-6 !px-4 !py-2 rounded-lg text-lg font-medium text-gray-800">
        <span class="font-semibold text-gray-600 text-xl">Total</span>
        <span class="font-bold text-2xl">Rp {{ formatHarga(totalHarga) }}</span>
    </div>

  
      <!-- Tombol checkout -->
      <button
        class="w-full font-semibold text-xl !px-4 !py-4 rounded-lg"
        :class="{
          'bg-[#F43264] text-white hover:bg-rose-500 cursor-pointer': !isCheckoutDisabled,
          'bg-gray-400 text-gray-700 cursor-not-allowed': isCheckoutDisabled,
        }"
        :disabled="isCheckoutDisabled"
        @click="showConfirmDialog = true"
      >
        Checkout
      </button>
    </div>


  <!-- Modal Konfirmasi -->
  <div
    v-if="showConfirmDialog"
    class="fixed inset-0 flex items-center justify-center z-50"
    style="background-color: rgba(0, 0, 0, 0.5);"
  >
    <div class="bg-white rounded-2xl shadow-lg w-96 !py-6 !px-8">
      <!-- Header dengan Ikon Peringatan -->
      <div class="flex items-center mb-4">
        <!-- Ikon Peringatan -->
        <ion-icon
          name="warning-outline"
          class="text-rose-600 text-2xl mr-2"
        ></ion-icon>
        <h3 class="text-xl font-semibold">Konfirmasi Checkout</h3>
      </div>

      <!-- Isi Pesan -->
      <p class="text-gray-700 mb-6">
        Apakah Anda yakin ingin melanjutkan proses checkout?
      </p>

      <!-- Tombol Aksi -->
      <div class="flex justify-end space-x-4">
        <button
          @click="showConfirmDialog = false"
          class="!px-4 !py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
        >
          Cancel
        </button>
        <button
          @click="proceedCheckout"
          class="!px-4 !py-2 bg-[#F43264] text-white hover:bg-rose-500 rounded-lg"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>


  </template>
  
  <script setup>
  import axios from "axios";
  import { computed, ref } from "vue";
  import { generateInvoice } from "@/utils/invoiceUtils";
  import { useTransactionStore } from "@/stores/transactionStores";
  
  // Total jumlah item dalam cart
  const cartItemCount = computed(() => {
    return cart.value.reduce((total, item) => total + item.quantity, 0);
  });
  
  // Total harga dalam cart
  const totalHarga = computed(() => {
    return cart.value.reduce((total, item) => total + item.quantity * item.harga, 0);
  });
  
  // Akses store transaksi
  const transactionStore = useTransactionStore();
  const cart = computed(() => transactionStore.cart);
  const showConfirmDialog = ref(false);

  
  // Computed untuk memeriksa apakah checkout harus dinonaktifkan
  const isCheckoutDisabled = computed(() => {
    return !cart.value || cart.value.length === 0 || cart.value.some(item => item.quantity <= 0);
  });
  
  // Fungsi untuk checkout
  const proceedCheckout = async () => {
  try {
    if (cart.value.length === 0) {
      alert("Cart kosong, tidak ada yang bisa di-checkout.");
      return;
    }

    // Simpan transaksi ke database
    const response = await transactionStore.createTransaction(cart.value);
    const transactionData = response.data;

    // Ambil semua ID menu dari transactionData.items
    const menuIds = transactionData.items.map((item) => item.menu);

    // Panggil API untuk mendapatkan nama menu berdasarkan ID
    const menuResponse = await axios.post("/api/menu/details", { ids: menuIds });
    const menus = menuResponse.data; // Hasilnya berupa array detail menu

    // Pemetaan data menu ke dalam items invoice
    const invoiceItems = transactionData.items.map((item) => {
    const menuDetail = menus.find((menu) => menu._id === item.menu);
    return {
        name: menuDetail?.namaMenu || "Menu Tidak Diketahui", // Sesuaikan dengan 'namaMenu' dari backend
        quantity: item.quantity,
        price: menuDetail?.harga || 0, // Gunakan 'harga' dari backend
        total: item.totalHarga,
    };
    });



    // Data untuk invoice
    const invoiceData = {
      invoiceNumber: transactionData._id,
      date: new Date(transactionData.tanggalTransaksi).toLocaleDateString(),
      items: invoiceItems,
      total: transactionData.totalHarga,
    };

    console.log("Invoice Data:", invoiceData);

    // Generate PDF Invoice
    generateInvoice(invoiceData);
    showConfirmDialog.value = false;

    alert("Checkout berhasil! Invoice berhasil di-generate.");
  } catch (error) {
    console.error(error);
    alert(error.message || "Terjadi kesalahan saat checkout.");
  }
};




  
  // Fungsi untuk menghapus item dari cart
  const removeFromCart = (id) => {
    transactionStore.removeFromCart(id);
  };
  
  // Fungsi untuk mengosongkan seluruh cart
  const clearCart = () => {
    transactionStore.clearCart();
  };
  
  // Fungsi format harga
  const formatHarga = (harga) => {
    return harga.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  </script>
  