import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', {
  state: () => ({
    started: false,
    fullscreen: false,
  }),

  actions: {
    startGame() {
      this.started = true

      // 只有勾选 fullscreen 才请求浏览器全屏
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
