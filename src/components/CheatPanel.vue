<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useGameStore } from '@/stores/game'

const game = useGameStore()



/**
 * ====== Cheats 列表 ======
 */
const cheatGroups = [
  {
    key: 'weapons',
    titleKey: 'CheatMenu.Cheats.Group.Weapons',
    items: [
      { code: 'THUGSTOOLS', labelKey: 'CheatMenu.Cheats.Item.THUGSTOOLS' },
      { code: 'PROFESSIONALTOOLS', labelKey: 'CheatMenu.Cheats.Item.PROFESSIONALTOOLS' },
      { code: 'NUTTERTOOLS', labelKey: 'CheatMenu.Cheats.Item.NUTTERTOOLS' },
      { code: 'FULLCLIP', labelKey: 'CheatMenu.Cheats.Item.FULLCLIP' },
      { code: 'ASPIRINE', labelKey: 'CheatMenu.Cheats.Item.ASPIRINE' },
      { code: 'PRECIOUSPROTECTION', labelKey: 'CheatMenu.Cheats.Item.PRECIOUSPROTECTION' },
    ],
  },
  {
    key: 'gameplay',
    titleKey: 'CheatMenu.Cheats.Group.Gameplay',
    items: [
      { code: 'LEAVEMEALONE', labelKey: 'CheatMenu.Cheats.Item.LEAVEMEALONE' },
      { code: 'YOUWONTTAKEMEALIVE', labelKey: 'CheatMenu.Cheats.Item.YOUWONTTAKEMEALIVE' },
      { code: 'ONSPEED', labelKey: 'CheatMenu.Cheats.Item.ONSPEED' },
      { code: 'BOOOOOORING', labelKey: 'CheatMenu.Cheats.Item.BOOOOOORING' },
      { code: 'LIFEISPASSINGMEBY', labelKey: 'CheatMenu.Cheats.Item.LIFEISPASSINGMEBY' },
      { code: 'BIGBANG', labelKey: 'CheatMenu.Cheats.Item.BIGBANG' },
      { code: 'FIGHTFIGHTFIGHT', labelKey: 'CheatMenu.Cheats.Item.FIGHTFIGHTFIGHT' },
      { code: 'NOBODYLIKESME', labelKey: 'CheatMenu.Cheats.Item.NOBODYLIKESME' },
      { code: 'OURGODGIVENRIGHTTOBEARARMS', labelKey: 'CheatMenu.Cheats.Item.OURGODGIVENRIGHTTOBEARARMS' },
      { code: 'CHICKSWITHGUNS', labelKey: 'CheatMenu.Cheats.Item.CHICKSWITHGUNS' },
      { code: 'FANNYMAGNET', labelKey: 'CheatMenu.Cheats.Item.FANNYMAGNET' },
      { code: 'HOPINGIRL', labelKey: 'CheatMenu.Cheats.Item.HOPINGIRL' },
      { code: 'GREENLIGHT', labelKey: 'CheatMenu.Cheats.Item.GREENLIGHT' },
      { code: 'MIAMITRAFFIC', labelKey: 'CheatMenu.Cheats.Item.MIAMITRAFFIC' },
      { code: 'ICANTTAKEITANYMORE', labelKey: 'CheatMenu.Cheats.Item.ICANTTAKEITANYMORE' },
    ],
  },
  {
    key: 'skins',
    titleKey: 'CheatMenu.Cheats.Group.Skins',
    items: [
      { code: 'STILLLIKEDRESSINGUP', labelKey: 'CheatMenu.Cheats.Item.STILLLIKEDRESSINGUP' },
      { code: 'IDONTHAVETHEMONEYSONNY', labelKey: 'CheatMenu.Cheats.Item.IDONTHAVETHEMONEYSONNY' },
      { code: 'LOOKLIKELANCE', labelKey: 'CheatMenu.Cheats.Item.LOOKLIKELANCE' },
      { code: 'ILOOKLIKEHILARY', labelKey: 'CheatMenu.Cheats.Item.ILOOKLIKEHILARY' },
      { code: 'ROCKANDROLLMAN', labelKey: 'CheatMenu.Cheats.Item.ROCKANDROLLMAN' },
      { code: 'WELOVEOURDICK', labelKey: 'CheatMenu.Cheats.Item.WELOVEOURDICK' },
      { code: 'MYSONISALAWYER', labelKey: 'CheatMenu.Cheats.Item.MYSONISALAWYER' },
      { code: 'ONEARMEDBANDIT', labelKey: 'CheatMenu.Cheats.Item.ONEARMEDBANDIT' },
      { code: 'FOXYLITTLETHING', labelKey: 'CheatMenu.Cheats.Item.FOXYLITTLETHING' },
      { code: 'CHEATSHAVEBEENCRACKED', labelKey: 'CheatMenu.Cheats.Item.CHEATSHAVEBEENCRACKED' },
      { code: 'IWANTBIGTITS', labelKey: 'CheatMenu.Cheats.Item.IWANTBIGTITS' },
      { code: 'CERTAINDEATH', labelKey: 'CheatMenu.Cheats.Item.CERTAINDEATH' },
      { code: 'DEEPFRIEDMARSBARS', labelKey: 'CheatMenu.Cheats.Item.DEEPFRIEDMARSBARS' },
      { code: 'PROGRAMMER', labelKey: 'CheatMenu.Cheats.Item.PROGRAMMER' },
    ],
  },
  {
    key: 'vehicles',
    titleKey: 'CheatMenu.Cheats.Group.Vehicles',
    items: [
      { code: 'PANZER', labelKey: 'CheatMenu.Cheats.Item.PANZER' },
      { code: 'GETTHEREFAST', labelKey: 'CheatMenu.Cheats.Item.GETTHEREFAST' },
      { code: 'GETTHEREQUICKLY', labelKey: 'CheatMenu.Cheats.Item.GETTHEREQUICKLY' },
      { code: 'TRAVELINSTYLE', labelKey: 'CheatMenu.Cheats.Item.TRAVELINSTYLE' },
      { code: 'GETTHEREVERYFASTINDEED', labelKey: 'CheatMenu.Cheats.Item.GETTHEREVERYFASTINDEED' },
      { code: 'GETTHEREAMAZINGLYFAST', labelKey: 'CheatMenu.Cheats.Item.GETTHEREAMAZINGLYFAST' },
      { code: 'THELASTRIDE', labelKey: 'CheatMenu.Cheats.Item.THELASTRIDE' },
      { code: 'ROCKANDROLLCAR', labelKey: 'CheatMenu.Cheats.Item.ROCKANDROLLCAR' },
      { code: 'BETTERTHANWALKING', labelKey: 'CheatMenu.Cheats.Item.BETTERTHANWALKING' },
      { code: 'RUBBISHCAR', labelKey: 'CheatMenu.Cheats.Item.RUBBISHCAR' },
    ],
  },
  {
    key: 'aircraft',
    titleKey: 'CheatMenu.Cheats.Group.Aircraft',
    items: [
      { code: 'OHDUDE', labelKey: 'CheatMenu.Cheats.Item.OHDUDE' },
      { code: 'SEAPLANE', labelKey: 'CheatMenu.Cheats.Item.SEAPLANE' },
    ],
  },
  {
    key: 'vehicleFx',
    titleKey: 'CheatMenu.Cheats.Group.VehicleEffects',
    items: [
      { code: 'COMEFLYWITHME', labelKey: 'CheatMenu.Cheats.Item.COMEFLYWITHME' },
      { code: 'AIRSHIP', labelKey: 'CheatMenu.Cheats.Item.AIRSHIP' },
      { code: 'SEAWAYS', labelKey: 'CheatMenu.Cheats.Item.SEAWAYS' },
      { code: 'WHEELSAREALLINEED', labelKey: 'CheatMenu.Cheats.Item.WHEELSAREALLINEED' },
      { code: 'GRIPISEVERYTHING', labelKey: 'CheatMenu.Cheats.Item.GRIPISEVERYTHING' },
      { code: 'IWANTITPAINTEDBLACK', labelKey: 'CheatMenu.Cheats.Item.IWANTITPAINTEDBLACK' },
      { code: 'AHAIRDRESSERSCAR', labelKey: 'CheatMenu.Cheats.Item.AHAIRDRESSERSCAR' },
      { code: 'LOADSOFLITTLETHINGS', labelKey: 'CheatMenu.Cheats.Item.LOADSOFLITTLETHINGS' },
      { code: 'SPEEDFREAK', labelKey: 'CheatMenu.Cheats.Item.SPEEDFREAK' },
    ],
  },
  {
    key: 'weather',
    titleKey: 'CheatMenu.Cheats.Group.Weather',
    items: [
      { code: 'ALOVELYDAY', labelKey: 'CheatMenu.Cheats.Item.ALOVELYDAY' },
      { code: 'APLEASANTDAY', labelKey: 'CheatMenu.Cheats.Item.APLEASANTDAY' },
      { code: 'ABITDRIEG', labelKey: 'CheatMenu.Cheats.Item.ABITDRIEG' },
      { code: 'CATSANDDOGS', labelKey: 'CheatMenu.Cheats.Item.CATSANDDOGS' },
      { code: 'CANTSEEATHING', labelKey: 'CheatMenu.Cheats.Item.CANTSEEATHING' },
    ],
  },
]


