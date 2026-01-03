<script setup>
import { ref, onMounted } from 'vue'
import { useGameStore } from '@/stores/game'

const game = useGameStore()

const entered = ref(false)

onMounted(() => {
  requestAnimationFrame(() => {
    entered.value = true
  })
})
</script>


<template>
  <aside class="lg:sticky lg:top-4 lg:h-[calc(100svh-2rem)]">
    <!-- 外壳  -->
    <div class="relative h-full rounded-3xl border border-white/10
             bg-white/5 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
             backdrop-blur-2xl overflow-hidden">
      <!-- ✅ 背景动态层  -->
      <div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-3xl">
        <div class="absolute -left-4 -top-4 h-64 w-64 rounded-full
                 bg-purple-500/20 blur-3xl
                 animate-blob mix-blend-screen" />
        <div class="absolute -right-4 top-0 h-64 w-64 rounded-full
                 bg-blue-500/20 blur-3xl
                 animate-blob animation-delay-2000 mix-blend-screen" />
        <div class="absolute -bottom-8 left-20 h-64 w-64 rounded-full
                 bg-pink-500/20 blur-3xl
                 animate-blob animation-delay-4000 mix-blend-screen" />
      </div>

      <!-- ✅ 内容动画层（模糊 → 清晰） -->
      <div class="relative flex h-full flex-col gap-8 p-6 sm:p-8
               transition-all duration-1200 ease-out" :class="entered
                ? 'opacity-100 translate-y-0 scale-100 blur-0'
                : 'opacity-0 translate-y-4.5 scale-[0.98] blur-[10px]'">
        <!-- LOGO -->
        <div class="flex items-center gap-2">
          <div class="text-2xl font-extrabold tracking-tight">MYGTA</div>
          <div class="h-2 w-2 rounded-full bg-white/60" />
        </div>

        <!-- 设置面板  -->
        <div class="rounded-2xl border border-white/15 bg-black/50
                 px-4 py-4 backdrop-blur-xl
                 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.8)]">
          <p class="mb-4 text-xs font-semibold tracking-widest text-white/50">
            GAME SETTINGS
          </p>

          <div class="grid gap-3 text-sm">
            <div class="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
              <span class="text-white/70">Language</span>
              <select class="rounded-md bg-black/40 px-2 py-1 text-white">
                <option>简体中文</option>
                <option>English</option>
                <option>Русский</option>
              </select>
            </div>

            <div class="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
              <span class="text-white/70">Cheats (F3)</span>
              <input type="checkbox" class="accent-purple-400" />
            </div>

            <div class="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
              <span class="text-white/70">Fullscreen</span>
              <input type="checkbox" v-model="game.fullscreen" class="accent-purple-400" />
            </div>

            <div class="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
              <span class="text-white/70">Max FPS</span>
              <input type="number" value="0" class="w-20 rounded-md bg-black/40 px-2 py-1 text-right text-white" />
            </div>
          </div>

          <p class="mt-3 text-[0.65rem] text-white/40">
            0 = unlimited
          </p>
        </div>
      </div>
    </div>
  </aside>
</template>
