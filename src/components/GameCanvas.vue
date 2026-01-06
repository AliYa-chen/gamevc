<script setup>
import { onMounted, watch, ref, computed } from 'vue'
import { useGameStore } from '@/stores/game'
import TouchControls from './TouchControls.vue'

const game = useGameStore()

const showIntro = ref(true) // 视频是否显示

function enterGame() {
  game.started = true
  showIntro.value = false

  if (game.fullscreen) {
    document.documentElement.requestFullscreen?.();
  }
}

watch(
  () => game.ready,
  (v) => {
    if (!v) return
    game.started = true
  }
)

</script>

<template>
  <div class="emscripten w-full h-full text-white" @click="enterGame">
    <!-- 视频背景 -->
    <div v-if="game.ready && !game.loading && showIntro" class="absolute inset-0 w-full h-full intro-container z-50">
      <video class="absolute inset-0 w-full h-full intro" src="/assets/video/intro.mp4" autoplay playsinline></video>
      <div class="flex pointer-events-none absolute inset-x-0 bottom-0 p-4 sm:p-5 justify-center">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><a
            class="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm font-medium backdrop-blur transition-colors hover:bg-white/20 self-start sm:self-auto"
            aria-label="Open case study: GTA VC">{{ game.t('ClickToContinue') }}</a>
        </div>
      </div>
    </div>

    <canvas id="canvas" class="emscripten w-full h-full" oncontextmenu="event.preventDefault()" />
    <TouchControls />
  </div>
</template>
