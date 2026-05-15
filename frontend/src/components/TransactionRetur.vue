<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" style="background-color: rgba(0, 0, 0, 0.5);">
    <div class="bg-white w-full max-w-md rounded-2xl shadow-xl !p-6 relative">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-bold text-gray-800">Retur Transaksi</h2>
        <ion-icon 
          name="close-outline" 
          class="w-6 h-6 text-gray-600 hover:text-black cursor-pointer"
          @click="$emit('close')"
        ></ion-icon>
      </div>

      <p class="text-sm text-gray-600 mb-2">Atur jumlah item yang ingin diretur:</p>

      <div class="space-y-3 max-h-60 overflow-y-auto !pr-1">
        <div 
          v-for="(item, index) in itemsWithQty" 
          :key="index"
          class="flex justify-between items-center border rounded-lg !p-2 text-sm"
        >
          <div class="flex-1">
            <p class="font-medium">
            {{ typeof item.menu === 'object' ? item.menu.namaMenu : item.menu }}
            </p>
            <p class="text-xs text-gray-500">Qty dibeli: {{ item.quantity }}</p>
            <p class="text-xs text-gray-500">Rp {{ formatRupiah(item.subTotal) }}</p>
          </div>
          <input
            type="number"
            class="w-16 border border-gray-300 rounded-md !p-1 text-sm text-center focus:ring-2 focus:ring-blue-500"
            v-model.number="item.returnQty"
            :min="0"
            :max="item.quantity"
          />
        </div>
      </div>

      <!-- <div class="mt-4">
        <label class="text-sm font-medium text-gray-700">Alasan retur</label>
        <textarea v-model="reason" rows="3" class="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
      </div> -->

      <div class="flex justify-end gap-3 mt-6">
        <button @click="$emit('close')" class="bg-gray-200 text-gray-700 rounded-lg !px-4 !py-2 hover:bg-gray-300">Batal</button>
        <button @click="submitRetur" class="bg-red-500 text-white rounded-lg !px-4 !py-2 hover:bg-rose-600">Submit Retur</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useReturStore } from '@/stores/returStores';
import { useTransactionStore } from '@/stores/transactionStores';

const transactionStore = useTransactionStore();

const returStore = useReturStore();

const props = defineProps({
  show: Boolean,
  items: Array,
  originalTransactionId: String,
});

const reason = ref('');
const itemsWithQty = ref([]);
const emit = defineEmits(['close', 'submit']);

watch(
  () => props.items,
  (newItems) => {
    itemsWithQty.value = newItems.map(item => ({
      ...item,
      returnQty: 0,
    }));
  },
  { immediate: true }
);

const selectedItems = computed(() =>
  itemsWithQty.value
    .filter(item => item.returnQty > 0)
    .map(item => ({
      id: item.menuId || item.menu?._id || item.menu,
      qtyReturned: item.returnQty,
    }))

);

async function submitRetur() {
  if (selectedItems.value.length === 0) {
    alert('Pilih minimal satu item untuk diretur.');
    return;
  }

    try {
        const payload = {
            originalTransactionId: props.originalTransactionId,
            returnedItems: selectedItems.value,
            reason: reason.value,               
        };

        console.log("📦 Payload Retur:", JSON.stringify(payload, null, 2));

        const data = await returStore.createRetur(payload);  // Tangkap response
        transactionStore.transactions.unshift(data.returTransaction);
        await transactionStore.fetchTransactions();
        emit('close'); // tutup modal
    } catch (e) {
        console.error('Retur gagal:', e);
    }
}

watch(
  () => props.show,
  (val) => {
    console.log('🧪 Modal show:', val);
  },
  { immediate: true }
);

onMounted(() => {
  console.log('🧪 originalTransactionId:', props.originalTransactionId);
  console.log('🧪 items full:', JSON.parse(JSON.stringify(props.items)));
});


function formatRupiah(number) {
  return number?.toLocaleString('id-ID');
}

</script>
