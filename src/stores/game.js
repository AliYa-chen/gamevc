import { defineStore } from 'pinia'
import FALLBACK_I18N from '@/i18n'

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

      language: saved.language || 'zh',   // 从缓存读取
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
      return FALLBACK_I18N[state.language]?.[key] || key
    },
  },
})
