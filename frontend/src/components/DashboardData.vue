<template>

    <!-- Konten Dashboard -->
    <div class="!p-4 mt-10">
    <div v-if="isLoading" class="text-center">Memuat data...</div>
    <div v-else-if="error" class="text-red-500 text-center">{{ error }}</div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <!-- Total Pemasukan -->
    <div class="bg-white !p-5 !pb-10 rounded-xl shadow-xl">
        <h2 class="text-xl font-semibold">Total Pemasukan</h2>
        <p class="text-2xl font-bold">Rp {{ totalIncome.toLocaleString('id-ID') }}</p>
    </div>

    <!-- Total Pengeluaran -->
    <div class="bg-white !p-5 rounded-xl shadow-xl">
        <h2 class="text-xl font-semibold">Total Pengeluaran</h2>
        <p class="text-2xl font-bold">Rp {{ totalExpense.toLocaleString('id-ID') }}</p>
    </div>
    
    <!-- Total Balance -->
    <div class="bg-white !p-5 rounded-xl shadow-xl">
        <h2 class="text-xl font-semibold">Neraca</h2>
        <p class="text-2xl font-bold">Rp {{ balance.toLocaleString('id-ID') }}</p>
    </div>    


    <!-- Pengeluaran Berdasarkan Kategori -->
    <!-- <div class="bg-blue-100 !p-4 rounded shadow">
        <h2 class="text-lg font-semibold">Pengeluaran Berdasarkan Kategori</h2>
        <ul class="list-disc list-inside">
            <li v-for="category in expenseByCategory" :key="category._id">
                {{ category._id }}: Rp {{ category.total.toLocaleString('id-ID') }}
            </li>
        </ul>
    </div> -->


    <!-- Pemasukan Bulan Ini -->
    <!-- <div class="bg-blue-100 !p-4 rounded shadow">
        <h2 class="text-lg font-semibold">Pemasukan Bulan Ini</h2>
        <p class="text-xl font-bold">Rp {{ incomeThisMonth.toLocaleString('id-ID') }}</p>
    </div> -->

    <!-- Pemasukan Hari Ini -->
    <!-- <div class="bg-yellow-100 !p-4 rounded shadow">
        <h2 class="text-lg font-semibold">Pemasukan Hari Ini</h2>
        <p class="text-xl font-bold">Rp {{ incomeToday.toLocaleString('id-ID') }}</p>
    </div> -->

    <!-- Rata-rata Pemasukan Bulan Ini -->
    <!-- <div class="bg-purple-100 !p-4 rounded shadow">
        <h2 class="text-lg font-semibold">Rata-rata Pemasukan Bulan Ini</h2>
        <p class="text-xl font-bold">Rp {{ averageIncomeThisMonth.toLocaleString('id-ID') }}</p>
    </div> -->

    <!-- Pemasukan Berdasarkan Kategori -->
    <!-- <div class="bg-orange-100 !p-4 rounded shadow">
        <h2 class="text-lg font-semibold">Pemasukan Berdasarkan Kategori</h2>
        <ul class="list-disc list-inside">
        <li v-for="category in incomeByCategory" :key="category._id">
            {{ category._id }}: Rp {{ category.total.toLocaleString('id-ID') }}
        </li>
        </ul>
    </div> -->

    </div>
    </div>

</template>

<script setup>
    import {onMounted, computed} from 'vue'

    import { useDashboardStore } from '@/stores/dashboardStores'
    const dashboardStore = useDashboardStore()

    const totalIncome = computed(() => dashboardStore.totalIncome);
    const totalExpense = computed(() => dashboardStore.totalExpense);
    const balance = computed(() => dashboardStore.balance);
    // const expenseByCategory = computed(() => dashboardStore.expenseByCategory);
    // const incomeThisMonth = computed(() => dashboardStore.incomeThisMonth);
    // const incomeToday = computed(() => dashboardStore.incomeToday);
    // const averageIncomeThisMonth = computed(() => dashboardStore.averageIncomeThisMonth);
    // const incomeByCategory = computed(() => dashboardStore.incomeByCategory);

    const isLoading = computed(() => dashboardStore.isLoading);
    const error = computed(() => dashboardStore.error);


    onMounted(() => {
    dashboardStore.fetchDashboardData()

    });


</script>