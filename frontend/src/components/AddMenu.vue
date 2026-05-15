<template>
    <div
      class="fixed inset-0 z-50 flex items-center justify-center"
      style="background-color: rgba(0, 0, 0, 0.5);"
      @click.self="emitClose"
    >
      <div class="bg-white w-full max-w-md !py-7 !px-10 rounded-3xl shadow-lg">
        <div class="flex justify-between">
          <h2 class="text-xl font-bold text-left mb-16">Tambah Menu</h2>
          <ion-icon 
            name="close-circle-outline" 
            class="w-7 h-7 cursor-pointer text-gray-700 hover:text-gray-900 hover:scale-110 transition-transform transition-colors duration-200"
            @click="emitClose"
          ></ion-icon>
        </div>
  
        <form @submit.prevent="handleSubmit" enctype="multipart/form-data">
          <div class="mb-4">
            <label for="namaMenu" class="block text-sm text-gray-600 mb-3">Nama Menu</label>
            <input
              type="text"
              id="namaMenu"
              v-model="form.namaMenu"
              autocomplete="off"
              class="block w-full !px-3 !pb-2 mb-3 border-b border-gray-700 text-xl focus:outline-none focus:ring-pink-600 focus:border-pink-600"
              placeholder="Masukkan nama menu"
              required
            />
          </div>
  
          <div class="mb-4">
            <label for="fotoMenu" class="block text-sm text-gray-600 mb-3">Foto Menu</label>
            <input
              type="file"
              id="fotoMenu"
              @change="handleFileUpload"
              class="block w-full !px-3 !py-2 border border-gray-300 bg-gray-200 rounded-lg shadow-md text-md text-black font-[450] focus:outline-none focus:ring-pink-600 focus:border-pink-600 hover:border-pink-600 cursor-pointer"
              accept="image/*"
              required
            />
          </div>
  
          <div class="mb-4">
            <label for="kategoriMenu" class="block text-sm text-gray-600 mb-2">Kategori Menu</label>
            <select
              id="kategoriMenu"
              v-model="form.kategoriMenu"
              class="block w-full !px-3 !py-2 border border-gray-300 bg-gray-200 rounded-lg shadow-md text-md text-black font-[450] focus:outline-none focus:ring-pink-600 focus:border-pink-600 hover:border-pink-600 cursor-pointer"
              required
            >
              <option value="">Pilih Kategori</option>
              <option value="makanan">Makanan</option>
              <option value="tambahan">Tambahan</option>
              <option value="cemilan">Cemilan</option>
              <option value="minuman">Minuman</option>
            </select>
          </div>
  
          <div class="mb-4">
            <label for="harga" class="block text-sm text-gray-600 mb-3">Harga</label>
            <div class="relative flex items-center">
                <span class="absolute left-0 top-1/2 transform -translate-y-1/2 !pl-3 !pb-5 text-2xl text-gray-900 leading-none">Rp</span>
                <input
                    type="text"
                    id="harga"
                    v-model="form.hargaFormatted"
                    min="1"
                    autocomplete="off"
                    @input="formatHarga"
                    class="block w-full !pl-13 !pb-2 mb-3 border-b border-gray-700 text-2xl focus:outline-none focus:ring-pink-600 focus:border-pink-600"
                    placeholder="Masukkan harga"
                    required
                    />
            </div>

          </div>
  
          <div class="mb-4">
            <label for="status" class="block text-sm text-gray-600 mb-2">Status</label>
            <select
              id="status"
              v-model="form.status"
              class="block w-full !px-3 !py-2 border border-gray-300 bg-gray-200 rounded-lg shadow-md text-md text-black font-[450] focus:outline-none focus:ring-pink-600 focus:border-pink-600 hover:border-pink-600 cursor-pointer"
              required
            >
              <option value="">Pilih Status</option>
              <option value="aktif">Aktif</option>
              <option value="stok habis">Stok Habis</option>
            </select>
          </div>
  
          <div class="flex justify-end mt-18 gap-4">
            <button
              type="button"
              @click="emitClose"
              class="!px-4 !py-2 bg-gray-200 text-black rounded-lg border border-gray-300 shadow-md hover:bg-gray-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="!px-4 !py-2 bg-[#2056FF] text-white rounded-lg border border-[#2056FF] shadow-md hover:bg-[#003FCC] cursor-pointer"
            >
              Simpan  
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, defineEmits } from 'vue';
  import { useMenuStore } from '@/stores/menuStores';
  
  const emit = defineEmits(['close', 'refreshTable']);
  const menuStore = useMenuStore();
  
  const form = ref({
    namaMenu: '',
    fotoMenu: null, // File foto yang diunggah
    kategoriMenu: '',
    harga: 1,
    hargaFormatted: '',
    status: '',
  });

  const formatHarga = () => {
  // Hapus karakter non-angka
  const cleanValue = form.value.hargaFormatted.replace(/\D/g, '');
  // Format tampilan angka dengan pemisah ribuan
  form.value.hargaFormatted = new Intl.NumberFormat('id-ID').format(cleanValue);
  // Simpan angka mentah ke properti harga
  form.value.harga = parseInt(cleanValue, 10) || 0; // Default ke 0 jika kosong
};

  
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) form.value.fotoMenu = file;
  };
  
  const handleSubmit = async () => {
  try {
    const formData = new FormData();
    formData.append('namaMenu', form.value.namaMenu);
    formData.append('fotoMenu', form.value.fotoMenu);
    formData.append('kategoriMenu', form.value.kategoriMenu);
    formData.append('harga', form.value.harga);
    formData.append('status', form.value.status);

    console.log('FormData:', Array.from(formData.entries())); // Debug
    const response = await menuStore.createMenu(formData);
    console.log('Response:', response); // Debug respons dari backend
    emit('refreshTable');
    emit('close');
  } catch (error) {
    console.error('Error adding menu:', error.message);
  }
};

  
  const emitClose = () => {
    emit('close');
  };
  </script>
  
  <style scoped>
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }
  </style>
  