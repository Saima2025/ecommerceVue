import { createApp } from 'vue'
import App from './App.vue'
// import './index.css'
import router from './router'
// import '@/assets/tailwind.css';
import './assets/tailwind.css'

createApp(App).use(router).mount('#app')
