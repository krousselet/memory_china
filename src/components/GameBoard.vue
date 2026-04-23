<template>
  <div class="board" :style="{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }">
    <button
      v-for="(card, index) in store.gameCards"
      :key="index"
      class="card"
      @click="flip(index)"
      :aria-label="`Card ${index + 1}`"
    >
      <!-- Show symbol only if flipped or matched -->
      {{ card.flipped || card.matched ? card.value : '?' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores/appStore'

const store = useAppStore()

// Calculate grid automatically
const gridCols = computed(() => {
  const count = store.gameCards.length
  return count === 0 ? 4 : Math.ceil(Math.sqrt(count))
})

// Flip card using YOUR store
const flip = (idx: number) => {
  store.flipCard(idx)
}
</script>

<style scoped>
.board {
  display: grid;
  gap: 1rem;
  padding: 1rem;
  max-width: 600px;
  margin: 0 auto;
}
.card {
  aspect-ratio: 1/1;
  font-size: 1.5rem;
  border-radius: 12px;
  background: var(--card);
  color: var(--text);
  cursor: pointer;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
}
</style>
