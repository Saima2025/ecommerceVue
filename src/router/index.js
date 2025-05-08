import { createRouter,createWebHistory  } from 'vue-router'
import home from '../views/Home.vue'
import SingleProductView from '../views/ProductDetails.vue'
import ProductView from '../views/ProductList.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: home
    },
    {
      path: '/products',
      name: 'products',
      component: ProductView
    },
    {
      path: '/single-product/:id/:platform',
      name: 'single-product',
      component: SingleProductView
    }
  ]
})

export default router