<template>
  <main class="settings" aria-label="Settings">
    <div class="container">
      <h1>{{ $t('settings') }}</h1>

      <div class="setting-group">
        <label>{{ $t('darkMode') }}</label>
        <input type="checkbox" :checked="store.darkMode" @change="store.toggleDark()" />
      </div>

      <div class="setting-group">
        <label>{{ $t('music') }}</label>
        <input type="checkbox" v-model="store.music" @change="store.toggleMusic" />
      </div>

      <div class="setting-group">
        <label>{{ $t('fontSize') }}</label>
        <select @change="setFont($event)">
          <option value="14px">14px</option>
          <option value="16px" selected>16px</option>
          <option value="18px">18px</option>
          <option value="20px">20px</option>
        </select>
      </div>

      <div class="setting-group">
        <label>{{ $t('language') }}</label>
        <select v-model="locale" @change="changeLang($event)">
          <option value="fr">Français</option>
          <option value="id">Indonesia</option>
          <option value="zh">中文</option>
          <option value="ja">日本語</option>
          <option value="ru">Русский</option>
          <option value="it">Italiano</option>
          <option value="es">Español</option>
          <option value="en">English</option>
        </select>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/appStore'
import { useI18n } from 'vue-i18n'

const store = useAppStore()
const { locale } = useI18n()

const setFont = (e: Event) => {
  const size = (e.target as HTMLSelectElement).value
  store.setFont(size)
}

const changeLang = (e: Event) => {
  const lang = (e.target as HTMLSelectElement).value
  locale.value = lang
  store.setLang(lang as any)
}
</script>

<style scoped>
.settings {
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  padding: 2rem 1rem;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 2rem;
  font-size: 2.5rem;
  text-align: center;
}

.setting-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 1.2rem;
}

select,
input[type='checkbox'] {
  transform: scale(1.2);
  padding: 0.4rem;
  border-radius: 8px;
}
</style>