function getRuntime() {
  const w = window
  return {
    Module: w.Module,
    HEAPU8: w.HEAPU8,
    HEAP32: w.HEAP32,
    HEAPF64: w.HEAPF64,
    _malloc: w._malloc,
    _free: w._free,
    stringToUTF8: w.stringToUTF8,
    getWasmTableEntry: w.getWasmTableEntry,
    JSEvents: w.JSEvents,
    currentLanguage: w.currentLanguage,
  }
}

/**
 * ====== 设备判断（原脚本逻辑） ======
 */
const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
const isTouch = isMobile && window.matchMedia('(pointer: coarse)').matches

/**
 * ====== UI 状态 ======
 */
const menuOpen = ref(false)

// touch toggle btn 位置（原 localStorage: cheat-toggle-pos）
const togglePos = reactive({
  left: null,
  top: null,
})

const flyPos = reactive({
  right: 20,
  bottom: 160,
})

/**
 * ====== 扫描器 / 结果 ======
 */
const scan = reactive({
  value: '',
  type: 'any',
})

const statusText = ref('就绪')

let results = [] // {addr, type, lastVal}
let isSearching = false
let lastBuffer = null

/**
 * ====== Airbreak / Godmode ======
 */
let airbreakEnabled = false
let airbreakConfigured = false
let airbreakShiftAllowed = false
let playerMatrixAddr = 0

const flySpeed = ref(2.0)
const keysPressed = reactive({ w: false, s: false, a: false, d: false, space: false, shift: false })

let positionAddr = 0
let headingAddr = 0
let healthAddr = 0
let moveSpeedAddr = 0
let lockedZ = 0
let lockedHealth = 100
let godModeEnabled = false
let moneyAddr = 0

const airbreakStatus = ref('就绪')
const posDisplay = ref('')




/**
 * ====== 工具：DataView / 读写 ======
 */
function getView() {
  const { HEAPU8 } = getRuntime()
  if (!HEAPU8?.buffer) throw new Error('HEAPU8 not ready')
  const buf = HEAPU8.buffer
  if (lastBuffer !== buf) {
    lastBuffer = buf
    console.log('[CheatEngine] Buffer changed, size:', buf.byteLength)
  }
  return new DataView(buf)
}

function readValue(view, addr, type) {
  try {
    const bufLen = view.buffer.byteLength
    if (addr < 0 || addr >= bufLen - 8) return null
    switch (type) {
      case 'i32': return view.getInt32(addr, true)
      case 'f32': return view.getFloat32(addr, true)
      case 'i16': return view.getInt16(addr, true)
      case 'i8': return view.getInt8(addr)
      case 'f64': return view.getFloat64(addr, true)
    }
  } catch (e) {
    console.warn('[CheatEngine] Read error at', addr, e)
  }
  return null
}

function writeValue(view, addr, type, newVal) {
  switch (type) {
    case 'i32': view.setInt32(addr, parseInt(newVal, 10), true); break
    case 'f32': view.setFloat32(addr, parseFloat(newVal), true); break
    case 'i16': view.setInt16(addr, parseInt(newVal, 10), true); break
    case 'i8': view.setInt8(addr, parseInt(newVal, 10)); break
    case 'f64': view.setFloat64(addr, parseFloat(newVal), true); break
    default: throw new Error('Unknown type')
  }
}

function updateStatus(text) {
  statusText.value = text
}

/**
 * ====== 结果展示（最多 100） ======
 */
const resultsView = computed(() => results.slice(0, 100).map(r => {
  let currentVal = '???'
  try {
    const view = getView()
    switch (r.type) {
      case 'i32': currentVal = String(view.getInt32(r.addr, true)); break
      case 'f32': currentVal = view.getFloat32(r.addr, true).toFixed(2); break
      case 'i16': currentVal = String(view.getInt16(r.addr, true)); break
      case 'i8': currentVal = String(view.getInt8(r.addr)); break
      case 'f64': currentVal = view.getFloat64(r.addr, true).toFixed(2); break
    }
  } catch {}
  return { ...r, currentVal }
}))

function editAddr(addr, type) {
  const v = prompt(`Enter new value for 0x${addr.toString(16)} (${type}):`)
  if (v == null) return
  try {
    const view = getView()
    writeValue(view, addr, type, v)
  } catch (e) {
    alert('Error writing to memory: ' + String(e?.message || e))
  }
}

/**
 * ====== 扫描器：match ======
 */
