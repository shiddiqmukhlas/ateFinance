import './assets/main.css'


import { createApp, markRaw} from 'vue'
import App from './App.vue'
import router from './router'

import ApexCharts from 'vue3-apexcharts'
import { createPinia } from 'pinia'



const app = createApp(App)
const pinia = createPinia()


app.use(router)
app.use(pinia)

pinia.use(({store}) => {
    store.router = markRaw(router)
})

app.component("VueApexCharts", ApexCharts);


app.mount('#app')
