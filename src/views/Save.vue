<template>
  <div
    class="min-h-screen w-full
           bg-gradient-to-br from-slate-950 via-slate-900 to-black
           text-slate-100
           flex flex-col items-center
           p-6"
  >
    <!-- 标题 -->
    <h1 class="mb-8 text-3xl font-bold tracking-wide text-amber-400 drop-shadow">
      {{ game.t('SaveTitle') }}
    </h1>

    <!-- 顶部操作 -->
    <div class="mb-8 flex flex-wrap gap-4">
      <button
        @click="renderSaves"
        class="px-5 py-2 rounded-lg font-semibold bg-amber-500 text-black hover:bg-amber-600 transition"
      >
        {{ game.t('SaveRefreshButton') }}
      </button>

      <button
        @click="downloadMaxSave"
        class="px-5 py-2 rounded-lg font-semibold bg-green-500 text-white hover:bg-green-600 transition"
      >
        {{ game.t('SaveSpecialButton') }}
      </button>

      <button
        @click="goback"
        class="px-5 py-2 rounded-lg font-semibold bg-purple-500 text-white hover:bg-purple-600 transition"
      >
        {{ game.t('SaveGoBackButton') }}
      </button>

      <button
        @click="repairSaves"
        class="px-5 py-2 rounded-lg font-semibold bg-cyan-500 text-white hover:bg-cyan-600 transition"
      >
        {{ game.t('SaveRepairButton') }}
      </button>


       <button
        @click="clearCache"
        class="px-5 py-2 rounded-lg font-semibold bg-rose-500 text-white hover:bg-rose-600 transition"
      >
        {{ game.t('SaveClearCacheButton') }}
      </button>
    </div>

    <!-- 隐藏上传 -->
    <input ref="fileInput" type="file" class="hidden" @change="handleUpload" />

    <!-- 存档列表 -->
    <div class="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="slot in slots"
        :key="slot.index"
        class="rounded-xl border border-white/10 bg-white/5 backdrop-blur p-5 shadow-lg hover:shadow-xl transition"
      >
        <!-- 头部 -->
        <div class="mb-3 flex items-center justify-between">
          <span class="text-lg font-semibold text-amber-400">
            {{ game.t('SaveArchiveSlot') }} {{ slot.index }}
          </span>
          <span class="text-sm font-medium" 
                :class="slot.loading ? 'text-sky-400' : slot.exists ? 'text-emerald-400' : 'text-slate-400'">
            {{ slot.loading ? `⏳ ${game.t('SaveSlotLoading')}...` : slot.exists ? `✔ ${game.t('SaveSlotExist')}` : `✖ ${game.t('SaveNotSlot')}` }}
          </span>
        </div>

        <!-- 信息 -->
        <div class="mb-4 text-sm text-slate-400">
          <template v-if="slot.loading">
            {{ game.t('SaveSlotLoading') }}…
          </template>
          <template v-else-if="slot.exists">
            {{ game.t('SaveSlotSize') }}：{{ (slot.size / 1024).toFixed(1) }} KB
          </template>
          <template v-else>
            {{ game.t('SaveNotSlot') }}
          </template>
        </div>

        <!-- 按钮 -->
        <div class="grid grid-cols-2 gap-3">
          <button
            @click="selectUpload(slot)"
            class="px-4 py-2 rounded-lg text-sm font-medium bg-sky-500 text-white hover:bg-sky-600 transition"
            :disabled="slot.loading"
          >
            {{ game.t('SaveUpButton') }}
          </button>

          <button
            @click="useMaxSave(slot.index)"
            class="px-4 py-2 rounded-lg text-sm font-medium bg-violet-500 text-white hover:bg-violet-600 transition"
            :disabled="slot.loading"
          >
            {{ game.t('SaveMaxLevel') }}
          </button>

          <button
            @click="remove(slot)"
            class="px-4 py-2 rounded-lg text-sm font-medium bg-rose-500 text-white hover:bg-rose-600 transition"
            :disabled="slot.loading"
          >
            {{ game.t('Del') }}
          </button>

          <button
            :disabled="!slot.exists || slot.loading"
            @click="download(slot)"
            class="px-4 py-2 rounded-lg text-sm font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {{ game.t('Download') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'