function checkMatch(view, addr, type, val, tolerance = 0.5) {
  try {
    switch (type) {
      case 'i32': return Math.abs(view.getInt32(addr, true) - val) <= tolerance
      case 'f32': {
        const v = view.getFloat32(addr, true)
        if (!Number.isFinite(v)) return false
        return Math.abs(v - val) <= tolerance
      }
      case 'i16': return Math.abs(view.getInt16(addr, true) - val) <= tolerance
      case 'i8': return Math.abs(view.getInt8(addr) - val) <= tolerance
      case 'f64': {
        const v = view.getFloat64(addr, true)
        if (!Number.isFinite(v)) return false
        return Math.abs(v - val) <= tolerance
      }
      case 'any': {
        const i32 = view.getInt32(addr, true)
        if (Math.abs(i32 - val) <= tolerance) return 'i32'
        const f32 = view.getFloat32(addr, true)
        if (Number.isFinite(f32) && Math.abs(f32 - val) <= tolerance) return 'f32'
        const i16 = view.getInt16(addr, true)
        if (Math.abs(i16 - val) <= tolerance) return 'i16'
        const i8 = view.getInt8(addr)
        if (Math.abs(i8 - val) <= tolerance) return 'i8'
        return false
      }
    }
  } catch {}
  return false
}

function snapshotValues() {
  if (!results.length) return
  const view = getView()
  let updated = 0
  for (const res of results) {
    const val = readValue(view, res.addr, res.type)
    if (val !== null) {
      res.lastVal = val
      updated++
    }
  }
  updateStatus(`Snapshot: ${updated} values captured`)
}

function firstSearch() {
  if (isSearching) return
  const val = parseFloat(scan.value)
  const type = scan.type
  if (Number.isNaN(val)) {
    updateStatus('Invalid value')
    return
  }

  isSearching = true
  updateStatus('Searching...')
  results = []

  setTimeout(() => {
    const view = getView()
    const bufferLen = view.buffer.byteLength
    console.log(`[CheatEngine] New search: value=${val}, type=${type}, bufferLen=${bufferLen}`)

    const step = (type === 'i8') ? 1 : 4
    for (let i = 0; i < bufferLen - 8; i += step) {
      const matchType = checkMatch(view, i, type, val)
      if (!matchType) continue
      const resType = type === 'any' ? matchType : type
      const cur = readValue(view, i, resType)
      if (cur !== null) {
        results.push({ addr: i, type: resType, lastVal: cur })
        if (results.length > 100000) break
      }
    }

    console.log(`[CheatEngine] Search complete: found ${results.length} addresses`)
    updateStatus(`Found ${results.length} addresses`)
    isSearching = false
  }, 10)
}

function nextSearch() {
  if (isSearching || results.length === 0) {
    if (results.length === 0) updateStatus("No results. Do 'New' search first.")
    return
  }
  const val = parseFloat(scan.value)
  if (Number.isNaN(val)) {
    updateStatus('Invalid value')
    return
  }

  isSearching = true
  const startCount = results.length
  updateStatus(`Filtering ${startCount} addresses...`)

  const view = getView()
  const bufLen = view.buffer.byteLength
  const newResults = []
  let skipped = 0
  let checked = 0
  const tolerance = 0.5

  for (const res of results) {
    if (res.addr < 0 || res.addr >= bufLen - 8) { skipped++; continue }
    checked++
    const currentVal = readValue(view, res.addr, res.type)
    if (currentVal === null) { skipped++; continue }
    if (Math.abs(currentVal - val) <= tolerance) {
      res.lastVal = currentVal
      newResults.push(res)
    }
  }

  console.log(`[CheatEngine] Checked: ${checked}, Skipped: ${skipped}, Found: ${newResults.length}`)
  results = newResults
  updateStatus(`Found ${results.length}/${startCount} addresses`)
  isSearching = false
}

function filterResults(mode) {
  if (isSearching || results.length === 0) {
    if (results.length === 0) updateStatus("No results to filter. Do 'New' search first.")
    return
  }
  isSearching = true
  updateStatus('Filtering...')

  const view = getView()
  const bufLen = view.buffer.byteLength
  const newResults = []

  for (const res of results) {
    if (res.addr < 0 || res.addr >= bufLen - 8) continue
    const oldVal = res.lastVal
    const newVal = readValue(view, res.addr, res.type)
    if (newVal === null) continue
    if (oldVal === undefined || oldVal === null) { res.lastVal = newVal; continue }

    let match = false
    if (mode === 'inc' && newVal > oldVal) match = true
    if (mode === 'dec' && newVal < oldVal) match = true
    if (mode === 'changed' && Math.abs(newVal - oldVal) > 0.0001) match = true

    if (match) {
      res.lastVal = newVal
      newResults.push(res)
    }
  }

  results = newResults
  updateStatus(`Found ${results.length} addresses (compared to snapshot)`)
  isSearching = false
}

function resetScan() {
  results = []
  updateStatus('Reset')
}

/**
 * ====== 手动地址 ======
 */
const manual = reactive({
  addrHex: '',
  rows: [],
  visible: false,
})

function viewManualAddr() {
  const addr = parseInt(manual.addrHex, 16)
  const view = getView()
  const bufLen = view.buffer.byteLength
  if (Number.isNaN(addr) || addr < 0 || addr >= bufLen - 8) {
    alert(`Invalid address (out of range: 0 - 0x${(bufLen - 8).toString(16)})`)
    return
  }

  const types = ['i8', 'i16', 'i32', 'f32', 'f64']
  manual.rows = types.map(type => {
    let val = '???'
    try {
      switch (type) {
        case 'i8': val = view.getInt8(addr); break
        case 'i16': val = view.getInt16(addr, true); break
        case 'i32': val = view.getInt32(addr, true); break
        case 'f32': val = view.getFloat32(addr, true).toFixed(4); break
        case 'f64': val = view.getFloat64(addr, true).toFixed(4); break
      }
    } catch {}
    return { addr, type, val }
  })
  manual.visible = true
}

function editManual(row) {
  editAddr(row.addr, row.type)
  viewManualAddr()
}

/**
 * ====== 菜单开关 ======
 */
function toggleMenu() {
  menuOpen.value = !menuOpen.value

  const { Module } = getRuntime()
  if (menuOpen.value) {
    if (document.pointerLockElement) document.exitPointerLock?.()
    document.body.style.cursor = 'default'
    if (Module?.canvas) Module.canvas.style.cursor = 'default'
  } else {
    if (Module?.canvas) Module.canvas.style.cursor = 'none'
    document.body.style.cursor = 'none'
  }
}

/**
 * ====== Emscripten 事件拦截  ======
 * 关键：只 patch 一次，避免重复包裹导致各种“越搞越乱”
 */
function patchJSEventsOnce() {
  const w = window
  const { JSEvents } = getRuntime()
  if (!JSEvents?.registerOrRemoveHandler) return
  if (w.__CHEAT_JSE_PATCHED__) return
  w.__CHEAT_JSE_PATCHED__ = true

  const originalRegister = JSEvents.registerOrRemoveHandler
  JSEvents.registerOrRemoveHandler = function (h) {
    if (h?.handlerFunc && !h._wrapped) {
      const originalHandler = h.handlerFunc
      h.handlerFunc = function (e) {
        if (
          menuOpen.value &&
          !e?._isCheat &&
          (h.eventTypeString?.startsWith('key') || h.eventTypeString?.startsWith('mouse') || h.eventTypeString?.startsWith('touch'))
        ) {
          // 允许 F3 穿透
          if (e && e.key === 'F3') return originalHandler.apply(this, arguments)
          return
        }
        return originalHandler.apply(this, arguments)
      }
      h._wrapped = true
    }
    return originalRegister.apply(this, arguments)
  }

  // patch 现有 handlers
  if (JSEvents.eventHandlers) {
    JSEvents.eventHandlers.forEach(h => {
      if (h?.handlerFunc && !h._wrapped) {
        const originalHandler = h.handlerFunc
        h.handlerFunc = function (e) {
          if (
            menuOpen.value &&
            !e?._isCheat &&
            (h.eventTypeString?.startsWith('key') || h.eventTypeString?.startsWith('mouse') || h.eventTypeString?.startsWith('touch'))
          ) {
            if (e && e.key === 'F3') return originalHandler.apply(this, arguments)
            return
          }
          return originalHandler.apply(this, arguments)
        }
        h._wrapped = true
      }
    })
  }

  console.log('[CheatEngine] JSEvents patched once')
}

