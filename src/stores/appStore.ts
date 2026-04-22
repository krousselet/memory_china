import { defineStore } from 'pinia'
import type { GameMode, Difficulty } from '@/types'

interface Card {
  value: string
  flipped: boolean
  matched: boolean
}

export const useAppStore = defineStore('app', {
  state: () => ({
    darkMode: false,
    music: true,
    fontSize: '16px',
    locale: 'en',

    currentGameMode: null as GameMode | null,
    currentDifficulty: null as Difficulty | null,
    gameCards: [] as Card[],
    timeLeft: 60,
    timer: null as any,
    streak: 0,
    bestStreak: 0,
    gameWon: false,
    gameLost: false,
  }),

  actions: {
    toggleDark() { this.darkMode = !this.darkMode },
    toggleMusic() { this.music = !this.music },
    setFont(size: string) {
      this.fontSize = size
      document.documentElement.style.setProperty('--root-font-size', size)
    },
    setLang(lang: string) { this.locale = lang },

    startGame(mode: GameMode, diff: Difficulty) {
      this.currentGameMode = mode
      this.currentDifficulty = diff
      this.streak = 0
      this.gameWon = false
      this.gameLost = false
      clearInterval(this.timer)

      const pairs = diff === 'easy' ? 4 : diff === 'medium' ? 6 : diff === 'hard' ? 8 : 10
      this.generateCards(pairs)

      // Show cards at start (based on difficulty)
      const showTime = diff === 'easy' ? 3 : diff === 'medium' ? 2 : 1
      this.gameCards.forEach(c => c.flipped = true)
      setTimeout(() => {
        this.gameCards.forEach(c => c.flipped = false)
      }, showTime * 1000)

      if (mode === 'beat-the-clock') {
        this.timeLeft = 60
        this.timer = setInterval(() => {
          this.timeLeft--
          if (this.timeLeft <= 0) {
            this.gameLost = true
            clearInterval(this.timer)
          }
        }, 1000)
      }
    },

    generateCards(pairs: number) {
      const symbols = ['🎴', '🎭', '🎨', '🎲', '🎯', '🎧', '🎮', '🎸', '🎹', '🎺']
      const selected = symbols.slice(0, pairs)
      const deck = [...selected, ...selected].sort(() => Math.random() - 0.5)
      this.gameCards = deck.map(v => ({ value: v, flipped: false, matched: false }))
    },

    flipCard(index: number) {
      if (this.gameWon || this.gameLost) return
      if (!this.gameCards[index] || this.gameCards[index].flipped || this.gameCards[index].matched) return

      this.gameCards[index].flipped = true
      this.checkMatches()
    },

    checkMatches() {
  // SAFETY: Exit if not exactly 2 cards flipped
  const flipped = this.gameCards.filter(c => c.flipped && !c.matched);
  if (flipped.length !== 2) return;

  // SAFETY: Explicitly define A and B
  const a = flipped[0];
  const b = flipped[1];

  // SAFETY: Skip if undefined
  if (!a || !b) return;

  if (a.value === b.value) {
    a.matched = true;
    b.matched = true;
    this.streak++;
    if (this.streak > this.bestStreak) this.bestStreak = this.streak;
    if (this.gameCards.every(c => c.matched)) this.gameWon = true;
  } else {
    setTimeout(() => {
      a.flipped = false;
      b.flipped = false;
      if (this.currentGameMode === 'longest-streak') {
        this.streak = 0;
      }
    }, 500);
  }
},

shuffleCards() {
  // SAFETY: Fix TypeScript error + keep pairs valid
  const values = this.gameCards.map(c => c.value);
  values.sort(() => Math.random() - 0.5);
  
  this.gameCards.forEach((card, index) => {
    const val = values[index];
    if (val) card.value = val;
  });
},

    restartGame() {
      this.startGame(this.currentGameMode!, this.currentDifficulty!)
    },
  },
})