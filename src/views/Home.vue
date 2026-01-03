<script setup>
import Sidebar from '@/components/Sidebar.vue'
import GameShowcase from '@/components/GameShowcase.vue'
import { useGameStore } from '@/stores/game'

const game = useGameStore()
import GameCanvas from '@/components/GameCanvas.vue'

const imgSrc = new URL('@/assets/img/Vice_City_1.jpg', import.meta.url).href
</script>

<template>
  <div v-if="!game.started" class="font-sans antialiased bg-[#050505]" data-is-touch="0" data-state-menu="1">
    <main class="relative min-h-screen overflow-hidden bg-[#050505] text-white selection:bg-pink-500/30">
      <!-- 背景 -->
      <div class="pointer-events-none fixed inset-0 z-0">
        <div
          class="absolute -left-[20%] -top-[20%] h-[70vw] w-[70vw] rounded-full bg-purple-900/20 blur-[120px] mix-blend-screen" />
        <div
          class="absolute -right-[20%] top-[10%] h-[60vw] w-[60vw] rounded-full bg-pink-900/20 blur-[120px] mix-blend-screen" />
        <div
          class="absolute bottom-[-20%] left-[10%] h-[50vw] w-[50vw] rounded-full bg-blue-900/15 blur-[120px] mix-blend-screen" />
        <div
          class="absolute bottom-[-10%] right-[-10%] h-[40vw] w-[40vw] rounded-full bg-teal-900/10 blur-[100px] mix-blend-screen" />
      </div>

      <section class="relative z-10 px-4 py-4">
        <div class="grid h-full grid-cols-1 gap-4 lg:grid-cols-[420px_1fr]">
          <Sidebar class="order-2 lg:order-1" />
          <GameShowcase :img-src="imgSrc" class="order-1 lg:order-2" />
        </div>
      </section>
    </main>
  </div>
  <GameCanvas v-show="game.started" />
</template>
