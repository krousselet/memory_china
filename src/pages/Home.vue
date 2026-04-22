<template>
  <main class="home" aria-label="Home page">
    <div class="content">
      <h1 class="logo">{{ $t('appName') }}</h1>
      <p class="subtitle">{{ $t('welcome') }}</p>

      <div class="floating-cards">
        <div class="card-float" v-for="i in 6" :key="i"></div>
      </div>

      <div class="nav-buttons">
        <router-link to="/play" class="btn primary">
          {{ $t('play') }}
        </router-link>
        <router-link to="/rules" class="btn secondary">
          {{ $t('rules') }}
        </router-link>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
useI18n()
</script>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
  color: var(--text);
  padding: 1rem;
}

.content {
  text-align: center;
  max-width: 900px;
  width: 100%;
}

.logo {
  font-size: clamp(2.5rem, 8vw, 6rem);
  background: var(--gradient);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: clamp(1rem, 3vw, 1.5rem);
  opacity: 0.8;
  margin-bottom: 3rem;
}

.floating-cards {
  display: flex;
  justify-content: center;
  gap: clamp(0.5rem, 3vw, 2rem);
  margin-bottom: 4rem;
  height: 120px;
}

.card-float {
  width: clamp(50px, 12vw, 100px);
  height: clamp(70px, 16vw, 140px);
  background: var(--card);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  animation: float 3s ease-in-out infinite;
}

.card-float:nth-child(2) { animation-delay: 0.2s; }
.card-float:nth-child(3) { animation-delay: 0.4s; }
.card-float:nth-child(4) { animation-delay: 0.6s; }
.card-float:nth-child(5) { animation-delay: 0.8s; }
.card-float:nth-child(6) { animation-delay: 1s; }

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.nav-buttons {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 1rem 2.5rem;
  border-radius: 999px;
  font-size: 1.1rem;
  font-weight: bold;
  text-decoration: none;
  transition: 0.3s;
}

.primary {
  background: var(--gradient);
  color: white;
}

.secondary {
  background: transparent;
  color: var(--text);
  border: 2px solid var(--accent);
}
</style>