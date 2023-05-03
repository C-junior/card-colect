import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import ProfileView from '../views/ProfileView.vue'
import MarketView from '../views/MarketView.vue'
import ShopView from '../views/ShopView.vue'
import RankingView from '../views/RankingView.vue'
import HelpView from '../views/HelpView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView
    },
     {
      path: '/marketplace',
      name: 'marketplace',
      component: MarketView
    },
    {
      path: '/rankingplayer',
      name: 'rankingplayer',
      component: RankingView
    },
    {
      path: '/helppage',
      name: 'helppage',
      component: HelpView
    },
    {
     path: '/shopgoods',
     name: 'shopgoods',
     component: ShopView
   }
    
  ]
})

export default router