/**
 * ====== F3 热键 ======
 */
function onF3(e) {
  if (!game.cheats || !game.ready) return
  if (e.key !== 'F3' && e.code !== 'F3') return
  e.preventDefault()
  e.stopPropagation()
  e.stopImmediatePropagation?.()
  toggleMenu()
}

/**
 * ====== typeCheat ======
 */
async function typeCheat(code) {
  const { JSEvents, _malloc, _free, HEAPU8, HEAP32, HEAPF64, stringToUTF8, getWasmTableEntry } = getRuntime()
  console.log('Typing cheat:', code)
  updateStatus('Entering cheat...')

  if (!JSEvents?.eventHandlers) return

  const handlers = JSEvents.eventHandlers.filter(h =>
    h.eventTypeString === 'keydown' || h.eventTypeString === 'keypress' || h.eventTypeString === 'keyup'
  )

  const eventDataPtr = _malloc(160)

  try {
    for (let i = 0; i < code.length; i++) {
      const char = code[i].toUpperCase()
      const keyCode = char.charCodeAt(0)

      const fillBuffer = () => {
        for (let j = 0; j < 160; j++) HEAPU8[eventDataPtr + j] = 0
        HEAPF64[eventDataPtr >> 3] = performance.now()
        const idx = eventDataPtr >> 2
        HEAP32[idx + 5] = keyCode
        HEAP32[idx + 6] = keyCode
        HEAP32[idx + 7] = keyCode
        stringToUTF8(char, eventDataPtr + 32, 32)
        stringToUTF8('Key' + char, eventDataPtr + 64, 32)
        stringToUTF8(char, eventDataPtr + 96, 32)
      }

      fillBuffer()
      for (const h of handlers) {
        if (h.eventTypeString === 'keydown') getWasmTableEntry(h.callbackfunc)(h.eventTypeId, eventDataPtr, h.userData)
      }
      fillBuffer()
      for (const h of handlers) {
        if (h.eventTypeString === 'keypress') getWasmTableEntry(h.callbackfunc)(h.eventTypeId, eventDataPtr, h.userData)
      }
      fillBuffer()
      for (const h of handlers) {
        if (h.eventTypeString === 'keyup') getWasmTableEntry(h.callbackfunc)(h.eventTypeId, eventDataPtr, h.userData)
      }

      await new Promise(r => setTimeout(r, 5))
    }
  } finally {
    _free(eventDataPtr)
  }

  updateStatus('Cheat entered: ' + code)
}

/**
 * ====== Airbreak 地址/功能 ======
 */
function getStaticAddresses() {
  const view = getView()
  const bufLen = view.buffer.byteLength

  const { currentLanguage } = getRuntime()
  const isRu = typeof currentLanguage !== 'undefined' && currentLanguage === 'ru'
  const moneyHandleAddr = isRu ? 0x361c60 : 0x361c50

  if (moneyHandleAddr >= bufLen - 4) return null
  moneyAddr = moneyHandleAddr

  const pedPtrAddr = moneyHandleAddr - 0xA0
  if (pedPtrAddr < 0 || pedPtrAddr >= bufLen - 4) return null

  const pedAddr = view.getInt32(pedPtrAddr, true)
  if (pedAddr <= 0 || pedAddr >= bufLen - 0x400) return null

  const hpAddr = pedAddr + 0x350
  if (hpAddr < 0 || hpAddr >= bufLen - 4) return null

  return { pedAddr, healthAddr: hpAddr, moneyAddr: moneyHandleAddr }
}

function setupAirbreak() {
  const addrs = getStaticAddresses()
  if (!addrs) {
    airbreakStatus.value = 'Failed to find addresses'
    return false
  }

  healthAddr = addrs.healthAddr
  const view = getView()
  const bufLen = view.buffer.byteLength

  const HEALTH_OFFSET = 0x354
  const MATRIX_OFFSET = 0x04
  const X_IN_MATRIX = 0x34
  const HEADING_OFFSET = 0x24
  const MOVESPEED_OFFSET = 0x74

  const entityBase = healthAddr - HEALTH_OFFSET
  positionAddr = entityBase + MATRIX_OFFSET + X_IN_MATRIX
  headingAddr = healthAddr + HEADING_OFFSET
  moveSpeedAddr = entityBase + MOVESPEED_OFFSET

  console.log(`[AirBreak] Health addr: 0x${healthAddr.toString(16)}`)
  console.log(`[AirBreak] Entity base: 0x${entityBase.toString(16)}`)
  console.log(`[AirBreak] Position addr: 0x${positionAddr.toString(16)}`)
  console.log(`[AirBreak] Heading addr: 0x${headingAddr.toString(16)}`)
  console.log(`[AirBreak] MoveSpeed addr: 0x${moveSpeedAddr.toString(16)}`)

  if (positionAddr < 0 || positionAddr >= bufLen - 12 || headingAddr < 0 || headingAddr >= bufLen - 4) {
    airbreakStatus.value = 'Address out of range'
    return false
  }

  const x = view.getFloat32(positionAddr, true)
  const y = view.getFloat32(positionAddr + 4, true)
  const z = view.getFloat32(positionAddr + 8, true)
  const heading = view.getFloat32(headingAddr, true)
  const health = view.getFloat32(healthAddr, true)

  lockedZ = z
  lockedHealth = health

  const suspicious =
    !Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z) ||
    Math.abs(x) > 5000 || Math.abs(y) > 5000 || z < -50 || z > 1000

  airbreakConfigured = true
  playerMatrixAddr = positionAddr

  if (suspicious) {
    airbreakStatus.value = `Suspicious pos: ${x.toFixed(0)},${y.toFixed(0)},${z.toFixed(0)} - try anyway? [RShift]`
  } else {
    airbreakStatus.value = `Ready! [RShift to fly] H:${(heading * 180 / Math.PI).toFixed(0)}°`
  }

  updatePositionDisplay()
  return true
}

function toggleGodModeFromUI(checked) {
  godModeEnabled = !!checked

  const addrs = getStaticAddresses()
  if (!addrs) {
    airbreakStatus.value = 'Failed to find HP address'
    godModeEnabled = false
    return
  }

  if (!godModeEnabled) {
    const view = getView()
    try { view.setFloat32(addrs.healthAddr, 100.0, true) } catch {}
  }

  airbreakStatus.value = godModeEnabled ? 'GodMode ON - Infinite HP' : 'GodMode OFF (HP reset to 100)'
}

