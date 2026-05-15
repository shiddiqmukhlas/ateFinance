<template>
    <div class="flex bg-[#F7F7F8] h-screen">
        <!-- Import Sidebar -->
        <Sidebar />
    
        <!-- Konten di sebelah kanan Sidebar -->
        <div class="ml-[23rem] mr-[8rem] mt-15 flex-1">

            <HeaderDashboard> Dashboard </HeaderDashboard>

            <DashboardData class="mb-10" />
            <IncomeExpenseChart />

            <div class="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 h-96 mx-auto">
                
            </div>




        </div>
    </div>
    
</template>

<script setup>
    import Sidebar from '@/layouts/Sidebar.vue'

    import IncomeExpenseChart from '@/components/IncomeExpenseChart.vue'
    import DashboardData from '@/components/DashboardData.vue';
    import HeaderDashboard from '@/layouts/HeaderDashboard.vue';





</script>