import { defineStore } from 'pinia'

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
    fullscreen: false,
    engineReady: false,
  }),

  actions: {
    async startGame() {
      if (this.loading || this.started) return

      this.loading = true
      this.progress = 0

      await this.loadEngine()

      // ⭐ 同步 Vue 的 fullscreen 状态给 game.js
      window.VCSKY?.setFullscreen?.(this.fullscreen);

      // 1️⃣ 接收真实下载进度
      window.VCSKY.onProgress = (p) => {
        this.progress = p
      }

      // 2️⃣ 下载完成（setStatus 触发）
      window.VCSKY.onReady = () => {
        this.loading = false
        this.ready = true
      }

      // 3️⃣ 真正启动游戏
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
})
