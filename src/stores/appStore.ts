import { defineStore } from 'pinia'
import { LocalStorageService } from '@/services/LocalStorageService'
import type { Language, JokerUsage, GameMode, Difficulty } from '@/types'
import { MemoryGame } from '@/models/MemoryGame'

export const useAppStore = defineStore('app', {
  state: () => ({
    darkMode: true,
    fontSize: '16px',
    music: true,
    lang: 'zh' as Language,
    user: LocalStorageService.getUser(),
    game: null as MemoryGame | null,
    jokers: {
      revealPair: false,
      stopTimer: false,
      addTime: false,
      allowMistake: false,
      revealSingle: false,
      preventShuffle: false,
      undoShuffle: false,
    } as JokerUsage,
  }),

  actions: {
    toggleDark() { this.darkMode = !this.darkMode },
    setFont(size: string) { this.fontSize = size },
    toggleMusic() { this.music = !this.music },
    setLang(lang: Language) { this.lang = lang },
    startGame(mode: GameMode, diff: Difficulty) {
      this.game = new MemoryGame(mode, diff)
    },
    useJoker(key: keyof JokerUsage) {
      this.jokers[key] = true
    },
    resetJokers() {
      this.jokers = {
        revealPair: false, stopTimer: false, addTime: false,
        allowMistake: false, revealSingle: false,
        preventShuffle: false, undoShuffle: false
      }
    }
  },
})