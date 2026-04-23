<template>
  <main class="leaderboard" aria-label="Leaderboard">
    <div class="container">
      <h1>{{ $t('leaderboard') }}</h1>

      <div class="filter">
        <button
          v-for="m in ['all', 'classic', 'beat-the-clock', 'longest-streak', 'shuffle']"
          :key="m"
          class="btn"
          @click="loadFiltered(m as any)"
        >
          {{ $t(m) }}
        </button>
        <button class="btn clear-btn" @click="(store.clearAllScores(), loadFiltered('all'))">
          {{ $t('clearAllScores') }}
        </button>
      </div>

      <div class="list">
        <div v-for="(score, i) in filteredScores" :key="i" class="item">
          <span>#{{ i + 1 }}</span>
          <span>{{ $t(score.mode) }}</span>
          <span>{{ $t(score.difficulty) }}</span>
          <span>Streak: {{ score.streak }}</span>
          <span>Tries: {{ score.attempts || 0 }}</span>
          <span>Jokers: {{ score.jokers || 0 }}</span>
          <span class="date">{{ score.date }}</span>
        </div>
        <div v-if="filteredScores.length === 0" class="empty">{{ $t('noScores') }}</div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAppStore } from '@/stores/appStore'

const store = useAppStore()
const filteredScores = ref<any[]>([])

const loadFiltered = (mode: any) => {
  filteredScores.value = store.getLeaderboard(mode)
}

onMounted(() => loadFiltered('all'))
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
  background: var(--surface);
  color: var(--text);
  border: none;
  border-radius: 999px;
  cursor: pointer;
}

.btn:hover {
  background: var(--accent);
  color: white;
}

.list {
  background: var(--surface);
  border-radius: 16px;
  overflow: hidden;
}

.item {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr 1fr 1.2fr 1fr 1fr 2fr;
  padding: 1rem;
  border-bottom: 1px solid var(--border);
  font-weight: bold;
  align-items: center;
}

.empty {
  padding: 3rem;
  text-align: center;
  opacity: 0.6;
}
</style>
