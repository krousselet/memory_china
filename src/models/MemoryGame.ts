import type { Card, Difficulty, GameMode, GameState } from '@/types'

export class MemoryGame {
  readonly mode: GameMode
  readonly difficulty: Difficulty

  // PRIVATE = ANTI-CHEAT (Hidden from DevTools)
  #cards: Card[] = []
  #flippedIndices: number[] = []
  #state: GameState = {
    attempts: 0,
    matchedPairs: 0,
    streak: 0,
    bestStreak: 0,
    shuffleCount: 0,
    lastShuffleTime: 0,
  }

  constructor(mode: GameMode, difficulty: Difficulty) {
    this.mode = mode
    this.difficulty = difficulty
    this.#generateCards()
  }

  #generateCards(): void {
    const pairCount: Record<Difficulty, number> = {
      easy: 4,
      medium: 6,
      hard: 8,
      master: 10,
    }

    const totalPairs = pairCount[this.difficulty]
    const symbols = Array.from({ length: 20 }, (_, i) => `icon-${i + 1}`)
    const selectedSymbols = symbols.slice(0, totalPairs)

    this.#cards = [...selectedSymbols, ...selectedSymbols]
      .sort(() => Math.random() - 0.5)
      .map((symbol, id) => ({
        id,
        symbol,
        isFlipped: false,
        isMatched: false,
      }))
  }

  // 100% SAFE FLIP LOGIC
  flipCard(index: number): boolean {
    // STRONG GUARD: invalid index
    if (index < 0 || index >= this.#cards.length) return false

    // SAFE ACCESS: card is DEFINED
    const card = this.#cards[index]
    if (!card) return false

    if (card.isMatched || card.isFlipped || this.#flippedIndices.length >= 2) return false

    card.isFlipped = true
    this.#flippedIndices.push(index)

    if (this.#flippedIndices.length === 2) {
      this.#state.attempts++
      this.#checkMatch()
    }

    return true
  }

  // 100% SAFE MATCH CHECK (NO UNDEFINED)
  #checkMatch(): void {
    // GUARD: must have exactly 2 indices
    if (this.#flippedIndices.length !== 2) {
      this.#flippedIndices = []
      return
    }

    const [a, b] = this.#flippedIndices

    // GUARD: indices must be valid numbers
    if (typeof a !== 'number' || typeof b !== 'number') {
      this.#flippedIndices = []
      return
    }

    // GUARD: indices must be in bounds
    if (a < 0 || a >= this.#cards.length || b < 0 || b >= this.#cards.length) {
      this.#flippedIndices = []
      return
    }

    // SAFE: firstCard & secondCard are 100% DEFINED
    const firstCard = this.#cards[a]
    const secondCard = this.#cards[b]

    if (!firstCard || !secondCard) {
      this.#flippedIndices = []
      return
    }

    // MATCH LOGIC
    if (firstCard.symbol === secondCard.symbol) {
      firstCard.isMatched = true
      secondCard.isMatched = true
      this.#state.matchedPairs++
      this.#state.streak++
      this.#state.bestStreak = Math.max(this.#state.bestStreak, this.#state.streak)
    } else {
      this.#state.streak = 0
      setTimeout(() => {
        firstCard.isFlipped = false
        secondCard.isFlipped = false
      }, 800)
    }

    this.#flippedIndices = []
  }

  // SAFE CARD VISIBILITY
  getCardSafe(index: number): { symbol: string; flipped: boolean; matched: boolean } {
    if (index < 0 || index >= this.#cards.length) {
      return { symbol: 'hidden', flipped: false, matched: false }
    }

    const card = this.#cards[index]
    if (!card) return { symbol: 'hidden', flipped: false, matched: false }

    return {
      symbol: card.isFlipped || card.isMatched ? card.symbol : 'hidden',
      flipped: card.isFlipped,
      matched: card.isMatched,
    }
  }

  shuffleCards(): void {
    const matched = this.#cards.filter(c => c?.isMatched)
    const unmatched = this.#cards.filter(c => !c?.isMatched)
    this.#cards = [...unmatched.sort(() => Math.random() - 0.5), ...matched]
    this.#state.shuffleCount++
    this.#state.lastShuffleTime = Date.now()
  }

  // GETTERS
  get totalPairs(): number {
    return this.#cards.length / 2
  }

  get cardCount(): number {
    return this.#cards.length
  }

  get state(): Readonly<GameState> {
    return { ...this.#state }
  }

  get isGameWon(): boolean {
    return this.#state.matchedPairs === this.totalPairs
  }
}