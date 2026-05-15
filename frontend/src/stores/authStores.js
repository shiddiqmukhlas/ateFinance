import { defineStore } from 'pinia'
import { ref } from 'vue'
import customFetch from '@/api'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('user', () => {
  const dialog = ref(false)
  const errorMsg = ref(null)
  const errorAlert = ref(false)
  const currentUser = ref(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null)
  const router = useRouter()

  const LoginUser = async (inputData) => {
    try {
      const { data } = await customFetch.post('/auth/login', {
        email: inputData.email,
        password: inputData.password
      })
      currentUser.value = data.data
      localStorage.setItem('user', JSON.stringify(data.data))
      dialog.value = false
      errorAlert.value = false
      errorMsg.value = null

       // Arahkan berdasarkan role
    if (data.data.role === 'admin') {
      router.push({ name: 'Dashboard' }); // Dashboard untuk admin
    } else {
      router.push('/transaksi/pos'); // Transaksi untuk user biasa
    }
    
    } catch (error) {
      errorAlert.value = true
      errorMsg.value = error.response?.data?.message || 'Terjadi kesalahan'
      console.error(error.response?.data?.message)

      inputData.password = ''; // Reset password
    }
  }

  const RegisterUser = async (inputData) => {
    try {
      const { data } = await customFetch.post('/auth/register', {
        name: inputData.name,
        email: inputData.email,
        password: inputData.password
      })
      currentUser.value = data.data
      localStorage.setItem('user', JSON.stringify(data.data))
      dialog.value = false
      errorAlert.value = false
      errorMsg.value = null

      router.push({ name: 'Dashboard' })
    } catch (error) {
      errorAlert.value = true
      errorMsg.value = error.response?.data?.message || 'Terjadi kesalahan'
      console.error(error.response?.data?.message)
    }
  }

  const LogoutUser = async () => {
    try {
      localStorage.removeItem('user')
      currentUser.value = null
      await customFetch.get('/auth/logout')
      router.push({ name: 'Login' })
    } catch (error) {
      console.error(error)
    }
  }

  return { dialog, LoginUser, errorAlert, errorMsg, currentUser, LogoutUser, RegisterUser }
})
