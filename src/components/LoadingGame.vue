<script setup>
import { useGameStore } from '@/stores/game'

const game = useGameStore()

</script>
<template>
    <!-- ===== Loading Overlay ===== -->
    <div v-if="game.loading" class="absolute inset-0 z-20
         flex flex-col items-center justify-center
         bg-black/60 backdrop-blur-sm
         transition-opacity duration-500">
        <!-- 文字 -->
        <p class="mb-4 text-sm tracking-widest text-white/70">
            LOADING GAME
        </p>

        <!-- 空心进度条 -->
        <div class="w-56 max-w-[70%]
              rounded-full
              border border-white/40
              p-1">
            <!-- 实心进度 -->
            <div class="h-2 rounded-full
             bg-linear-to-r from-pink-500 via-purple-500 to-indigo-500
             transition-all duration-300 ease-out" :style="{ width: game.progress + '%' }" />
        </div>

        <!-- 百分比 -->
        <p class="mt-3 text-xs text-white/50">
            {{ Math.floor(game.progress) }}%
        </p>
    </div>

</template>