import { defineStore } from 'pinia'
import FALLBACK_I18N from '@/i18n'

function loadScriptOnce(src) {
  return new Promise((resolve, reject) => {
    // 防止重复加载
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

export const useGameStore = defineStore('game', {
  state: () => ({
    started: false,   // 是否已进入游戏
    loading: false,   // 是否正在下载
    ready: false,     // ⭐ 是否“点击继续”
    progress: 0,

    // ===== 配置项 =====
    language: 'zh',     // en | ru | zh
    cheats: false,      // Cheats (F3)
    fullscreen: true,
    maxFPS: 0,          // 0 = unlimited

    engineReady: false,
  }),

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
  },
  getters: {
    t: (state) => (key) => {
      if (window.VCSKY?.t) {
        return window.VCSKY.t(key)
      }
      return FALLBACK_I18N[state.language]?.[key] || key
    },
  },
})