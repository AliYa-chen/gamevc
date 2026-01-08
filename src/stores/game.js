import { defineStore } from 'pinia'
import FALLBACK_I18N from '@/i18n'

function normalizeLang(lang) {
  const l = String(lang || '').toLowerCase()
  if (l.startsWith('zh')) return 'zh'
  if (l.startsWith('ru')) return 'ru'
  return 'en'
}

function detectLocalLang() {
  // localStorage 有就用 localStorage（你本来就是 saved.language 优先）
  const nav = navigator.language || navigator.userLanguage || 'en'
  return normalizeLang(nav)
}

function getByPath(obj, path) {
  if (!obj || !path) return undefined
  return path.split('.').reduce((o, k) => (o && o[k] != null ? o[k] : undefined), obj)
}



function loadScriptOnce(src) {
  return new Promise((resolve, reject) => {
    if ([...document.scripts].some(s => s.src.includes(src))) {
      resolve()
      return
    }

    const s = document.createElement('script')
    s.src = src
    s.type = 'text/javascript'
    s.defer = true
    s.onload = resolve
    s.onerror = reject
    document.body.appendChild(s)
  })
}

// 本地缓存 key
const LOCAL_KEY = 'game_config'

export const useGameStore = defineStore('game', {
  state: () => {
    // 尝试从 localStorage 读取配置
    let saved = {}
    try {
      const raw = localStorage.getItem(LOCAL_KEY)
      if (raw) saved = JSON.parse(raw)
    } catch (e) {
      console.warn('读取本地游戏配置失败', e)
    }

    return {
      started: false,
      loading: false,
      ready: false,
      progress: 0,

      language: normalizeLang(saved.language || detectLocalLang()),
      cheats: saved.cheats ?? false,
      fullscreen: saved.fullscreen ?? true,
      maxFPS: saved.maxFPS ?? 0,

      engineReady: false,
    }
  },

  actions: {
    async startGame() {
      if (this.loading || this.started) return

      this.loading = true
      this.progress = 0

      await this.loadEngine()

      // ⭐ 同步所有配置给原生 game.js
      window.VCSKY?.setConfig?.({
        language: this.language,
        cheats: this.cheats,
        fullscreen: this.fullscreen,
        maxFPS: this.maxFPS,
      })

      window.VCSKY.onProgress = (p) => {
        this.progress = p
      }

      window.VCSKY.onReady = () => {
        this.loading = false
        this.ready = true
      }

      window.VCSKY.start()
    },

    async loadEngine() {
      if (this.engineReady) return

      await loadScriptOnce('/assets/js/GamepadEmulator.js')
      await loadScriptOnce('/assets/js/idbfs.js')
      await loadScriptOnce('/assets/js/game.js')

      this.engineReady = true
    },

    // 保存配置到 localStorage
    saveConfig() {
      const config = {
        language: this.language,
        cheats: this.cheats,
        fullscreen: this.fullscreen,
        maxFPS: this.maxFPS,
      }
      try {
        localStorage.setItem(LOCAL_KEY, JSON.stringify(config))
      } catch (e) {
        console.warn('保存游戏配置失败', e)
      }
    },

    // 手动重置配置
    resetConfig() {
      localStorage.removeItem(LOCAL_KEY)
      this.language = 'zh'
      this.cheats = false
      this.fullscreen = true
      this.maxFPS = 0
    },
  },

  getters: {
    t: (state) => (key) => {
      if (window.VCSKY?.t) return window.VCSKY.t(key)

      const lang = normalizeLang(state.language)
      const dict = FALLBACK_I18N[lang] || FALLBACK_I18N.en

      // 支持两种：嵌套 key（CheatMenu.Title）和扁平 key（StartGame）
      const val =
        getByPath(dict, key) ??
        dict?.[key] ??
        getByPath(FALLBACK_I18N.en, key) ??
        FALLBACK_I18N.en?.[key]

      return val != null ? String(val) : key
    },
  },
})
