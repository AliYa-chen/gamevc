<script setup>
import { onMounted, watch,ref } from 'vue'
import { useGameStore } from '@/stores/game'

const game = useGameStore()

const showIntro = ref(true) // 视频是否显示

function enterGame() {
  // 用户点击继续
  window.VCSKY?.start?.()
  game.started = true
  showIntro.value = false

  if (game.fullscreen) {
    document.getElementById('canvas')?.requestFullscreen?.()
  }
}

onMounted(() => {
  // 可选：视频自动播放
  const video = document.querySelector<HTMLVideoElement>('.intro')
  if (video) {
    video.play().catch(() => {
      // 移动端自动播放可能被阻止
      console.log('Video autoplay blocked, wait for user interaction')
    })
  }
})

watch(
  () => game.ready,
  (v) => {
    if (!v) return

    game.started = true

    // 是否浏览器全屏，只看勾选
    if (game.fullscreen) {
      requestAnimationFrame(() => {
        document.getElementById('canvas')?.requestFullscreen?.()
      })
    }
  }
)

</script>

<template>
  <!-- 视频背景 -->
    <video v-if="game.ready && !game.loading && showIntro" @click="enterGame"
      class="absolute inset-0 w-full h-full object-cover"
      src="/assets/video/intro.mp4"
      autoplay
      muted
      playsinline
    ></video>
  <canvas
      id="canvas"
      class="emscripten w-full h-full"
      oncontextmenu="event.preventDefault()"
    />
</template>



