import { createRouter, createWebHistory } from 'vue-router'
import TabsView from '../views/tabs/TabsView.vue'
import HomeView from '../views/tabs/home/HomeView.vue'
import OrderView from '../views/tabs/order/OrderView.vue'
import MeView from '../views/tabs/me/MeView.vue'
import LoginView from '../views/login/loginView.vue'
import ShopView from '../views/shop/ShopView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/tabs',
      name: 'tabs',
      component: TabsView,
      children: [
        {
          path: '/home',
          name: 'home',
          component: HomeView
        },
        {
          path: '/order',
          name: 'order',
          component: OrderView
        },
        {
          path: '/me',
          name: 'me',
          component: MeView
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView //登录
    },
    {
      path: '/shop/:id', //动态路由
      name: 'shop',
      component: ShopView //商品详情
    }
  ]
})

export default router
