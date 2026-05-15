<template>
    <div class="flex bg-[#F7F7F8] h-screen">
      <!-- Import Sidebar -->
      <Sidebar />
      
      <!-- Konten di sebelah kanan Sidebar -->
      <div class="ml-[18rem] mr-[3rem] mt-15 p-6 flex-1">
        
        <HeaderTransaksi> Transaksi </HeaderTransaksi>
        <MenuTable />
        

      </div>
    </div>
  </template>
  
  <script setup>

    import Sidebar from '@/layouts/Sidebar.vue';
    import HeaderTransaksi from '@/layouts/HeaderTransaksi.vue';
    import MenuTable from '@/components/MenuTable.vue';
    
  
  </script>
  

  