function godModeTick() {
  if (!godModeEnabled) return
  const addrs = getStaticAddresses()
  if (!addrs) return
  const view = getView()
  try { view.setFloat32(addrs.healthAddr, 999.0, true) } catch {}
}

function addMoney() {
  const addrs = getStaticAddresses()
  if (!addrs) {
    airbreakStatus.value = 'Failed to find money address'
    return
  }
  const view = getView()
  try {
    const currentMoney = view.getInt32(addrs.moneyAddr, true)
    view.setInt32(addrs.moneyAddr, currentMoney + 9999999, true)
    airbreakStatus.value = '+$9999999 added!'
  } catch {
    airbreakStatus.value = 'Failed to add money'
  }
}

function toggleAirBrakeFromUI(checked) {
  airbreakShiftAllowed = !!checked

  if (!airbreakShiftAllowed && airbreakEnabled) {
    airbreakEnabled = false
    airbreakStatus.value = 'AirBreak disabled'
    return
  }

  if (airbreakShiftAllowed) {
    if (!airbreakConfigured) setupAirbreak()
    airbreakStatus.value = 'AirBreak enabled (RShift to fly)'
  } else {
    airbreakStatus.value = 'AirBreak disabled'
  }
}

function toggleFlying() {
  if (!airbreakShiftAllowed) return false
  if (!airbreakConfigured) {
    if (!setupAirbreak()) return false
  }
  airbreakEnabled = !airbreakEnabled

  if (airbreakEnabled) {
    const view = getView()
    lockedZ = view.getFloat32(positionAddr + 8, true)
    lockedHealth = view.getFloat32(healthAddr, true)
  }

  airbreakStatus.value = airbreakEnabled ? `FLYING! Z=${lockedZ.toFixed(1)}` : 'AirBreak enabled (RShift to fly)'
  return true
}

function updatePositionDisplay() {
  if (!airbreakConfigured || positionAddr === 0) return
  const view = getView()
  const bufLen = view.buffer.byteLength
  if (positionAddr < 0 || positionAddr >= bufLen - 12) return

  try {
    const x = view.getFloat32(positionAddr, true)
    const y = view.getFloat32(positionAddr + 4, true)
    const z = view.getFloat32(positionAddr + 8, true)
    const heading = view.getFloat32(headingAddr, true)
    const hp = view.getFloat32(healthAddr, true)

    posDisplay.value =
      `X:${x.toFixed(1)} Y:${y.toFixed(1)} Z:${z.toFixed(1)} H:${(heading * 180 / Math.PI).toFixed(0)}° HP:${hp.toFixed(0)}` +
      (airbreakEnabled ? ' [FLY]' : '')
  } catch {}
}

function airbreakTick() {
  if (!airbreakEnabled || !airbreakConfigured || positionAddr === 0) return
  const view = getView()
  const bufLen = view.buffer.byteLength
  if (positionAddr < 0 || positionAddr >= bufLen - 12) return

  try {
    let x = view.getFloat32(positionAddr, true)
    let y = view.getFloat32(positionAddr + 4, true)

    const headingRaw = view.getFloat32(headingAddr, true)
    const heading = -headingRaw

    const speed = parseFloat(String(flySpeed.value)) || 2.0
    const sinH = Math.sin(heading)
    const cosH = Math.cos(heading)

    if (keysPressed.w) { x += sinH * speed; y += cosH * speed }
    if (keysPressed.s) { x -= sinH * speed; y -= cosH * speed }
    if (keysPressed.a) { x -= cosH * speed; y += sinH * speed }
    if (keysPressed.d) { x += cosH * speed; y -= sinH * speed }

    if (keysPressed.space) lockedZ += speed
    if (keysPressed.shift) lockedZ -= speed

    const z = lockedZ

    view.setFloat32(positionAddr, x, true)
    view.setFloat32(positionAddr + 4, y, true)
    view.setFloat32(positionAddr + 8, z, true)

    view.setFloat32(healthAddr, lockedHealth, true)

    view.setFloat32(moveSpeedAddr, 0, true)
    view.setFloat32(moveSpeedAddr + 4, 0, true)
    view.setFloat32(moveSpeedAddr + 8, 0, true)

    updatePositionDisplay()
  } catch (e) {
    console.warn('[AirBreak] Tick error:', e)
  }
}

/**
 * ====== 键盘按键追踪 ======
 */
function onKeyDown(e) {
  // RShift toggle flying
  if (e.key === 'ShiftRight' || (e.key === 'Shift' && e.location === 2)) {
    if (!airbreakShiftAllowed) return
    toggleFlying()
    return
  }
  if (!airbreakEnabled) return
  const code = e.code
  if (code === 'KeyW') keysPressed.w = true
  if (code === 'KeyS') keysPressed.s = true
  if (code === 'KeyA') keysPressed.a = true
  if (code === 'KeyD') keysPressed.d = true
  if (code === 'Space') keysPressed.space = true
  if (code === 'ShiftLeft') keysPressed.shift = true
}

function onKeyUp(e) {
  const code = e.code
  if (code === 'KeyW') keysPressed.w = false
  if (code === 'KeyS') keysPressed.s = false
  if (code === 'KeyA') keysPressed.a = false
  if (code === 'KeyD') keysPressed.d = false
  if (code === 'Space') keysPressed.space = false
  if (code === 'ShiftLeft') keysPressed.shift = false
}

/**
 * ====== Touch 控件（摇杆 + 上下按钮 + fly toggle 拖拽） ======
 */
const joystick = reactive({
  active: false,
  centerX: 0,
  centerY: 0,
  dx: 0,
  dy: 0,
  radius: 60,
  deadzone: 15,
})

const showTouchControls = computed(() => {
  if (!isTouch) return false
  if (menuOpen.value) return false
  if (airbreakConfigured && airbreakEnabled && airbreakShiftAllowed) return true
  return false
})

const showFlyBtn = computed(() => {
  if (!isTouch) return false
  if (menuOpen.value) return false
  if (airbreakConfigured && airbreakShiftAllowed) return true
  return false
})

function handleJoystickTouchStart(e) {
  e.preventDefault()
  e.stopPropagation()
  const t = e.touches[0]
  joystick.active = true
  const rect = e.currentTarget.getBoundingClientRect()
  joystick.centerX = rect.left + rect.width / 2
  joystick.centerY = rect.top + rect.height / 2
  handleJoystickMove(t)
}

function handleJoystickTouchMove(e) {
  e.preventDefault()
  e.stopPropagation()
  if (!joystick.active) return
  handleJoystickMove(e.touches[0])
}

function handleJoystickTouchEnd(e) {
  e.preventDefault()
  joystick.active = false
  joystick.dx = 0
  joystick.dy = 0
  keysPressed.w = keysPressed.s = keysPressed.a = keysPressed.d = false
}

