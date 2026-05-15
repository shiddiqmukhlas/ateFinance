<script setup>
import { ref, onMounted, watch } from "vue";
import customFetch from "@/api"; // Import customFetch
import VueApexCharts from "vue3-apexcharts";

const chartSeries = ref([]);
const chartCategories = ref([]);
const selectedRange = ref("last7Days"); // Rentang waktu default

// Fungsi utilitas untuk memformat angka sebagai Rupiah
const formatCurrency = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

// Fungsi utilitas untuk memformat tanggal berdasarkan rentang
const formatXAxis = (dateString) => {
  if (selectedRange.value === "lastYear") {
    return new Date(dateString).toLocaleDateString("id-ID", {
      month: "short",
      year: "2-digit",
    });
  } else if (selectedRange.value === "last6Months") {
    return new Date(dateString).toLocaleDateString("id-ID", { month: "short" });
  } else {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });
  }
};

// Fungsi untuk mengelompokkan data berdasarkan bulan
const groupByMonth = (data) => {
  const groupedData = {};
  data.forEach((item) => {
    const month = new Date(item._id).toLocaleDateString("id-ID", {
      month: "short",
      year: selectedRange.value === "lastYear" ? "2-digit" : undefined,
    });
    groupedData[month] = (groupedData[month] || 0) + item.total;
  });
  return Object.entries(groupedData).map(([month, total]) => ({ month, total }));
};

// Fungsi untuk mengambil data dari API
const fetchChartData = async () => {
  try {
    const [incomeResponse, expenseResponse] = await Promise.all([
      customFetch.get("/income/chart", { params: { range: selectedRange.value } }),
      customFetch.get("/expense/chart", { params: { range: selectedRange.value } }),
    ]);

    const incomeData = incomeResponse.data.data;
    const expenseData = expenseResponse.data.data;

    if (selectedRange.value === "lastYear" || selectedRange.value === "last6Months") {
      const groupedIncomeData = groupByMonth(incomeData);
      const groupedExpenseData = groupByMonth(expenseData);

      chartCategories.value = groupedIncomeData.map((item) => item.month);
      chartSeries.value = [
        {
          name: "Pemasukan",
          data: groupedIncomeData.map((item) => item.total),
        },
        {
          name: "Pengeluaran",
          data: groupedExpenseData.map((item) => item.total),
        },
      ];
    } else {
      chartCategories.value = incomeData.map((item) => formatXAxis(item._id));
      chartSeries.value = [
        {
          name: "Pemasukan",
          data: incomeData.map((item) => item.total),
        },
        {
          name: "Pengeluaran",
          data: expenseData.map((item) => item.total),
        },
      ];
    }
  } catch (error) {
    console.error("Error fetching chart data:", error);
  }
};

watch(selectedRange, fetchChartData);

onMounted(() => {
  fetchChartData();
});
</script>

<template>
  <div class="">
    <div class="mb-4 flex items-center justify-between">
      <h1 class="text-lg font-semibold text-gray-700">Pemasukan vs Pengeluaran</h1>
      <div class="flex items-center gap-4">
        <div>
          <label for="range" class="sr-only">Select Range:</label>
          <select
            id="range"
            v-model="selectedRange"
            class="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="last7Days">Last 7 Days</option>
            <option value="last30Days">Last 30 Days</option>
            <option value="last3Months">Last 3 Months</option>
            <option value="last6Months">Last 6 Months</option>
            <option value="lastYear">Last Year</option>
          </select>
        </div>
      </div>
    </div>

    <VueApexCharts
      v-if="chartSeries.length"
      type="area"
      :options="{
        chart: { id: 'income-expense-chart', animations: { enabled: true }, toolbar: { show: false } },
        dataLabels: { enabled: false },
        legend: { horizontalAlign: 'right' },
        xaxis: { 
          categories: chartCategories,
          labels: {
            offsetY: 10,
          },
        },
        yaxis: {
          labels: {
            formatter: function (val) {
              return formatCurrency(val);
            },
          },
        },
        stroke: { curve: 'smooth', width: 2 },
        colors: ['#F43264', '#6452F0'],
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'light',
            type: 'vertical',
            shadeIntensity: 0.5,
            gradientToColors: ['#F98CB3', '#908DF9'],
            inverseColors: false,
            opacityFrom: 0.4,
            opacityTo: 0,
            stops: [0, 100],
          },
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return formatCurrency(val);
            },
          },
        },
      }"
      :series="chartSeries"
      height="500"
    />
    <p v-else class="text-gray-500">No data available.</p>
  </div>
</template>