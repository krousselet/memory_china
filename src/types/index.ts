export type Language = 'fr' | 'id' | 'zh' | 'ja' | 'ru' | 'it' | 'es'
export type Difficulty = 'easy' | 'medium' | 'hard' | 'master'
export type GameMode = 'classic' | 'beat-the-clock' | 'longest-streak' | 'shuffle'

export interface Card {
  id: number
  symbol: string
  isFlipped: boolean
  isMatched: boolean
}

export interface User {
  username: string
  createdAt: string
}

export interface Score {
  mode: GameMode
  difficulty: Difficulty
  value: number
  date: string
  username?: string
}

export interface JokerUsage {
  revealPair: boolean
  stopTimer?: boolean
  addTime?: boolean
  allowMistake?: boolean
  revealSingle?: boolean
  preventShuffle?: boolean
  undoShuffle?: boolean
}

export interface GameState {
  attempts: number
  matchedPairs: number
  streak: number
  bestStreak: number
  startTime?: number
  timeLeft?: number
  shuffleCount: number
  lastShuffleTime: number
}