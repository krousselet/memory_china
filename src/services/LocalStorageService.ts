import type { User, Score, GameMode } from '@/types'

export class LocalStorageService {
  private static readonly USER = 'memory-user'
  private static readonly SCORES = 'memory-scores'

  // Safe save with type guard
  static saveUser(user: User): boolean {
    if (!user?.username) return false
    localStorage.setItem(this.USER, JSON.stringify(user))
    return true
  }

  static getUser(): User | null {
    const data = localStorage.getItem(this.USER)
    if (!data) return null
    try {
      return JSON.parse(data) as User
    } catch {
      return null
    }
  }

  static saveScore(score: Score): boolean {
    if (!score.mode || !score.difficulty || typeof score.value !== 'number')
      return false
    const scores = this.getScores()
    scores.push({ ...score, date: new Date().toISOString() })
    localStorage.setItem(this.SCORES, JSON.stringify(scores))
    return true
  }

  static getScores(): Score[] {
    const data = localStorage.getItem(this.SCORES)
    try {
      return data ? JSON.parse(data) as Score[] : []
    } catch {
      return []
    }
  }

  static getLeaderboard(mode: GameMode | 'all'): Score[] {
    let scores = this.getScores()
    if (mode !== 'all') scores = scores.filter(s => s.mode === mode)
    return scores.sort((a, b) => b.value - a.value).slice(0, 10)
  }

  static clear(): void {
    localStorage.removeItem(this.USER)
    localStorage.removeItem(this.SCORES)
  }
}