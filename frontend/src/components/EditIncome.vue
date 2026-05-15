<template>
    <div
      class="fixed inset-0 z-50 flex items-center justify-center"
      style="background-color: rgba(0, 0, 0, 0.5);"
      @click.self="emitClose"
    >
      <div class="bg-white w-full max-w-md !py-7 !px-10 rounded-3xl shadow-lg">
        <div class="flex justify-between">
          <h2 class="text-xl font-bold text-left mb-16">Edit Pemasukan</h2>
          <ion-icon 
            name="close-circle-outline" 
            class="w-7 h-7 cursor-pointer text-gray-700 hover:text-gray-900 hover:scale-110 transition-transform transition-colors duration-200"
            @click="emitClose"
          ></ion-icon>
        </div>
  
        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label for="nominal" class="block text-sm text-gray-600 mb-3">Nominal</label>
            <div class="relative flex items-center">
              <span class="absolute left-0 top-1/2 transform -translate-y-1/2 !pl-3 !pb-5 text-4xl text-gray-900 leading-none">Rp</span>
              <input
                type="text"
                id="nominal"
                v-model="form.nominalFormatted"
                autocomplete="off"
                @input="formatNominal"
                class="block w-full !pl-17 !pb-4 mb-1 border-b border-black text-5xl text-gray-800 font-semibold focus:outline-none focus:ring-pink-600 focus:border-pink-600 placeholder-gray-800 appearance-none"
                placeholder="0"
                required
              />
            </div>
          </div>
  
          <div class="mb-4">
            <label for="deskripsi" class="block text-sm text-gray-600 mb-4">Deskripsi</label>
            <input
              type="text"
              id="deskripsi"
              v-model="form.deskripsi"
              autocomplete="off"
              class="block w-full !px-3 !pb-2 mb-3 border-b border-gray-700 text-xl focus:outline-none focus:ring-pink-600 focus:border-pink-600"
              required
            />
          </div>
  
          <div class="mb-4">
            <label for="tanggal" class="block text-sm text-gray-600 mb-2">Tanggal</label>
            <flat-pickr
              id="tanggal"
              v-model="form.tanggal"
              :config="{
                dateFormat: 'Y-m-d', // Format internal (backend)
                altInput: true,
                altFormat: 'd M Y', // Format tampilan di UI
              }"
              class="block w-full !px-3 !py-2 mb-2 border border-gray-300 bg-gray-200 rounded-lg shadow-md text-md text-black font-[450] focus:outline-none focus:ring-pink-600 focus:border-pink-600 hover:border-pink-600 cursor-pointer"
            />
          </div>
  
          <div class="mb-6">
            <label for="kategori" class="block text-sm text-gray-600 mb-2">Kategori Pemasukan</label>
            <select
              id="kategori"
              v-model="form.kategori"
              class="block w-full !px-3 !py-2 border border-gray-300 bg-gray-200 rounded-lg shadow-md text-md text-black font-[450] focus:outline-none focus:ring-pink-600 focus:border-pink-600 hover:border-pink-600 cursor-pointer"
            >
              <option value="">Pilih Kategori</option>
              <option value="pendapatan offline">Pendapatan Offline</option>
              <option value="pendapatan online">Pendapatan Online</option>
              <option value="investasi">Investasi</option>
              <option value="lainnya">Lainnya</option>
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
  import { ref, onMounted, defineEmits } from 'vue';
  import { useIncomeStore } from '@/stores/incomeStores';
  import FlatPickr from 'vue-flatpickr-component';
  import 'flatpickr/dist/flatpickr.css';
  
  const emit = defineEmits(['close', 'refreshTable']);
  const incomeStore = useIncomeStore();
  
  const form = ref({
    nominal: '',
    nominalFormatted: '',
    deskripsi: '',
    tanggal: '',
    kategori: '',
  });
  
  const formatNominal = () => {
    const cleanValue = form.value.nominalFormatted.replace(/\D/g, '');
    form.value.nominalFormatted = new Intl.NumberFormat('id-ID').format(cleanValue);
    form.value.nominal = cleanValue;
  };
  
  const handleSubmit = async () => {
  try {
    if (!form.value.id) {
      console.error('No ID provided for update.');
      return;
    }
    const selectedDate = new Date(form.value.tanggal);
    form.value.tanggal = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;

    await incomeStore.updateIncome(form.value.id, form.value);
    emit('close');
    emit('refreshTable');
  } catch (error) {
    console.error('Error updating income:', error.message);
  }
};

  
  const emitClose = () => {
    emit('close');
  };
  
  const loadIncomeData = async (id) => {
  try {
    if (!id) {
      console.error('ID is missing. Unable to load income data.');
      return;
    }
    const income = await incomeStore.getIncomeById(id);
    if (!income) {
      console.error('No income found for the provided ID:', id);
      return;
    }
    form.value = {
      id: income._id,
      nominal: income.nominal,
      nominalFormatted: new Intl.NumberFormat('id-ID').format(income.nominal),
      deskripsi: income.deskripsi,
      tanggal: new Date(income.tanggal).toISOString().split('T')[0],
      kategori: income.kategori,
    };
  } catch (error) {
    console.error('Error loading income data:', error.message);
  }
};

  
  onMounted(() => {
    if (incomeStore.currentIncomeId) {
      loadIncomeData(incomeStore.currentIncomeId);
    }
  });
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
  