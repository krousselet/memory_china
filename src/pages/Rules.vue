<template>
  <main class="rules leaderboard page-transition" aria-label="Game rules">
    <div class="container">
      <h1>{{ $t('rules') }}</h1>

      <section>
        <h2>{{ $t('gameModes') }}</h2>
        <div v-for="mode in modes" :key="mode.id" class="rule-card">
          <h3>{{ $t(mode.id) }}</h3>
          <p>{{ $t(mode.rule) }}</p>
        </div>
      </section>

      <section>
        <h2>{{ $t('jokers') }}</h2>
        <p>{{ $t('jokerInfo') }}</p>
      </section>

      <section>
        <h2>{{ $t('accessibility') }}</h2>
        <p>{{ $t('accessibilityDesc') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
const modes = [
  { id: 'classic', rule: 'ruleClassic' },
  { id: 'beat-the-clock', rule: 'ruleBeatClock' },
  { id: 'longest-streak', rule: 'ruleStreak' },
  { id: 'shuffle', rule: 'ruleShuffle' },
]
</script>

<style scoped>
.rules {
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  padding: 2rem 1rem;
}

.container {
  max-width: 900px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  margin-bottom: 3rem;
  font-size: 2.5rem;
}

section {
  margin-bottom: 3rem;
}

h2 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: var(--accent);
}

.rule-card {
  background: var(--card);
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1rem;
}

h3 {
  margin-bottom: 0.5rem;
}

p {
  font-size: 1.1rem;
  line-height: 1.6;
}
</style>
