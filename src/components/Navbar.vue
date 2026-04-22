<template>
  <nav class="navbar" aria-label="Main navigation">
    <div class="nav-container">
      <!-- Logo -->
      <router-link to="/" class="logo">
        {{ $t('appName') }}
      </router-link>

      <!-- Desktop Menu -->
      <ul class="nav-menu">
        <li>
          <router-link to="/" class="nav-link">
            {{ $t('home') }}
          </router-link>
        </li>
        <li>
          <router-link to="/play" class="nav-link">
            {{ $t('play') }}
          </router-link>
        </li>
        <li>
          <router-link to="/leaderboard" class="nav-link">
            {{ $t('leaderboard') }}
          </router-link>
        </li>
        <li>
          <router-link to="/rules" class="nav-link">
            {{ $t('rules') }}
          </router-link>
        </li>
        <li>
          <router-link to="/settings" class="nav-link">
            {{ $t('settings') }}
          </router-link>
        </li>
      </ul>

      <!-- Mobile Toggle Button -->
      <button
        class="mobile-btn"
        @click="isOpen = !isOpen"
        aria-label="Toggle menu"
      >
        ☰
      </button>
    </div>

    <!-- Mobile Menu -->
    <ul v-if="isOpen" class="mobile-menu">
      <li>
        <router-link to="/" @click="isOpen = false">
          {{ $t('home') }}
        </router-link>
      </li>
      <li>
        <router-link to="/play" @click="isOpen = false">
          {{ $t('play') }}
        </router-link>
      </li>
      <li>
        <router-link to="/leaderboard" @click="isOpen = false">
          {{ $t('leaderboard') }}
        </router-link>
      </li>
      <li>
        <router-link to="/rules" @click="isOpen = false">
          {{ $t('rules') }}
        </router-link>
      </li>
      <li>
        <router-link to="/settings" @click="isOpen = false">
          {{ $t('settings') }}
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const isOpen = ref(false)
</script>

<style scoped>
.navbar {
  background: var(--card);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 999;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  background: var(--gradient);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-decoration: none;
}

.nav-menu {
  display: none;
  list-style: none;
  gap: 2rem;
  align-items: center;
}

.nav-link {
  color: var(--text);
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 500;
}

.nav-link:hover {
  color: var(--accent);
}

.mobile-btn {
  background: none;
  border: none;
  color: var(--text);
  font-size: 1.8rem;
  cursor: pointer;
}

.mobile-menu {
  list-style: none;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: var(--card);
}

.mobile-menu a {
  color: var(--text);
  text-decoration: none;
  font-size: 1.2rem;
  padding: 0.5rem 0;
}

/* Desktop responsive */
@media (min-width: 768px) {
  .nav-menu {
    display: flex;
  }
  .mobile-btn,
  .mobile-menu {
    display: none;
  }
}
</style>