function handleJoystickMove(touch) {
  let dx = touch.clientX - joystick.centerX
  let dy = touch.clientY - joystick.centerY

  const dist = Math.sqrt(dx * dx + dy * dy)
  if (dist > joystick.radius) {
    dx = (dx / dist) * joystick.radius
    dy = (dy / dist) * joystick.radius
  }

  joystick.dx = dx
  joystick.dy = dy

  keysPressed.w = dy < -joystick.deadzone
  keysPressed.s = dy > joystick.deadzone
  keysPressed.a = dx < -joystick.deadzone
  keysPressed.d = dx > joystick.deadzone
}

function touchUpStart(e) { e.preventDefault(); e.stopPropagation(); keysPressed.space = true }
function touchUpEnd(e) { e.preventDefault(); keysPressed.space = false }
function touchDownStart(e) { e.preventDefault(); e.stopPropagation(); keysPressed.shift = true }
function touchDownEnd(e) { e.preventDefault(); keysPressed.shift = false }

/**
 * fly toggle btn drag
 */
const dragThreshold = 10
let flyDragging = false
let flyStartX = 0
let flyStartY = 0
let flyInitRight = 0
let flyInitBottom = 0

function flyTouchStart(e) {
  e.preventDefault()
  e.stopPropagation()
  flyDragging = false
  const t = e.touches[0]
  flyStartX = t.clientX
  flyStartY = t.clientY
  const rect = e.currentTarget.getBoundingClientRect()
  flyInitRight = window.innerWidth - rect.right
  flyInitBottom = window.innerHeight - rect.bottom
}

function flyTouchMove(e) {
  e.preventDefault()
  e.stopPropagation()
  const t = e.touches[0]
  const dx = t.clientX - flyStartX
  const dy = t.clientY - flyStartY
  if (Math.abs(dx) > dragThreshold || Math.abs(dy) > dragThreshold) flyDragging = true
  if (!flyDragging) return

  let newRight = flyInitRight - dx
  let newBottom = flyInitBottom - dy
  newRight = Math.max(0, Math.min(window.innerWidth - 80, newRight))
  newBottom = Math.max(0, Math.min(window.innerHeight - 40, newBottom))

  flyPos.right = newRight
  flyPos.bottom = newBottom
}

function flyTouchEnd(e) {
  e.preventDefault()
  e.stopPropagation()

  if (flyDragging) {
    localStorage.setItem('cheat-fly-pos', JSON.stringify({ right: flyPos.right, bottom: flyPos.bottom }))
  } else {
    if (airbreakConfigured) {
      airbreakEnabled = !airbreakEnabled
      if (airbreakEnabled) {
        const view = getView()
        lockedZ = view.getFloat32(positionAddr + 8, true)
        lockedHealth = view.getFloat32(healthAddr, true)
      }
      airbreakStatus.value = airbreakEnabled ? `FLYING! Z=${lockedZ.toFixed(1)} HP=${lockedHealth.toFixed(0)}` : `Ready! [Tap FLY]`
    }
  }

  flyDragging = false
}

/**
 * ====== toggle button (touch) =====
 */
let toggleDragging = false
let toggleStartX = 0
let toggleStartY = 0
let toggleInitLeft = 0
let toggleInitTop = 0

function loadSavedPositions() {
  const savedPos = localStorage.getItem('cheat-toggle-pos')
  if (savedPos) {
    try {
      const pos = JSON.parse(savedPos)
      togglePos.left = pos.left
      togglePos.top = pos.top
    } catch {}
  }
  const savedFlyPos = localStorage.getItem('cheat-fly-pos')
  if (savedFlyPos) {
    try {
      const pos = JSON.parse(savedFlyPos)
      flyPos.right = pos.right ?? flyPos.right
      flyPos.bottom = pos.bottom ?? flyPos.bottom
    } catch {}
  }
}

function toggleBtnClick(e) {
  e.preventDefault()
  e.stopPropagation()
  if (!toggleDragging) toggleMenu()
}

function toggleTouchStart(e) {
  e.preventDefault()
  e.stopPropagation()
  toggleDragging = false
  const t = e.touches[0]
  toggleStartX = t.clientX
  toggleStartY = t.clientY

  // 当前按钮位置
  const rect = e.currentTarget.getBoundingClientRect()
  toggleInitLeft = rect.left
  toggleInitTop = rect.top
}

function toggleTouchMove(e) {
  e.preventDefault()
  e.stopPropagation()
  const t = e.touches[0]
  const dx = t.clientX - toggleStartX
  const dy = t.clientY - toggleStartY
  if (Math.abs(dx) > dragThreshold || Math.abs(dy) > dragThreshold) toggleDragging = true
  if (!toggleDragging) return

  let newLeft = toggleInitLeft + dx
  let newTop = toggleInitTop + dy
  newLeft = Math.max(0, Math.min(window.innerWidth - 50, newLeft))
  newTop = Math.max(0, Math.min(window.innerHeight - 50, newTop))

  togglePos.left = newLeft
  togglePos.top = newTop
}

function toggleTouchEnd(e) {
  e.preventDefault()
  e.stopPropagation()

  if (toggleDragging) {
    localStorage.setItem('cheat-toggle-pos', JSON.stringify({ left: togglePos.left, top: togglePos.top }))
  } else {
    toggleMenu()
  }
  toggleDragging = false
}

/**
 * ====== 定时器 ======
 */
let tAir = null
let tGod = null
let tPos = null

onMounted(() => {
  loadSavedPositions()

  // 只在 cheats + ready 后再 patch（避免你启动前页面也 patch）
  const stop = watch(
    () => game.ready,
    (r) => {
      if (r && game.cheats) {
        patchJSEventsOnce()
      }
    },
    { immediate: true }
  )

  // F3 热键
  window.addEventListener('keydown', onF3, { capture: true })

  // movement keys
  window.addEventListener('keydown', onKeyDown, true)
  window.addEventListener('keyup', onKeyUp, true)

  // tick loops（原脚本 setInterval）
  tAir = setInterval(airbreakTick, 16)
  tGod = setInterval(godModeTick, 100)
  tPos = setInterval(updatePositionDisplay, 100)

  onBeforeUnmount(() => stop())
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onF3, { capture: true })
  window.removeEventListener('keydown', onKeyDown, true)
  window.removeEventListener('keyup', onKeyUp, true)

  if (tAir) clearInterval(tAir)
  if (tGod) clearInterval(tGod)
  if (tPos) clearInterval(tPos)
})

/**
 * ====== UI checkbox 绑定 ======
 */
const airbreakChecked = computed({
  get: () => airbreakShiftAllowed,
  set: (v) => toggleAirBrakeFromUI(v),
})

const godmodeChecked = computed({
  get: () => godModeEnabled,
  set: (v) => toggleGodModeFromUI(v),
})

/**
 * ====== fly btn 文案 ======
 */
const flyBtnText = computed(() => (airbreakEnabled ? 'STOP' : 'FLY'))
</script>

