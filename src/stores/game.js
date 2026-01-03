import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', {
  state: () => ({
    started: false,     // 是否已经进入游戏
    loading: false,     // 是否正在加载
    progress: 0,        // 0 - 100
    fullscreen: false,
  }),

  actions: {
    startGame() {
      // 第一步：进入 loading 状态
      this.loading = true
      this.progress = 0

      this.fakeLoad()
    },

    fakeLoad() {
      // 这里先用假进度（以后你可以接 wasm / rom / init）
      const timer = setInterval(() => {
        this.progress += Math.random() * 12

        if (this.progress >= 100) {
          this.progress = 100
          clearInterval(timer)

          this.finishLoading()
        }
      }, 300)
    },

    finishLoading() {
      this.loading = false
      this.started = true

      if (this.fullscreen) {
        this.requestBrowserFullscreen()
      }
    },

    requestBrowserFullscreen() {
      requestAnimationFrame(() => {
        const el = document.getElementById('canvas')
        if (!el) return

        const req =
          el.requestFullscreen ||
          el.webkitRequestFullscreen ||
          el.mozRequestFullScreen ||
          el.msRequestFullscreen

        req?.call(el)
      })
    },
  },
})
