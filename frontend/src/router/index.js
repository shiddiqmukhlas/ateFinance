import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStores'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/register',
      name: 'Register',
      component: () => import('../views/RegisterView.vue'),
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/',
      name: 'Dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: {
        requiresAuth: true, role: 'admin'
      }
    },
    {
      path: '/keuangan/pemasukan',
      name: 'Pemasukan',
      component: () => import('../views/PemasukanView.vue'),
      meta: {
        requiresAuth: true, role: 'admin'
      }
    },
    {
      path: '/keuangan/pengeluaran',
      name: 'Pengeluaran',
      component: () => import('../views/PengeluaranView.vue'),
      meta: {
        requiresAuth: true, role: 'admin'
      }
    },
    // {
    //   path: '/keuangan/aruskas',
    //   name: 'Aruskas',
    //   component: () => import('../views/AruskasView.vue'),
    //   meta: {
    //     requiresAuth: true
    //   }
    // },
    {
      path: '/transaksi/data-transaksi',
      name: 'DataTransaksi',
      component: () => import('../views/TransaksiView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/transaksi/menu',
      name: 'Menu',
      component: () => import('../views/MenuView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/transaksi/pos',
      name: 'POS',
      component: () => import('../views/PosView.vue'),
      meta: {
        requiresAuth: true
      }
    }
  ],
})

// router.beforeEach(async(to, from) => {
//     const authStore = await useAuthStore()
//     if(to.meta.requiresAuth && !authStore.currentUser) {
//       alert("anda harus login terlebih dahulu")
//       return {
//         path: '/'
//       }
//     }
// })

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore(); // Ambil data user dari Pinia
  const currentUser = authStore.currentUser;

  if (to.meta.requiresAuth) {
    if (!currentUser) {
      // Jika belum login, arahkan ke halaman login
      return next({ name: 'Login' });
    }

    if (to.meta.role && currentUser.role !== to.meta.role) {
      // Jika role tidak sesuai, arahkan ke halaman yang sesuai
      if (currentUser.role === 'admin') {
        return next({ name: 'Dashboard' });
      } else {
        return next('/transaksi/pos');
      }
    }
  }

  next(); // Jika semua sesuai, izinkan akses
});

export default router
