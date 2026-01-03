<script setup>
import { onMounted, watch } from 'vue'
import { useGameStore } from '@/stores/game'

const game = useGameStore()

onMounted(() => {
  if (game.fullscreen) {
    requestFullscreen()
  }
})

function requestFullscreen() {
  const el = document.getElementById('canvas')
  if (el?.requestFullscreen) {
    el.requestFullscreen()
  }
}
</script>

<template>
  <canvas
    id="canvas"
    class="emscripten w-full h-full"
    oncontextmenu="event.preventDefault()"
  />
</template>
