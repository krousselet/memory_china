<template>
  <div class="jokers-container">
    <button
      class="joker-btn"
      :disabled="store.joker1Used || store.gameWon || store.gameLost"
      @click="store.useJoker1()"
    >
      {{ $t(joker1Key) }}
    </button>

    <button
      class="joker-btn"
      :disabled="store.joker2Used || store.gameWon || store.gameLost"
      @click="store.useJoker2()"
    >
      {{ $t(joker2Key) }}
    </button>

    <button
      class="joker-btn"
      :disabled="store.joker3Used || store.gameWon || store.gameLost"
      @click="store.useJoker3()"
    >
      {{ $t(joker3Key) }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/appStore'
import { computed } from 'vue'

const store = useAppStore()

// Get translation key based on game mode
const joker1Key = computed(() => {
  const mode = store.currentGameMode
  return `joker1_${mode?.replace('-', '_') || 'default'}`
})

const joker2Key = computed(() => {
  const mode = store.currentGameMode
  return `joker2_${mode?.replace('-', '_') || 'default'}`
})

const joker3Key = computed(() => {
  const mode = store.currentGameMode
  return `joker3_${mode?.replace('-', '_') || 'default'}`
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