const game = useGameStore()

// 引入全局存档模块
import { getSlots, getSave, writeSave, deleteSave,deleteWholeSavesDB } from '@/utils/vcSaves'

const router = useRouter()
const slots = ref([])
const fileInput = ref(null)
let currentSlot = null

/** 渲染存档槽位 */
async function renderSaves() {
  // 先标记 loading
  slots.value = Array.from({ length: 8 }, (_, i) => ({
    index: i + 1,
    exists: false,
    size: 0,
    loading: true
  }))

  const loadedSlots = await getSlots()
  slots.value = loadedSlots
}

/** 选择上传 */
function selectUpload(slot) {
  currentSlot = slot.index
  fileInput.value.click()
}

/** 上传处理 */
async function handleUpload(e) {
  const file = e.target.files[0]
  if (!file || !currentSlot) return

  try {
    await writeSave(currentSlot, await file.arrayBuffer())
  } catch (err) {
    alert(String(err?.message || err))
  } finally {
    currentSlot = null
    e.target.value = ''
    renderSaves()
  }
}

/** 下载存档 */
async function download(slot) {
  const save = await getSave(slot.index)
  if (!save) return

  const blob = new Blob([save.contents], { type: 'application/octet-stream' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `GTAVCsf${slot.index}.b`
  a.click()
  URL.revokeObjectURL(a.href)
}

/** 使用满级存档 */
async function useMaxSave(slot) {
  try {
    const resp = await fetch('/GTAVC_SAVE.bin')
    if (!resp.ok) throw new Error('满级存档下载失败')
    await writeSave(slot, await resp.arrayBuffer())
  } catch (err) {
    alert(String(err?.message || err))
  } finally {
    renderSaves()
  }
}

/** 删除存档槽位 */
async function remove(slot) {
  if (!confirm(`确认删除槽位 ${slot.index} 存档吗？`)) return
  await deleteSave(slot.index)
  renderSaves()
}

/** 清理缓存 */
function clearCache() {
  const req = indexedDB.deleteDatabase('/vc-assets/fetched')
  req.onsuccess = () => alert('缓存已清除')
  req.onerror = e => alert('清理失败：' + e.target.error)
}

/** 下载特殊存档 */
function downloadMaxSave() {
  fetch('/各种关卡存档.zip')
    .then(resp => {
      if (!resp.ok) throw new Error('各种关卡存档下载失败')
      return resp.blob()
    })
    .then(blob => {
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = '各种关卡存档.zip'
      a.click()
      URL.revokeObjectURL(a.href)
    })
}

async function repairSaves() {
  const ok = confirm('修复存档会清空所有本地存档数据（相当于删除整个存档数据库），确定继续吗？')
  if (!ok) return

  try {
    // 1) 删除存档 DB
    await deleteWholeSavesDB()

    // 2) 清理一些可能的旧标记/缓存（可选但建议）
    localStorage.removeItem('vcsky.saves')

    // 如果你还遇到过 fetched 缓存/数据缓存导致不一致，也可以一并删
    // indexedDB.deleteDatabase('/vc-assets/fetched')  // 你原来 clearCache 已经有了

    alert('已修复：存档数据库已清空。页面将刷新以重新初始化。')

    // 3) 刷新页面让 openDB / 游戏重新建库
    location.reload()
  } catch (err) {
    alert('修复失败：' + String(err?.message || err))
  } finally {
    // 刷新前不需要 renderSaves；reload 会重新走 onMounted
  }
}


/** 回主页 */
function goback() {
  router.push('/')
}

onMounted(renderSaves)
</script>
