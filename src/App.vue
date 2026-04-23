<template>
  <router-view />
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/appStore'
const store = useAppStore()

store.initTheme()
store.initMusic()
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', sans-serif;
  background: var(--bg);
  color: var(--text);
  transition: background-color 0.3s ease, color 0.3s ease;
}
</style>