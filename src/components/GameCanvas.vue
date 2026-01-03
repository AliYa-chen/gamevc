<script setup>
import { onMounted, watch } from 'vue'
import { useGameStore } from '@/stores/game'

const game = useGameStore()
</script>

<template>
  <canvas
    id="canvas"
    class="emscripten block w-full h-full"
    oncontextmenu="event.preventDefault()"
  />
</template>


