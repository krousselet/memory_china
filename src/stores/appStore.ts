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
    audio: null as HTMLAudioElement | null,

    currentGameMode: null as GameMode | null,
    currentDifficulty: null as Difficulty | null,
    gameCards: [] as Card[],
    timeLeft: 60,
    timer: null as any,
    streak: 0,
    bestStreak: 0,
    gameWon: false,
    gameLost: false,

    joker1Used: false,
    joker2Used: false,
    joker3Used: false,
    shuffleCooldown: false,
    allowOneMistake: false,
  }),

  actions: {
    // ------------------------------
    // DARK MODE (NO WATCH, PINIA COMPATIBLE)
    // ------------------------------
    initTheme() {
      const saved = localStorage.getItem('darkMode') === 'true'
      this.darkMode = saved
      document.documentElement.classList.toggle('dark', saved)
    },

    toggleDark() {
      this.darkMode = !this.darkMode
      document.documentElement.classList.toggle('dark', this.darkMode)
      localStorage.setItem('darkMode', String(this.darkMode))
    },

    // ------------------------------
    // MUSIC
    // ------------------------------
    initMusic() {
      const saved = localStorage.getItem('music')
      this.music = saved === null || saved === 'true'

      this.audio = new Audio('/bgm.mp3')
      this.audio.loop = true
      this.audio.volume = 0.3
    },

    toggleMusic() {
      this.music = !this.music
      localStorage.setItem('music', String(this.music))

      if (!this.audio) return
      if (this.music) {
        this.audio.play().catch(() => {})
      } else {
        this.audio.pause()
      }
    },

    // ------------------------------
    // FONT & LANGUAGE
    // ------------------------------
    setFont(size: string) {
      this.fontSize = size
      // ✅ Fix: apply directly to HTML (this was missing)
      document.documentElement.style.fontSize = size
    },

    setLang(lang: string) {
      this.locale = lang
    },

    // ------------------------------
    // GAME LOGIC
    // ------------------------------
    startGame(mode: GameMode, diff: Difficulty) {
      this.currentGameMode = mode
      this.currentDifficulty = diff
      this.streak = 0
      this.gameWon = false
      this.gameLost = false
      this.joker1Used = false
      this.joker2Used = false
      this.joker3Used = false
      this.shuffleCooldown = false
      this.allowOneMistake = false
      clearInterval(this.timer)

      const pairs = diff === 'easy' ? 4 : diff === 'medium' ? 6 : diff === 'hard' ? 8 : 10
      this.generateCards(pairs)

      const showTime = diff === 'easy' ? 3 : diff === 'medium' ? 2 : 1
      this.gameCards.forEach((c) => {
        c.flipped = true
      })
      setTimeout(() => {
        this.gameCards.forEach((c) => {
          c.flipped = false
        })
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
      this.gameCards = deck.map((v) => ({
        value: v,
        flipped: false,
        matched: false,
      }))
    },

    flipCard(index: number) {
      if (this.gameWon || this.gameLost) return
      if (!this.gameCards[index]) return
      const card = this.gameCards[index]
      if (card.flipped || card.matched) return
      card.flipped = true
      this.checkMatches()
    },

    checkMatches() {
      const flipped = this.gameCards.filter((c) => c.flipped && !c.matched)
      if (flipped.length !== 2) return

      const a = flipped[0]
      const b = flipped[1]
      if (!a || !b) return

      if (a.value === b.value) {
        a.matched = true
        b.matched = true
        this.streak++
        if (this.gameCards.every((c) => c.matched)) this.gameWon = true
      } else {
        setTimeout(() => {
          a.flipped = false
          b.flipped = false
          if (this.currentGameMode === 'longest-streak' && !this.allowOneMistake) {
            this.streak = 0
          }
          this.allowOneMistake = false
        }, 500)
      }
    },

    // ------------------------------
    // JOKERS
    // ------------------------------
    useJoker1() {
      if (this.gameWon || this.gameLost || this.joker1Used) return
      this.joker1Used = true

      if (this.currentGameMode === 'longest-streak') {
        this.allowOneMistake = true
        return
      }

      const list = this.gameCards.filter((c) => !c.matched)
      if (list.length === 0) return
      const val = list[0]?.value
      if (!val) return

      this.gameCards.forEach((c) => {
        if (c.value === val) c.flipped = true
      })
      setTimeout(() => {
        this.gameCards.forEach((c) => {
          if (c.value === val) c.flipped = false
        })
      }, 800)
    },

    useJoker2() {
      if (this.gameWon || this.gameLost || this.joker2Used) return
      this.joker2Used = true

      const m = this.currentGameMode
      if (m === 'classic' || m === 'longest-streak') {
        const card = this.gameCards.find((c) => !c.matched && !c.flipped)
        if (card) card.flipped = true
        setTimeout(() => {
          if (card) card.flipped = false
        }, 800)
        return
      }

      if (m === 'beat-the-clock') {
        clearInterval(this.timer)
        setTimeout(() => {
          this.timer = setInterval(() => {
            this.timeLeft--
            if (this.timeLeft <= 0) this.gameLost = true
          }, 1000)
        }, 10000)
        return
      }

      if (m === 'shuffle') {
        this.shuffleCooldown = true
        setTimeout(() => (this.shuffleCooldown = false), 30000)
      }
    },

    useJoker3() {
      if (this.gameWon || this.gameLost || this.joker3Used) return
      this.joker3Used = true

      const m = this.currentGameMode
      if (m === 'classic') {
        this.gameCards.forEach((c) => (c.flipped = true))
        setTimeout(() => {
          this.gameCards.forEach((c) => {
            if (!c.matched) c.flipped = false
          })
        }, 3000)
        return
      }

      if (m === 'beat-the-clock') {
        this.timeLeft += 15
        return
      }

      if (m === 'longest-streak') {
        const card = this.gameCards.find((c) => !c.matched && !c.flipped)
        if (card) card.flipped = true
        setTimeout(() => {
          if (card) card.flipped = false
        }, 800)
        return
      }
    },

    // ------------------------------
    // SHUFFLE MODE
    // ------------------------------
    shuffleCards() {
      if (this.currentGameMode !== 'shuffle' || this.shuffleCooldown) return
      if (this.gameCards.length === 0) return

      const values: string[] = []
      this.gameCards.forEach((c) => values.push(c.value))
      values.sort(() => Math.random() - 0.5)

      this.gameCards.forEach((card, i) => {
        if (card && values[i]) card.value = values[i]
      })
    },

    restartGame() {
      clearInterval(this.timer)
      this.startGame(this.currentGameMode!, this.currentDifficulty!)
    },
  },
})
