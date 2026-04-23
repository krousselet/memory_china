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
      </div>

      <!-- ✅ 3 JOKERS BUTTONS -->
      <Jokers />

      <div v-if="store.gameWon" class="message win">{{ $t('youWon') }}!</div>
      <div v-if="store.gameLost" class="message lose">{{ $t('youLost') }}!</div>

      <button
        v-if="store.currentGameMode === 'shuffle' && !store.gameWon && !store.gameLost"
        class="btn shuffle"
        @click="store.shuffleCards"
      >
        {{ $t('shuffle') }}
      </button>

      <div class="game-board">
        <div v-for="(card, i) in store.gameCards" :key="i" class="card" @click="store.flipCard(i)">
          <span v-if="card.flipped || card.matched">{{ card.value }}</span>
          <span v-else>?</span>
        </div>
      </div>

      <button class="btn restart" @click="store.restartGame">{{ $t('restart') }}</button>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/appStore'
import Jokers from '@/components/Jokers.vue'
const store = useAppStore()
</script>

<style scoped>
/* YOUR EXISTING STYLES */
.game-page { min-height: 100vh; background: var(--bg); color: var(--text); padding: 2rem 1rem; text-align: center; }
.game-info { font-size: 1.1rem; margin-bottom: 0.5rem }
.message { font-size: 1.6rem; padding: 0.8rem; border-radius: 12px; margin: 0.5rem 0 }
.win { background: #22c55e; color: white }
.lose { background: #ef4444; color: white }
.game-board { display: grid; grid-template-columns: repeat(auto-fit, minmax(80px, 1fr)); gap: 1rem; max-width: 600px; margin: 2rem auto; }
.card { aspect-ratio: 1/1; background: var(--card); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 2rem; }
.btn { padding: 0.8rem 1.4rem; border-radius: 999px; border: none; margin: 0.5rem; cursor: pointer; }
.restart { background: var(--gradient); color: white }
.shuffle { background: #3b82f6; color: white }
</style>