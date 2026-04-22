<template>
  <main class="play" aria-label="Play game">
    <div class="container">
      <h1>{{ $t('play') }}</h1>

      <div class="grid">
        <div 
          class="mode-card" 
          v-for="mode in modes" 
          :key="mode.id"
          @click="selectMode(mode)"
        >
          <h2>{{ $t(mode.id) }}</h2>
          <p>{{ $t(mode.desc) }}</p>
        </div>
      </div>

      <div v-if="selectedMode" class="difficulty">
        <h3>{{ $t('chooseDifficulty') }}</h3>
        <div class="diff-buttons">
          <button 
            v-for="d in difficulties" 
            :key="d" 
            class="btn" 
            @click="startGame(selectedMode, d)"
          >
            {{ $t(d) }}
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAppStore } from '@/stores/appStore'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router' 
import type { GameMode, Difficulty } from '@/types'
const router = useRouter()

const { t } = useI18n()
const store = useAppStore()

// 👉 FIXED: Properly typed game modes (NO string errors)
const modes = ref<{ id: GameMode; desc: string }[]>([
  { id: 'classic', desc: 'classicDesc' },
  { id: 'beat-the-clock', desc: 'beatTheClockDesc' },
  { id: 'longest-streak', desc: 'longestStreakDesc' },
  { id: 'shuffle', desc: 'shuffleDesc' },
])

const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'master']
const selectedMode = ref<GameMode | null>(null)

// 👉 FIXED: Exact type match
const selectMode = (mode: { id: GameMode }) => {
  selectedMode.value = mode.id
}

const startGame = (mode: GameMode, diff: Difficulty) => {
  store.startGame(mode, diff)
  router.push('/game') 
}
</script>

<style scoped>
.play {
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  padding: 2rem 1rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2.5rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.mode-card {
  background: var(--card);
  padding: 2rem;
  border-radius: 16px;
  cursor: pointer;
  transition: 0.3s;
}

.mode-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.difficulty {
  text-align: center;
}

.diff-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.btn {
  padding: 0.8rem 2rem;
  background: var(--gradient);
  color: white;
  border: none;
  border-radius: 999px;
  font-weight: bold;
}
</style>