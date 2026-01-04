<script setup>
import { ref, onMounted,watch } from 'vue'
import { useGameStore } from '@/stores/game'
import { useRouter } from 'vue-router'
import { getSaveCount } from '@/utils/vcSaves'
import Acknowledgements from './Acknowledgements.vue'

const savecount = ref(0)      // 存档数量
const router = useRouter()
const game = useGameStore()
const entered = ref(false)

onMounted(() => {
  // 异步获取存档数量
  async function fetchSaveCount() {
    const c = await getSaveCount()
    savecount.value = c
    console.log('当前存档数量', savecount.value)
  }
  fetchSaveCount()

  requestAnimationFrame(() => {
    entered.value = true
  })
})

// 自动缓存语言
watch(
  () => game.language,
  (newLang) => {
    game.saveConfig()  // store 中保存配置到 localStorage
  }
)

function gosave() {
  router.push('/save')
}
</script>


<template>
  <aside class="lg:sticky lg:top-4 lg:h-[calc(100svh-2rem)]">
    <!-- 外壳 -->
    <div class="relative h-full rounded-3xl border border-white/10
             bg-white/5 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
             backdrop-blur-2xl overflow-hidden
             transition-all duration-300" :class="game.loading && 'opacity-60 saturate-50'">
      <!-- 背景动态层 -->
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

      <!-- 内容动画层 -->
      <div class="relative flex h-full flex-col gap-7 p-6 sm:p-7 transition-all duration-1200 ease-out"
        :class="entered ? 'opacity-100 translate-y-0 scale-100 blur-0' : 'opacity-0 translate-y-4.5 scale-[0.98] blur-[10px]'">
        <!-- LOGO -->
        <div class="flex items-center gap-2">
          <div class="text-2xl font-extrabold tracking-tight">MYGTA</div>
          <div class="h-2 w-2 rounded-full bg-emerald-400" />
        </div>

        <!-- 设置面板 -->
        <div
          class="rounded-2xl border border-white/15 bg-black/30 px-4 py-4 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.8)]">
          <p class="mb-4 text-xs font-semibold tracking-widest text-white/50">
            {{ game.t('GameSettings') }}
          </p>

          <div class="grid gap-3 text-sm">
            <div class="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
              <span class="text-white/70">{{ game.t('Language') }}</span>
              <select v-model="game.language" class="rounded-md bg-black/40 px-2 py-1 text-white">
                <option value="zh">简体中文</option>
                <option value="en">English</option>
                <option value="ru">Русский</option>
              </select>

            </div>

            <div class="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
              <span class="text-white/70">{{ game.t('Cheats') }} (F3)</span>
              <input type="checkbox" v-model="game.cheats" class="accent-purple-400" />
            </div>

            <div class="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
              <span class="text-white/70">{{ game.t('Fullscreen') }}</span>
              <input type="checkbox" v-model="game.fullscreen" class="accent-purple-400" />
            </div>

            <div class="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
              <span class="text-white/70">{{ game.t('MaxFPS') }}</span>
              <input type="number" v-model.number="game.maxFPS" min="0" max="240"
                class="w-20 rounded-md bg-black/40 px-2 py-1 text-right text-white" />
            </div>
          </div>

          <p class="mt-3 text-[0.65rem] text-white/40">
            0 = {{ game.t('Unlimited') }}
          </p>
        </div>

        <!-- 云存档按钮 -->
        <div>
          <button class="
                      group relative flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 border w-[calc(50%-4px)]
                      bg-emerald-500/10 border-emerald-500/30 text-emerald-100 hover:bg-emerald-500/20 hover:border-emerald-500/50 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.8)]
                    " @click="gosave">
            <div class="flex items-center gap-1.5 min-w-0">
              <div class="w-1.5 h-1.5 rounded-full transition-colors bg-emerald-400"></div><span
                class="truncate">{{game.t('SaveGameEdit')}}</span>
            </div><span
              class="text-[10px] px-1.5 py-0.5 rounded-md transition-colors bg-emerald-500/20 text-emerald-200">{{
              savecount }}</span>
          </button>
        </div>

        <!-- 免责声明 -->
        <div>
          <span class="text-center text-xs">{{ game.t('DisclaimerSources') }}<a class="text-purple-500" href="https://github.com/SugaryHull/re3/tree/miami" target="_blank">(GitHub)</a></span>
        </div>
        <!-- 名牌名单 原著信息 -->
        <div>
          <p class="mb-3 text-xs font-semibold tracking-widest text-white/50">{{ game.t('RelatedDevelopers') }}</p>
          <Acknowledgements />
        </div>

      </div>

      <!-- 禁用遮罩（开始进度后） -->
      <div v-if="game.loading" class="absolute inset-0 z-30
               bg-white/5 backdrop-blur-sm
               cursor-not-allowed
               pointer-events-auto
               transition-opacity duration-300">
        <!-- 锁定提示 -->
        <div class="flex h-full items-center justify-center">
          <div class="text-xs tracking-widest text-white/40">
            {{ game.t('SettingsLocked') }}
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>
