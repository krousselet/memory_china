import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import Game from '@/pages/Game.vue'
import Leaderboard from '@/pages/Leaderboard.vue'
import Settings from '@/pages/Settings.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/game',
    name: 'Game',
    component: Game,
  },
  {
    path: '/leaderboard',
    name: 'Leaderboard',
    component: Leaderboard,
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
  },
  // Catch 404 — redirect to home (prevents broken refresh)
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  // THIS FIXES REFRESH + CLEAN URLS (NO # IN URL)
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