<template>
  <div v-if="game.cheats && game.ready">
    <!-- Touch toggle button -->
    <div
      id="cheat-toggle-btn"
      v-show="isTouch"
      :class="{ active: menuOpen }"
      :style="togglePos.left != null ? { right: 'auto', left: togglePos.left + 'px', top: togglePos.top + 'px' } : {}"
      :title="game.t('CheatMenu.OpenTitle')"
      @click="toggleBtnClick"
      @touchstart.passive="() => {}"
      @touchstart="toggleTouchStart"
      @touchmove="toggleTouchMove"
      @touchend="toggleTouchEnd"
    >
      ⚙
    </div>

    <!-- Airbreak touch controls -->
    <div id="airbreak-touch-controls" :class="{ active: showTouchControls }">
      <div
        class="airbreak-joystick"
        id="airbreak-joystick"
        @touchstart="handleJoystickTouchStart"
        @touchmove="handleJoystickTouchMove"
        @touchend="handleJoystickTouchEnd"
        @touchcancel="handleJoystickTouchEnd"
      >
        <div
          class="airbreak-joystick-knob"
          id="airbreak-joystick-knob"
          :style="{
            transform: `translate(calc(-50% + ${joystick.dx}px), calc(-50% + ${joystick.dy}px))`
          }"
        />
      </div>
    </div>

    <div class="airbreak-vertical-btns" id="airbreak-vertical-btns" :style="{ display: showTouchControls ? 'flex' : 'none' }">
      <div class="airbreak-v-btn" id="airbreak-up-btn"
           @touchstart="touchUpStart" @touchend="touchUpEnd" @touchcancel="touchUpEnd">↑</div>
      <div class="airbreak-v-btn" id="airbreak-down-btn"
           @touchstart="touchDownStart" @touchend="touchDownEnd" @touchcancel="touchDownEnd">↓</div>
    </div>

    <div
      id="airbreak-toggle-fly"
      :class="[{ visible: showFlyBtn }, { active: airbreakEnabled }]"
      v-show="showFlyBtn"
      :style="{ right: flyPos.right + 'px', bottom: flyPos.bottom + 'px' }"
      @touchstart="flyTouchStart"
      @touchmove="flyTouchMove"
      @touchend="flyTouchEnd"
    >
      {{ flyBtnText }}
    </div>

    <!-- 主 UI（原 #cheat-engine-ui） -->
    <div id="cheat-engine-ui" v-show="menuOpen">
      <div id="cheat-close-btn" @click="toggleMenu">✕</div>
      <h1>{{ game.t('CheatMenu.Title') }}</h1>

      <!-- 扫描器 -->
      <div class="ce-section">
        <div class="ce-label">{{ game.t('CheatMenu.Scanner.Title') }}</div>

        <div style="display:flex; gap:4px;">
          <input
            v-model="scan.value"
            type="text"
            id="ce-value"
            :placeholder="game.t('CheatMenu.Scanner.ValuePlaceholder')"
            style="flex:1;"
          />
          <select v-model="scan.type" id="ce-type">
            <option value="any">{{ game.t('CheatMenu.Scanner.Type.Any') }}</option>
            <option value="i32">{{ game.t('CheatMenu.Scanner.Type.I32') }}</option>
            <option value="f32">{{ game.t('CheatMenu.Scanner.Type.F32') }}</option>
            <option value="i16">{{ game.t('CheatMenu.Scanner.Type.I16') }}</option>
            <option value="i8">{{ game.t('CheatMenu.Scanner.Type.I8') }}</option>
          </select>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:4px;">
          <button id="ce-search" @click="firstSearch">{{ game.t('CheatMenu.Scanner.NewScan') }}</button>
          <button id="ce-next" @click="nextSearch">{{ game.t('CheatMenu.Scanner.NextScan') }}</button>
          <button id="ce-reset" @click="resetScan">{{ game.t('CheatMenu.Scanner.Reset') }}</button>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap:4px;">
          <button id="ce-snap" @click="snapshotValues" :title="game.t('CheatMenu.Scanner.SnapshotTip')">
            {{ game.t('CheatMenu.Scanner.Snapshot') }}
          </button>
          <button id="ce-inc" @click="filterResults('inc')" :title="game.t('CheatMenu.Scanner.IncTip')">
            {{ game.t('CheatMenu.Scanner.Inc') }}
          </button>
          <button id="ce-dec" @click="filterResults('dec')" :title="game.t('CheatMenu.Scanner.DecTip')">
            {{ game.t('CheatMenu.Scanner.Dec') }}
          </button>
          <button id="ce-changed" @click="filterResults('changed')" :title="game.t('CheatMenu.Scanner.ChangedTip')">
            {{ game.t('CheatMenu.Scanner.Changed') }}
          </button>
        </div>

        <div id="ce-status" style="font-size:10px; color:#888;">{{ statusText }}</div>

        <div class="results" id="ce-results">
          <div
            v-for="r in resultsView"
            :key="r.addr + '-' + r.type"
            style="display:flex; justify-content:space-between; margin-bottom:2px; border-bottom:1px solid #333;"
          >
            <span style="color:#ff00ff;">0x{{ r.addr.toString(16) }}</span>
            <span style="color:#0ff;">{{ r.currentVal }}</span>
            <button class="cheat-btn" @click="editAddr(r.addr, r.type)">
              {{ game.t('CheatMenu.Common.Edit') }}
            </button>
          </div>
        </div>
      </div>

      <!-- 手动操作 -->
      <div class="ce-section">
        <div class="ce-label">{{ game.t('CheatMenu.Manual.Title') }}</div>
        <div style="display:flex; gap:4px;">
          <input
            v-model="manual.addrHex"
            type="text"
            id="ce-manual-addr"
            :placeholder="game.t('CheatMenu.Manual.AddressPlaceholder')"
            style="flex:1;"
          />
          <button id="ce-view-addr" @click="viewManualAddr">{{ game.t('CheatMenu.Manual.View') }}</button>
        </div>

        <div v-show="manual.visible" id="ce-manual-results" style="font-size:10px;">
          <div
            v-for="row in manual.rows"
            :key="row.type"
            style="display:flex; justify-content:space-between; margin-bottom:2px;"
          >
            <span style="color:#0ff;">{{ row.type.toUpperCase() }}:</span>
            <span>{{ row.val }}</span>
            <button class="cheat-btn" @click="editManual(row)">
              {{ game.t('CheatMenu.Common.Edit') }}
            </button>
          </div>
        </div>
      </div>

      <!-- 快速操作 -->
      <div class="ce-section">
        <div class="ce-label">{{ game.t('CheatMenu.Quick.Title') }}</div>

        <div class="switch-container">
          <span class="switch-label">{{ game.t('CheatMenu.Quick.Airbreak') }}</span>
          <label class="switch">
            <input type="checkbox" v-model="airbreakChecked" />
            <span class="slider"></span>
          </label>
        </div>

        <div class="switch-container">
          <span class="switch-label">{{ game.t('CheatMenu.Quick.GodMode') }}</span>
          <label class="switch">
            <input type="checkbox" v-model="godmodeChecked" />
            <span class="slider"></span>
          </label>
        </div>

        <button id="ce-add-money" class="money-btn" @click="addMoney">
          {{ game.t('CheatMenu.Quick.AddMoney') }}
        </button>

        <div style="display:flex; gap:4px; margin-top:4px; align-items:center;">
          <span style="font-size:10px; color:#888;">{{ game.t('CheatMenu.Quick.FlySpeed') }}</span>
          <input
            v-model.number="flySpeed"
            type="number"
            id="ce-fly-speed"
            step="0.5"
            min="0.1"
            max="50"
            style="width:60px;"
          />
        </div>

        <div id="ce-airbreak-status" style="font-size:10px; color:#888;">{{ airbreakStatus }}</div>
        <div id="ce-pos-display" style="font-size:9px; color:#666;">{{ posDisplay }}</div>
      </div>

      <!-- 作弊码 -->
      <div class="ce-section">
        <div class="ce-label">{{ game.t('CheatMenu.Cheats.Title') }}</div>

        <template v-for="g in cheatGroups" :key="g.key">
          <div class="cheat-cat">{{ game.t(g.titleKey) }}</div>
          <div class="cheat-grid">
            <button
              v-for="it in g.items"
              :key="it.code"
              class="cheat-btn"
              @click="typeCheat(it.code)"
            >
              {{ game.t(it.labelKey) }}
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>


