<template>
  <main class="leaderboard" aria-label="Leaderboard">
    <div class="container">
      <h1>{{ $t('leaderboard') }}</h1>

      <div class="filter">
        <button v-for="m in ['all', 'classic', 'beat-the-clock', 'longest-streak', 'shuffle']"
                :key="m" class="btn" @click="loadLeaderboard(m as any)">
          {{ $t(m) }}
        </button>
      </div>

      <div class="list">
        <div v-for="(score, i) in scores" :key="i" class="item">
          <span>#{{ i + 1 }}</span>
          <span>{{ $t(score.mode) }}</span>
          <span>{{ $t(score.difficulty) }}</span>
          <span>{{ score.value }}</span>
        </div>
        <div v-if="scores.length === 0" class="empty">{{ $t('noScores') }}</div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { LocalStorageService } from '@/services/LocalStorageService'
import type { Score, GameMode } from '@/types'

const scores = ref<Score[]>([])

const loadLeaderboard = (mode: GameMode | 'all') => {
  scores.value = LocalStorageService.getLeaderboard(mode)
}

onMounted(() => loadLeaderboard('all'))
</script>

<style scoped>
.leaderboard {
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  padding: 2rem 1rem;
}

.container {
  max-width: 900px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2.5rem;
}

.filter {
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 2rem;
}

.btn {
  padding: 0.6rem 1.2rem;
  background: var(--card);
  color: var(--text);
  border: none;
  border-radius: 999px;
}

.list {
  background: var(--card);
  border-radius: 16px;
  overflow: hidden;
}

.item {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 1fr;
  padding: 1rem;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  font-weight: bold;
}

.empty {
  padding: 3rem;
  text-align: center;
  opacity: 0.6;
}
</style>