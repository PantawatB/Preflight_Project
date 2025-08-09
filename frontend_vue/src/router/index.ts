import { createRouter, createWebHistory } from 'vue-router'
import Todolist from '../components/Todolist.vue'
import maintest from '../components/maintest.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Todolist,
    },
    {
      path: '/maintest',
      name: 'maintest',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: maintest,
    },
  ],
})

export default router
