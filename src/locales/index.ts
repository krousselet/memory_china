import { createI18n } from 'vue-i18n'
import fr from './fr.json'
import id from './id.json'
import zh from './zh.json'
import ja from './ja.json'
import ru from './ru.json'
import it from './it.json'
import es from './es.json'

export default createI18n({
  legacy: false, // Required for Vue 3 composition API
  locale: 'en',
  fallbackLocale: 'en',
  messages: { fr, id, zh, ja, ru, it, es }
})