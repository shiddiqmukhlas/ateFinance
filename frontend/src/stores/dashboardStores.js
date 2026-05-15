import { defineStore } from 'pinia';
import customFetch from '@/api'; // Sesuaikan path dengan file fetch Anda
import { ref } from 'vue';

export const useDashboardStore = defineStore('dashboard', () => {
  const totalIncome = ref(0);
  const incomeThisMonth = ref(0);
  const incomeToday = ref(0);
  const averageIncomeThisMonth = ref(0);
  const incomeByCategory = ref([]);
  const incomeByRange = ref(0);
  const isLoading = ref(false);
  const error = ref(null);

  const expenseByCategory = ref([]);
  const totalExpense = ref(0);

  const balance = ref(0);

  const fetchDashboardData = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const [
        incomeResponse,
        thisMonthIncomeResponse,
        todayIncomeResponse,
        avgIncomeResponse,
        categoryIncomeResponse,
        expenseResponse,
        categoryExpenseResponse,
        balanceResponse
      ] = await Promise.all([
        customFetch.get('/dashboard/total-income'),
        customFetch.get('/dashboard/income-this-month'),
        customFetch.get('/dashboard/income-today'),
        customFetch.get('/dashboard/average-income-this-month'),
        customFetch.get('/dashboard/income-by-category'),
        customFetch.get('/dashboard/total-expense'),
        customFetch.get('/dashboard/expense-by-category'),
        customFetch.get('/dashboard/balance')
      ]);


      totalIncome.value = incomeResponse.data.totalIncome || 0;
      incomeThisMonth.value = thisMonthIncomeResponse.data.incomeThisMonth || 0;
      incomeToday.value = todayIncomeResponse.data.incomeToday || 0;
      averageIncomeThisMonth.value = avgIncomeResponse.data.averageIncome || 0;
      incomeByCategory.value = categoryIncomeResponse.data.incomeByCategory || [];

      totalExpense.value = expenseResponse.data.totalExpense || 0;
      expenseByCategory.value = categoryExpenseResponse.data.expenseByCategory || [];

      balance.value = balanceResponse.data.balance || 0;

    } catch (err) {
      error.value = err.response?.data?.message || 'Gagal memuat data dashboard.';
      console.error(error.value);
    } finally {
      isLoading.value = false;
    }

  };

  const fetchIncomeByRange = async (from, to) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await customFetch.get('/dashboard/income-by-range', {
        params: { from, to },
      });

      incomeByRange.value = response.data.incomeByRange || 0;
    } catch (err) {
      error.value = err.response?.data?.message || 'Gagal memuat data pemasukan dalam rentang tanggal.';
      console.error(error.value);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    totalIncome,
    incomeThisMonth,
    incomeToday,
    averageIncomeThisMonth,
    incomeByCategory,
    incomeByRange,
    isLoading,
    error,
    fetchDashboardData,
    fetchIncomeByRange,
    totalExpense,
    expenseByCategory,
    balance
  };
});