<style scoped>
#cheat-engine-ui {
  position: fixed;
  top: 0;
  right: 0;
  width: v-bind(isTouch ? '100vw' : '340px');
  height: 100vh;
  background: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(15px);
  color: #eee;
  font-family: 'Consolas', 'Monaco', monospace;
  padding: v-bind(isTouch ? '15px 15px 150px 15px' : '20px 20px 100px 20px');
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: v-bind(isTouch ? '12px' : '15px');
  overflow-y: auto;
  user-select: none;
  border-left: v-bind(isTouch ? 'none' : '2px solid #ff00ff');
  box-shadow: -10px 0 30px rgba(0,0,0,0.8);
  box-sizing: border-box;
}

/* Touch toggle button */
#cheat-toggle-btn {
  display: flex;
  position: fixed;
  top: 10px;
  right: 10px;
  width: 50px;
  height: 50px;
  background: rgba(255, 0, 255, 0.3);
  border: 2px solid #ff00ff;
  border-radius: 50%;
  color: #ff00ff;
  font-size: 20px;
  font-weight: bold;
  z-index: 9999;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(5px);
  touch-action: manipulation;
}
#cheat-toggle-btn:active { background: rgba(255, 0, 255, 0.6); transform: scale(0.95); }
#cheat-toggle-btn.active { background: rgba(255, 0, 255, 0.6); }

/* Airbreak touch controls */
#airbreak-touch-controls {
  display: none;
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 10001;
  touch-action: none;
}
#airbreak-touch-controls.active { display: block; }
.airbreak-joystick {
  width: 120px;
  height: 120px;
  background: rgba(0, 255, 255, 0.2);
  border: 2px solid #0ff;
  border-radius: 50%;
  position: relative;
  touch-action: none;
}
.airbreak-joystick-knob {
  width: 50px;
  height: 50px;
  background: rgba(0, 255, 255, 0.6);
  border: 2px solid #0ff;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}
.airbreak-vertical-btns {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 10001;
}
.airbreak-v-btn {
  width: 60px;
  height: 60px;
  background: rgba(0, 255, 255, 0.2);
  border: 2px solid #0ff;
  border-radius: 10px;
  color: #0ff;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  touch-action: manipulation;
}
.airbreak-v-btn:active { background: rgba(0, 255, 255, 0.5); }

#airbreak-toggle-fly {
  position: fixed;
  width: 80px;
  height: 40px;
  background: rgba(255, 255, 0, 0.2);
  border: 2px solid #ff0;
  border-radius: 10px;
  color: #ff0;
  font-size: 12px;
  font-weight: bold;
  z-index: 10001;
  display: flex;
  align-items: center;
  justify-content: center;
  touch-action: manipulation;
}
#airbreak-toggle-fly.active { background: rgba(255, 255, 0, 0.5); }

#cheat-engine-ui h1 {
  font-size: 18px;
  text-align: left;
  margin: 0 0 10px 0;
  color: #ff00ff;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 1px solid #333;
  padding-bottom: 10px;
}
.ce-section { display: flex; flex-direction: column; gap: 8px; }
.ce-label { font-size: 10px; color: #888; text-transform: uppercase; }

#cheat-engine-ui input, #cheat-engine-ui select, #cheat-engine-ui button {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  border: 1px solid #333;
  padding: 6px 10px;
  font-size: 12px;
  outline: none;
}
#cheat-engine-ui input:focus { border-color: #ff00ff; }

#cheat-engine-ui button {
  cursor: pointer;
  transition: all 0.1s;
  text-transform: uppercase;
  font-size: v-bind(isTouch ? '12px' : '10px');
  min-height: v-bind(isTouch ? '44px' : 'auto');
  touch-action: manipulation;
}
#cheat-engine-ui button:hover, #cheat-engine-ui button:active {
  background: #ff00ff;
  color: #000;
  border-color: #ff00ff;
}

#cheat-engine-ui .results {
  max-height: v-bind(isTouch ? '150px' : '120px');
  overflow-y: auto;
  background: rgba(0,0,0,0.3);
  border: 1px solid #222;
}

.cheat-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: v-bind(isTouch ? '8px' : '4px');
}
.cheat-cat {
  font-size: v-bind(isTouch ? '13px' : '11px');
  color: #0ff;
  margin-top: v-bind(isTouch ? '15px' : '10px');
  text-transform: uppercase;
}
.cheat-btn {
  background: transparent !important;
  border: 1px solid #444 !important;
  text-align: left;
  padding: v-bind(isTouch ? '12px 10px' : '6px 10px');
}
.cheat-btn:hover, .cheat-btn:active {
  border-color: #0ff !important;
  color: #0ff !important;
  background: rgba(0, 255, 255, 0.1) !important;
}

/* Close button for touch */
#cheat-close-btn {
  display: v-bind(isTouch ? 'flex' : 'none');
  position: absolute;
  top: 15px;
  right: 15px;
  width: 40px;
  height: 40px;
  background: rgba(255, 0, 0, 0.3);
  border: 2px solid #f00;
  border-radius: 50%;
  color: #f00;
  font-size: 20px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  touch-action: manipulation;
}
#cheat-close-btn:active { background: rgba(255, 0, 0, 0.6); }

.switch-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.05);
  padding: 8px 10px;
  border: 1px solid #333;
  margin-bottom: 4px;
}
.switch-label {
  font-size: 12px;
  color: #fff;
  text-transform: uppercase;
}
.switch { position: relative; display: inline-block; width: 34px; height: 18px; }
.switch input { opacity: 0; width: 0; height: 0; }
.slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #333;
  transition: .4s;
  border-radius: 18px;
}
.slider:before {
  position: absolute;
  content: "";
  height: 12px; width: 12px;
  left: 3px; bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}
input:checked + .slider { background-color: #ff00ff; }
input:checked + .slider:before { transform: translateX(16px); }

.money-btn {
  width: 100%;
  background: rgba(255, 215, 0, 0.1) !important;
  border: 1px solid #ffd700 !important;
  color: #ffd700 !important;
  font-weight: bold;
  margin-top: 4px;
}
.money-btn:active { background: rgba(255, 215, 0, 0.3) !important; }
</style>
