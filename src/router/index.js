import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'
import SaveView from '../views/Save.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/save',
      name: 'save',
      component: SaveView,
    }
  ],
})

export default router
