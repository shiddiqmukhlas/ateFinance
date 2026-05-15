<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center"
    style="background-color: rgba(0, 0, 0, 0.5);"
    @click.self="emitClose"
  >
    <div class="bg-white w-full max-w-lg !py-6 !px-8 rounded-3xl shadow-lg relative">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-gray-800">Detail Transaksi</h2>
        <ion-icon 
          name="close-circle-outline" 
          class="w-7 h-7 cursor-pointer text-gray-700 hover:text-gray-900 hover:scale-110 transition-transform transition-colors duration-200"
          @click="emitClose"
        ></ion-icon>
      </div>

      <div v-if="transaction" class="text-sm space-y-2">
        <p><span class="font-semibold">ID Transaksi:</span> {{ transaction._id }}</p>
        <p><span class="font-semibold">Tanggal:</span> {{ formatDate(transaction.tanggalTransaksi) }}</p>
        <p><span class="font-semibold">Grand Total:</span> Rp {{ formatRupiah(transaction.grandTotal) }}</p>

        <div>
          <h3 class="font-semibold mt-2 mb-2">Items:</h3>
          <table class="w-full text-sm border-collapse">
            <thead>
              <tr class="bg-gray-100 text-gray-700">
                <th class="text-left !py-1 !px-2 border-b">Menu</th>
                <th class="text-left !py-1 !px-2 border-b">Kategori</th>
                <th class="text-right !py-1 !px-2 border-b">Harga</th>
                <th class="text-center !py-1 !px-2 border-b">Qty</th>
                <th class="text-right !py-1 !px-2 border-b">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in transaction.items" :key="index" class="border-b">
                <td class="!py-1 !px-2">{{ item.menu }}</td>
                <td class="!py-1 !px-2 capitalize">{{ item.category }}</td>
                <td class="!py-1 !px-2 text-right">Rp {{ formatRupiah(item.price) }}</td>
                <td class="!py-1 !px-2 text-center">{{ item.quantity }}</td>
                <td class="!py-1 !px-2 text-right">Rp {{ formatRupiah(item.subTotal) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-else class="text-center text-gray-500 text-sm py-4">
        Tidak ada data transaksi.
      </div>

      <div class="flex justify-end mt-8 gap-4">
        <button
            @click="showReturModal = true"
            class="!px-4 !py-2 bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-900"
            >
            Retur Transaksi
        </button>

        <button
          @click="emitClose"
          class="!px-4 !py-2 bg-gray-200 text-black rounded-lg border border-gray-300 shadow-md hover:bg-gray-300 cursor-pointer"
        >
          Tutup
        </button>
      </div>
    </div>
  </div>

<TransactionRetur
  :show="showReturModal"
  :items="transaction?.items || []"
  :originalTransactionId="transaction?._id"
  @close="showReturModal = false"
/>


</template>

<script setup>
import { defineProps, defineEmits, onMounted, computed, ref } from 'vue';
import { useTransactionStore } from '@/stores/transactionStores';
import TransactionRetur from './TransactionRetur.vue';

const emit = defineEmits(['close']);
const props = defineProps({
  isOpen: { type: Boolean, required: true },
  transactionId: { type: String, required: false }, // tambahkan ini untuk ID
});

const showReturModal = ref(false);
const transactionStore = useTransactionStore();

// Ambil data transaksi berdasarkan ID
const transaction = computed(() => {
  if (!props.transactionId) return null;
  return transactionStore.transactions.find(t => t._id === props.transactionId) || null;
});

const emitClose = () => {
  emit('close');
};

function formatRupiah(number) {
  return number?.toLocaleString('id-ID');
}

function formatDate(dateStr) {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateStr).toLocaleString('id-ID', options);
}
</script>

