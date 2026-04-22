import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', component: () => import('@/pages/Home.vue') },
      { path: 'play', component: () => import('@/pages/Play.vue') },
      { path: 'settings', component: () => import('@/pages/Settings.vue') },
      { path: 'leaderboard', component: () => import('@/pages/Leaderboard.vue') },
      { path: 'rules', component: () => import('@/pages/Rules.vue') },
      { path: 'game', component: () => import('@/pages/Game.vue') },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router