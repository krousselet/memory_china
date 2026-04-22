<template>
  <div class="board" :style="{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }">
    <button
      v-for="i in cardCount"
      :key="i"
      class="card"
      @click="flip(i - 1)"
      :aria-label="`Card ${i}`"
    >
      {{ getCard(i - 1).symbol }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores/appStore'

const store = useAppStore()

const cardCount = computed(() => store.game?.cardCount || 0)
const gridCols = computed(() => Math.ceil(Math.sqrt(cardCount.value)))

const getCard = (idx: number) => {
  return store.game?.getCardSafe(idx) || { symbol: '?', flipped: false, matched: false }
}

const flip = (idx: number) => {
  store.game?.flipCard(idx)
}
</script>

<style scoped>
.board {
  display: grid;
  gap: 1rem;
  padding: 1rem;
}
.card {
  aspect-ratio: 1/1;
  font-size: 1.5rem;
  border-radius: 12px;
  border: none;
  background: var(--card);
  color: var(--text);
}
</style>