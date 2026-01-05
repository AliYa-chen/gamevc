const DB_NAME = '/vc-assets/local/userfiles'
const STORE = 'FILE_DATA'
const BASE = '/vc-assets/local/userfiles/'

// 你之前报过 existing version = 22，所以优先用 22
const TRY_VERSIONS = 21

// --- helpers ---
function openDBWithVersion(version) {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, version)

    req.onupgradeneeded = e => {
      const db = e.target.result

      // ✅ 跟游戏一致：无 keyPath（out-of-line key）
      let store
      if (!db.objectStoreNames.contains(STORE)) {
        store = db.createObjectStore(STORE)
      } else {
        store = e.target.transaction.objectStore(STORE)
      }

      // ✅ 跟游戏一致：timestamp 索引
      if (!store.indexNames.contains('timestamp')) {
        store.createIndex('timestamp', 'timestamp', { unique: false })
      }
    }

    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export async function openDB() {
  const db = await openDBWithVersion(TRY_VERSIONS)
  // 如果 store 不存在，说明你的 upgrade 没跑到或被阻止
  if (!db.objectStoreNames.contains(STORE)) {
    db.close()
    throw new Error(`IndexedDB 缺少 objectStore: ${STORE}`)
  }
  return db
}

export async function readAllMap() {
  const db = await openDB()
  const tx = db.transaction(STORE, 'readonly')
  const store = tx.objectStore(STORE)

  const map = {}
  return new Promise((resolve, reject) => {
    const req = store.openCursor()
    req.onsuccess = e => {
      const cursor = e.target.result
      if (cursor) {
        // ✅ out-of-line key：cursor.key 是 path 字符串
        map[cursor.key] = cursor.value
        cursor.continue()
      } else {
        db.close()
        resolve(map)
      }
    }
    req.onerror = e => {
      db.close()
      reject(e.target.error)
    }
  })
}

export async function getSaveCount() {
  const map = await readAllMap()
  return Object.keys(map).length
}

export async function getSave(slot) {
  const db = await openDB()
  const tx = db.transaction(STORE, 'readonly')
  const store = tx.objectStore(STORE)
  const path = `${BASE}GTAVCsf${slot}.b`

  return new Promise((resolve, reject) => {
    const req = store.get(path) // ✅ key 就是 path
    req.onsuccess = () => {
      db.close()
      resolve(req.result || null)
    }
    req.onerror = e => {
      db.close()
      reject(e.target.error)
    }
  })
}

export async function writeSave(slot, buffer) {
  const db = await openDB()
  const tx = db.transaction(STORE, 'readwrite')
  const store = tx.objectStore(STORE)

  const path = `${BASE}GTAVCsf${slot}.b`

  // ✅ 必须 Date，否则游戏那边 reconcile 会 getTime() 报错
  const record = {
    contents: new Uint8Array(buffer),
    mode: 33206,
    timestamp: new Date()
  }

  return new Promise((resolve, reject) => {
    const req = store.put(record, path) // ✅ out-of-line key：这里必须传 key
    req.onsuccess = () => {
      db.close()
      localStorage.removeItem('vcsky.saves')
      resolve()
    }
    req.onerror = e => {
      db.close()
      reject(e.target?.error || e)
    }
  })
}

export async function deleteSave(slot) {
  const db = await openDB()
  const tx = db.transaction(STORE, 'readwrite')
  const store = tx.objectStore(STORE)
  const path = `${BASE}GTAVCsf${slot}.b`

  return new Promise((resolve, reject) => {
    const req = store.delete(path)
    req.onsuccess = () => {
      db.close()
      localStorage.removeItem('vcsky.saves')
      resolve()
    }
    req.onerror = e => {
      db.close()
      reject(e.target.error)
    }
  })
}

export async function getSlots(count = 8) {
  const map = await readAllMap()
  return Array.from({ length: count }, (_, i) => {
    const index = i + 1
    const key = `${BASE}GTAVCsf${index}.b`
    const save = map[key]
    return {
      index,
      exists: !!save,
      size: save?.contents?.length ? save.contents.length : 0,
      loading: false
    }
  })
}


export function deleteWholeSavesDB() {
  return new Promise((resolve, reject) => {
    // 关闭可能被你自己打开的连接：你现在每次都会 db.close()，所以一般不需要额外处理

    const req = indexedDB.deleteDatabase(DB_NAME)

    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error)
    req.onblocked = () => {
      // 说明还有页面/iframe/worker 持有这个 DB 的连接
      reject(new Error('删除被阻止：请关闭其他打开该游戏/存档页面的标签页后重试'))
    }
  })
}
