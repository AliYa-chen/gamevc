import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', {
  state: () => ({
    started: false,     // 是否进入游戏
    fullscreen: false,  // 是否全屏
  }),

  actions: {
    startGame() {
      this.started = true
    },
    stopGame() {
      this.started = false
    },
    setFullscreen(val) {
      this.fullscreen = val
    },
  },
})
