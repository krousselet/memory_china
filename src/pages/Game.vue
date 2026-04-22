<template>
  <main class="game-page">
    <div class="container">
      <h1>{{ $t('game') }}</h1>

      <div class="game-info">
        <p>{{ $t('mode') }}: {{ $t(store.currentGameMode ?? '') }}</p>
        <p>{{ $t('difficulty') }}: {{ $t(store.currentDifficulty ?? '') }}</p>

        <p v-if="store.currentGameMode === 'beat-the-clock'">
          {{ $t('timeLeft') }}: {{ store.timeLeft }}s
        </p>

        <p v-if="store.currentGameMode === 'longest-streak'">
          {{ $t('currentStreak') }}: {{ store.streak }}
        </p>
        <p v-if="store.currentGameMode === 'longest-streak'">
          {{ $t('bestStreak') }}: {{ store.bestStreak }}
        </p>
      </div>

      <!-- WIN / LOSE MESSAGES -->
      <div v-if="store.gameWon" class="message win">
        {{ $t('youWon') }}!
      </div>
      <div v-if="store.gameLost" class="message lose">
        {{ $t('youLost') }}!
      </div>

      <!-- SHUFFLE BUTTON -->
      <button
        v-if="!store.gameWon && !store.gameLost"
        class="btn shuffle"
        @click="store.shuffleCards"
      >
        {{ $t('shuffle') }}
      </button>

      <!-- GAME BOARD -->
      <div class="game-board">
        <div
          v-for="(card, index) in store.gameCards"
          :key="index"
          class="card"
          @click="store.flipCard(index)"
          :class="{ flipped: card.flipped, matched: card.matched }"
        >
          <span v-if="card.flipped || card.matched">{{ card.value }}</span>
          <span v-else>?</span>
        </div>
      </div>

      <button class="btn restart" @click="store.restartGame">
        {{ $t('restart') }}
      </button>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/appStore'
const store = useAppStore()
</script>

<style scoped>
.game-page {
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  padding: 2rem 1rem;
  text-align: center;
}

.game-info {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.message {
  font-size: 1.8rem;
  font-weight: bold;
  margin: 1rem 0;
  padding: 1rem;
  border-radius: 12px;
}
.win { background: #22c55e; color: white; }
.lose { background: #ef4444; color: white; }

.game-board {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 1rem;
  max-width: 600px;
  margin: 2rem auto;
}

.card {
  aspect-ratio: 1/1;
  background: var(--card);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  cursor: pointer;
  transition: 0.2s;
}
.card.matched { background: #22c55e; color: white; }

.btn {
  padding: 0.8rem 1.4rem;
  border-radius: 999px;
  border: none;
  font-size: 1rem;
  margin: 0.5rem;
  cursor: pointer;
}
.restart { background: var(--gradient); color: white; }
.shuffle { background: #3b82f6; color: white; }
</style>