<template>
  <div class="jokers-container">
    <button
      class="joker-btn"
      :disabled="store.joker1Used || store.gameWon || store.gameLost"
      @click="store.useJoker1()"
    >
      {{ joker1Text }}
    </button>

    <button
      class="joker-btn"
      :disabled="store.joker2Used || store.gameWon || store.gameLost"
      @click="store.useJoker2()"
    >
      {{ joker2Text }}
    </button>

    <button
      class="joker-btn"
      :disabled="store.joker3Used || store.gameWon || store.gameLost"
      @click="store.useJoker3()"
    >
      {{ joker3Text }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/appStore'
import { computed } from 'vue'

const store = useAppStore()

const joker1Text = computed(() => {
  const m = store.currentGameMode
  if (m === 'classic') return 'Reveal a pair'
  if (m === 'beat-the-clock') return 'Reveal a pair'
  if (m === 'longest-streak') return 'Allow one mistake'
  if (m === 'shuffle') return 'Reveal a pair'
  return 'Joker 1'
})

const joker2Text = computed(() => {
  const m = store.currentGameMode
  if (m === 'classic') return 'Reveal one card'
  if (m === 'beat-the-clock') return 'Stop timer 10s'
  if (m === 'longest-streak') return 'Reveal a pair'
  if (m === 'shuffle') return 'Prevent shuffle 30s'
  return 'Joker 2'
})

const joker3Text = computed(() => {
  const m = store.currentGameMode
  if (m === 'classic') return 'Reveal all 3s'
  if (m === 'beat-the-clock') return '+15 seconds'
  if (m === 'longest-streak') return 'Reveal one card'
  if (m === 'shuffle') return 'Undo shuffle'
  return 'Joker 3'
})
</script>

<style scoped>
.jokers-container {
  display: flex;
  gap: 0.8rem;
  justify-content: center;
  margin: 1rem 0;
  flex-wrap: wrap;
}

.joker-btn {
  padding: 0.7rem 1.1rem;
  background: var(--joker);
  color: var(--text);
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
}

.joker-btn:disabled {
  background: #999;
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
