const DB_NAME = '/vc-assets/local/userfiles'
const STORE = 'FILE_DATA'
const BASE = '/vc-assets/local/userfiles/'

/**
 * 打开 IndexedDB
 */
export function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 21)
    req.onupgradeneeded = e => {
      const db = e.target.result
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE)
      }
    }
    req.onerror = () => reject(req.error)
    req.onsuccess = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) {
        reject(new Error(`IndexedDB 缺少 objectStore: ${STORE}`))
        return
      }
      resolve(db)
    }
  })
}

/**
 * 读取全部存档 Map：key -> record
 */
export async function readAllMap() {
  const db = await openDB()
  const tx = db.transaction(STORE, 'readonly')
  const store = tx.objectStore(STORE)

  const map = {}
  const req = store.openCursor()
  return new Promise((resolve, reject) => {
    req.onsuccess = e => {
      const cursor = e.target.result
      if (cursor) {
        map[cursor.key] = cursor.value
        cursor.continue()
      } else {
        resolve(map)
      }
    }
    req.onerror = e => reject(e.target.error)
  })
}

/**
 * 获取存档数量
 */
export async function getSaveCount() {
  const map = await readAllMap()
  return Object.keys(map).length
}

/**
 * 写入存档
 * @param slot 槽位 1-8
 * @param buffer ArrayBuffer
 */
export async function writeSave(slot, buffer) {
  const db = await openDB()
  const tx = db.transaction(STORE, 'readwrite')
  const store = tx.objectStore(STORE)
  const path = `${BASE}GTAVCsf${slot}.b`
  const record = { contents: new Uint8Array(buffer), mode: 33206, timestamp: new Date() }
  return new Promise((resolve, reject) => {
    const req = store.put(record, path)
    req.onsuccess = () => {
      localStorage.removeItem('vcsky.saves')
      resolve()
    }
    req.onerror = e => reject(e)
  })
}

/**
 * 删除存档
 * @param slot 槽位 1-8
 */
export async function deleteSave(slot) {
  const db = await openDB()
  const tx = db.transaction(STORE, 'readwrite')
  const store = tx.objectStore(STORE)
  return new Promise((resolve, reject) => {
    const req = store.delete(`${BASE}GTAVCsf${slot}.b`)
    req.onsuccess = () => {
      localStorage.removeItem('vcsky.saves')
      resolve()
    }
    req.onerror = e => reject(e.target.error)
  })
}

/**
 * 获取指定槽位存档
 * @param slot 槽位 1-8
 */
export async function getSave(slot) {
  const map = await readAllMap()
  const key = `${BASE}GTAVCsf${slot}.b`
  return map[key] || null
}

/**
 * 获取全部槽位状态数组，便于显示
 * @param count 默认 8 个槽位
 */
export async function getSlots(count = 8) {
  const map = await readAllMap()
  return Array.from({ length: count }, (_, i) => {
    const index = i + 1
    const key = `${BASE}GTAVCsf${index}.b`
    const save = map[key]
    return {
      index,
      exists: !!save,
      size: save ? save.contents.length : 0,
      loading: false
    }
  })
}
