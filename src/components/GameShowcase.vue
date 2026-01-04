<script setup>
import { ref, onMounted } from 'vue'
import { useGameStore } from '@/stores/game'
import LoadingGame from './LoadingGame.vue';

const game = useGameStore()


defineProps({
  imgSrc: {
    type: String,
    required: true,
  },
})

const entered = ref(false)

const badges = [
  'GTAVC',
  'Online',
]

onMounted(() => {
  requestAnimationFrame(() => {
    entered.value = true
  })
})
</script>

<template>
  <article class="group relative transition-all duration-700 ease-in-out">
    <div class="relative h-full transition-all duration-1200 ease-out will-change-transform" :class="entered
      ? 'opacity-100 translate-y-0 scale-100 blur-0'
      : 'opacity-0 translate-y-4.5 scale-[0.98] blur-[10px]'">
      <div class="rounded-3xl border border-white/10 p-1
               shadow-[0_10px_60px_-10px_rgba(0,0,0,0.6)]
               lg:h-full" style="background-image: linear-gradient(135deg, rgb(112, 26, 117), rgb(244, 63, 94))">
        <div class="relative overflow-hidden rounded-[1.35rem] bg-black
         transition-all duration-700 lg:h-full">
          <!-- ===== 未开始：封面 + 按钮 ===== -->
          <!-- ================= 主图 ================= -->
          <a class="group relative block w-full
         aspect-4/3
         sm:aspect-video
         lg:aspect-auto
         lg:h-full">
            <img :src="imgSrc" class="absolute inset-0 h-full w-full object-cover" />

            <!-- 渐变遮罩 -->
            <div class="pointer-events-none absolute inset-0
           bg-linear-to-t from-black/30 via-transparent to-black/40" />

            <!-- ================= 中央操作按钮 ================= -->
            <div class="pointer-events-none absolute inset-0
           flex items-center justify-center">
              <!-- ===== PC：圆形播放按钮 ===== -->
              <button class="pointer-events-auto group/play
             hidden lg:flex
             h-20 w-20 items-center justify-center
             rounded-full
             bg-white/20 hover:bg-white/30
             backdrop-blur-xl
             border border-white/30
             shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)]
             transition-all duration-300
             hover:scale-110
             active:scale-95" aria-label="Play" @click="game.startGame()">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-8 w-8 text-white
               transition-transform duration-500 ease-out
               group-hover/play:rotate-20">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>

              <!-- ===== Mobile：开始游戏按钮 ===== -->
              <button class="pointer-events-auto
             lg:hidden
             inline-flex items-center gap-2
             rounded-full
             bg-white/20 hover:bg-white/30
             backdrop-blur-xl
             border border-white/30
             px-6 py-3
             text-sm font-semibold text-white
             shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)]
             transition-all duration-300
             active:scale-95" @click="game.startGame()">
                ▶ 开始游戏
              </button>
            </div>

            <LoadingGame />
          </a>


          <!-- ================= 顶部 badges ================= -->
          <div class="pointer-events-none absolute left-4 top-4 flex flex-wrap gap-2">
            <span v-for="badge in badges" :key="badge" data-slot="badge" class="inline-flex items-center justify-center rounded-md border
                     px-2 py-0.5 text-xs font-medium
                     bg-black/50 text-white border-white/20
                     backdrop-blur-sm
                     pointer-events-auto">
              {{ badge }}
            </span>
          </div>

          <!-- ================= 底部信息区 ================= -->
          <div class="pointer-events-none absolute inset-x-0 bottom-0 p-4 sm:p-5">
            <div class="flex flex-col gap-3
                     sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 class="text-lg font-semibold sm:text-xl">
                  GTAVC
                </h3>
                <p class="text-sm text-white/70">
                  在线式游戏
                </p>
              </div>

              <!-- 右下角详情 -->
              <div class="hidden">
                <a class="pointer-events-auto inline-flex items-center gap-2
                       rounded-full bg-white/10
                       px-3 py-2 text-sm font-medium
                       backdrop-blur
                       transition-colors hover:bg-white/20
                       self-start sm:self-auto" aria-label="Start Game">
                  <span>查看详情</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>
