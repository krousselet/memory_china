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
    flipSound: null as HTMLAudioElement | null,
    matchSound: null as HTMLAudioElement | null,
    jokerSound: null as HTMLAudioElement | null,
    winSound: null as HTMLAudioElement | null,
    lostSound: null as HTMLAudioElement | null,
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
    autoShuffleTimer: null as any,
    shuffleHistory: [] as Card[],

    joker1Used: false,
    joker2Used: false,
    joker3Used: false,
    shuffleCooldown: false,
    allowOneMistake: false,
    attempts: 0, // Flipped cards amount
    jokersUsedTotal: 0,

    leaderboard: [] as Array<{
      mode: string
      difficulty: string
      streak: number
      timeLeft?: number
      date: string
      jokers: Number
      attempts: Number
    }>,
  }),

  actions: {
    loadLeaderboard() {
      const data = localStorage.getItem('leaderboard')
      if (data) this.leaderboard = JSON.parse(data)
    },

    getLeaderboard(mode: GameMode | 'all') {
      const all = JSON.parse(localStorage.getItem('leaderboard') || '[]')

      if (mode === 'all') return all

      return all.filter((item: any) => item.mode === mode)
    },

    saveToLeaderboard() {
      //Only save if game is won AND not already saved
      if (!this.gameWon || !this.currentGameMode || !this.currentDifficulty) return

      const entry = {
        mode: this.currentGameMode,
        difficulty: this.currentDifficulty,
        streak: this.streak,
        attempts: this.attempts,
        jokers: this.jokersUsedTotal,
        timeLeft: this.timeLeft,
        date: new Date().toLocaleString(),
      }

      // Add to leaderboard
      this.leaderboard.unshift(entry)
      if (this.leaderboard.length > 20) this.leaderboard = this.leaderboard.slice(0, 20)

      // Save to localStorage
      localStorage.setItem('leaderboard', JSON.stringify(this.leaderboard))
    },

    clearAllScores() {
      this.leaderboard = []
      localStorage.removeItem('leaderboard')
    },
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
    // AUTO SHUFFLE
    // ------------------------------
    startAutoShuffle() {
      if (this.currentGameMode !== 'shuffle') return

      let delay = 12
      if (this.currentDifficulty === 'medium') delay = 8
      if (this.currentDifficulty === 'hard') delay = 5

      // ✅ Auto-shuffle loops NONSTOP until game is won
      this.autoShuffleTimer = setInterval(() => {
        if (!this.gameWon && !this.gameLost && !this.shuffleCooldown) {
          this.autoShuffleCards()
        }
      }, delay * 1000)
    },

    // ✅ AUTO SHUFFLE LOGIC (reveal cards → shuffle → hide)
    autoShuffleCards() {
      if (this.gameWon || this.gameLost) return
      this.shuffleHistory = JSON.parse(JSON.stringify(this.gameCards))
      // Step 1: Reveal all unmatched cards briefly
      this.gameCards.forEach((c) => {
        if (!c.matched) c.flipped = true
      })

      // Step 2: After 1.5s → shuffle & flip back
      setTimeout(() => {
        const unmatched = this.gameCards.filter((c) => !c.matched)
        if (unmatched.length < 2) return

        // Get values safely (all strings)
        const values = unmatched.map((c) => c.value)
        values.sort(() => Math.random() - 0.5)

        let idx = 0
        this.gameCards.forEach((c) => {
          if (!c.matched) {
            // ✅ Safe assignment (no undefined)
            const val = values[idx]
            if (val !== undefined) {
              c.value = val
            }
            idx++
            c.flipped = false
          }
        })
      }, 1500)
    },

    undoShuffle() {
      if (this.currentGameMode !== 'shuffle' || !this.shuffleHistory.length) return
      // ✅ Restore exact previous order
      this.gameCards = JSON.parse(JSON.stringify(this.shuffleHistory))
    },

    // ------------------------------
    // MUSIC
    // ------------------------------
    initMusic() {
      const saved = localStorage.getItem('music')
      this.music = saved === null || saved === 'true'

      // Background music
      this.audio = new Audio('/bgm.mp3')
      this.audio.loop = true
      this.audio.volume = 0.25

      // Sound effects
      this.flipSound = new Audio('/sounds/flip_card.mp3')
      this.matchSound = new Audio('/sounds/match.mp3')
      this.jokerSound = new Audio('/sounds/joker_use.mp3')
      this.winSound = new Audio('/sounds/win.mp3')
      this.lostSound = new Audio('/sounds/lost.mp3')

      ;[this.flipSound, this.matchSound, this.jokerSound, this.winSound].forEach((s) => {
        if (s) s.volume = 0.4
      })
    },

    toggleMusic() {
      // Flip the state FIRST
      this.music = !this.music
      localStorage.setItem('music', String(this.music))

      // If we just enabled sound: play background music
      if (this.music && this.audio) {
        this.audio.play().catch(() => {})
      }
    },

    // ✅ Play sound helper
    playSound(sound: HTMLAudioElement | null) {
      if (!this.music || !sound) return
      sound.currentTime = 0
      sound.play().catch(() => {})
    },

    playFlip() {
      this.playSound(this.flipSound)
    },
    playMatch() {
      this.playSound(this.matchSound)
    },
    playJoker() {
      this.playSound(this.jokerSound)
    },
    playWin() {
      this.playSound(this.winSound)
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
      this.attempts = 0
      this.jokersUsedTotal = 0

      clearInterval(this.timer)
      clearInterval(this.autoShuffleTimer) // Clear old auto shuffle

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

        // ✅ START AUTO SHUFFLE ONLY FOR SHUFFLE MODE
        if (mode === 'shuffle') {
          this.startAutoShuffle()
        }
      }, showTime * 1000)

      if (mode === 'beat-the-clock') {
        this.timeLeft = 60
        this.timer = setInterval(() => {
          if (this.gameWon) {
            clearInterval(this.timer)
            return
          }
          this.timeLeft--
          if (this.timeLeft <= 0) {
            this.gameLost = true
            this.playLost()
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
      this.playFlip()
      card.flipped = true
      this.checkMatches()
    },

    checkMatches() {
      const flipped = this.gameCards.filter((c) => c.flipped && !c.matched)
      if (flipped.length !== 2) return
      this.attempts++
      const a = flipped[0]
      const b = flipped[1]
      if (!a || !b) return

      if (a.value === b.value) {
        a.matched = true
        b.matched = true
        this.playMatch()
        this.streak++

        const allDone = this.gameCards.every((c) => c.matched)
        if (allDone) {
          this.gameWon = true
          clearInterval(this.timer)
          clearInterval(this.autoShuffleTimer) // ✅ ONLY STOP ON FULL WIN
          this.playWin()
          this.saveToLeaderboard() // ✅ ONLY SAVE ONCE AT THE END
        }
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
      this.playJoker()
      if (this.gameWon || this.gameLost || this.joker1Used) return
      this.joker1Used = true
      this.jokersUsedTotal++

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
      this.playJoker()
      if (this.gameWon || this.gameLost || this.joker2Used) return
      this.joker2Used = true
      this.jokersUsedTotal++

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
      this.playJoker()
      if (this.gameWon || this.gameLost || this.joker3Used) return
      this.joker3Used = true
      this.jokersUsedTotal++

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

      if (m === 'shuffle') {
        this.undoShuffle() // ✅ NOW WORKS
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
      clearInterval(this.autoShuffleTimer)
      this.startGame(this.currentGameMode!, this.currentDifficulty!)
    },

    playLost() {
      this.playSound(this.lostSound)
    },
  },
})
