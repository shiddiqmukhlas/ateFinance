<template>
    <div class="flex bg-[#F7F7F8] h-screen">
        <!-- Import Sidebar -->
        <Sidebar />
    
        <!-- Konten di sebelah kanan Sidebar -->
        <div class="mx-64 my-10 p-6 flex-1">
            <h1 class="text-2xl font-bold">Halaman Arus Kas</h1>
            <p>Isi halaman Arus Kas akan muncul di sini.</p>
            <div v-if="user">
                <h2>Arus kas {{ user.name }}</h2>
            </div>
        </div>



    </div>
    
</template>

<script setup>
    import customFetch from '@/api'
    import {ref, onMounted} from 'vue'
    import Sidebar from '@/layouts/Sidebar.vue'

    const user = ref(null)
    const getUser = async () => {
        const {data} = await customFetch.get('/auth/getUser')
        console.log(data)
        user.value = data.user
    }


onMounted(() => {
    getUser()
})

</script>