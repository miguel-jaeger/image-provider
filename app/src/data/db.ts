import initSqlJs from 'sql.js'
import type { Database } from 'sql.js'
import type { Image } from '../types/image'

const DB_KEY = 'image-provider-sqlite'
const CLOUD_NAME = 'dhecags26'
const CLOUDINARY_API_KEY = '613315545548173'
const CLOUDINARY_API_SECRET = 'L6hYcoM7haBVYgS4BAgEMAtyCVo'

let dbInstance: Database | null = null

async function sha1Hex(str: string): Promise<string> {
  const buffer = new TextEncoder().encode(str)
  const hash = await crypto.subtle.digest('SHA-1', buffer)
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
}


function createTable(db: Database) {
  db.run(`CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    url TEXT NOT NULL,
    cdnLink TEXT NOT NULL,
    publicId TEXT NOT NULL DEFAULT '',
    createdAt TEXT NOT NULL
  )`)
}

function migrateTable(db: Database) {
  try {
    const cols = db.exec("PRAGMA table_info(images)")
    if (cols.length > 0) {
      const columnNames = cols[0].values.map((r) => r[1])
      if (!columnNames.includes('publicId')) {
        db.run("ALTER TABLE images ADD COLUMN publicId TEXT NOT NULL DEFAULT ''")
      }
    }
  } catch {
    db.run("DROP TABLE IF EXISTS images")
    createTable(db)
  }
}


function saveToStorage(db: Database) {
  const data = db.export()
  localStorage.setItem(DB_KEY, JSON.stringify(Array.from(data)))
}

const SEED_DATA: Omit<Image, 'id'>[] = [
  {
    title: 'Harbor Horizon',
    description: 'Ultra-modern minimalist office space featuring sustainable materials and ergonomic design elements for creative teams.',
    category: 'Architecture',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvQD9VVrvBf9zhmuva2VpTe4BMK1JVcL8WO1XKSBBNhU6XM8eYDQLSthoP0D5jLTByn5x9w9UgFx-60kyArV1So6ULKFs8z1pTADn8WeJMMFwnqqflXXrUpXrZoT2tsryAw_KjPHvbWkfo_MOHzMtfjD3AkYmmf_xscgLC5ZjsvJJpA5ea70B8kCvAPXfP0tGBG-mIs5lItDpW6xDqHLRCaemagPbZOR6yTFoiCkqomaV1hHcEAcTn_MDAK0I_ZKOVk4ppv4vnF_bi',
    cdnLink: 'cdn.imageprovider.com/arch/office_01',
    publicId: '',
    createdAt: new Date().toISOString()
  },
  {
    title: 'Summit Blue',
    description: 'Panoramic mountain range view captured at sunrise with atmospheric depth and natural color grading.',
    category: 'Nature',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAp7XMvd-HFvOBNEZIBKmyLm9Pm3D9q5E4crJnfyGJJ0Ta8I296IqLqMmuErE9Ns1-HOYLhu21zTEzjYgxgcILPeCXlBzIGDecJy23re3FW5Zl7PjeW6poh-6tD3gKeo6IHm0OJGtUmaVr7XAZdtoK4vixIG2VvZxkTXnz8QKnoagOz9_G6GYEtlkWcM6DIWgCw8tsaIIrRMBUADLBnYQ2upfN6COTcrvjcvScO6Mikhr682Mab7XZ_wU28P3_CSYfyqTjRbZM67QZL',
    cdnLink: 'cdn.imageprovider.com/nat/summit_blue',
    publicId: '',
    createdAt: new Date().toISOString()
  },
  {
    title: 'Core Processing',
    description: 'Macro shot of a next-generation semiconductor with integrated neural processing units and light-pathways.',
    category: 'Technology',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6BO6yyNTEV0AwR_I7ThtoXmlf_FhJIFsYHb7hFkDtnuNTkPeRfLvKvRHCloyO9hyth4-KlhzK3TMYx6z54u5a9pI-ILtWEVdyCXo4KQsx9MlEaplRGGICRmQ19soDofJqo0ju3vl643r96cujMMLoMu1CPh7ViIr_OVsi1APZyKd891d9s6SIs8mR5mlBhsMHNeDisOmGkjlMnb0tqSozli_dvxxpwhfjO3M2mD0qZdBHtR3_ZwUkGLoVXSXPdCnu9bfnoKIdW7vM',
    cdnLink: 'cdn.imageprovider.com/tech/core_nx',
    publicId: '',
    createdAt: new Date().toISOString()
  },
  {
    title: 'Team Sync',
    description: 'Collaborative team workshop session in a modern daylight studio setting, highlighting creative synergy.',
    category: 'People',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTiConYnXUL923ke5AgBwy4RIb1egX_vLAbiwFfFDUdeALrKBIwIyisedpvxTYQC05uzazZ2--xWf-GhRoXkTNMbuJEAoCWOLq1FZCKjVh6-atWEU8AqiwWH0F3cb7chTSydQHdkBxX0PDyFqjsajh5l4yWFJMUoMIavdXFJaiCkTcAljCL2FjQ7gLqf45Ev6SSPnC9Um7RL0AaGTAjy6PFkre5iMRRethCF-Sa8oDnXGR3U0INw3pMqPOT_PSyH5YDlX5UH8VcAGl',
    cdnLink: 'cdn.imageprovider.com/people/team_sync',
    publicId: '',
    createdAt: new Date().toISOString()
  },
  {
    title: 'Fluid Flow',
    description: 'Generative 3D fluid art representing dynamic data streams and algorithmic fluidity for digital interfaces.',
    category: 'Abstract',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtzwJiChoDLoquOwnT9iCvvSyvjWV_auqRHFPZfZ-0NTiI_xWsMw2Zk-20Cp2Pu5U575ljvL-tz5j5nYb0leaU_j-42iydX_MTv3R5mfZvMCocpMVFXWmB6xLFWkDcRWVisXUSaaENOGq7sx92KXDtIrie5Ku4ZX5yIBfidqfsmRusDj8R3TbexfTFSp0_qF9EWxsdCT1t86XY954-mnf2MpYTQQOZP9STu6FkSW8IztXywpM80O5MyFYqRgQlyqGNwl_ee1ofV59O',
    cdnLink: 'cdn.imageprovider.com/gen/fluid_flow',
    publicId: '',
    createdAt: new Date().toISOString()
  }
]

function seedData(db: Database) {
  const count = db.exec('SELECT COUNT(*) as cnt FROM images')
  if (count[0].values[0][0] === 0) {
    const stmt = db.prepare(
      'INSERT INTO images (title, description, category, url, cdnLink, publicId, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)'
    )
    for (const item of SEED_DATA) {
      stmt.run([item.title, item.description, item.category, item.url, item.cdnLink, item.publicId, item.createdAt])
    }
    stmt.free()
  }
}

export async function initDatabase(): Promise<Database> {
  if (dbInstance) return dbInstance

  const SQL = await initSqlJs({ locateFile: () => '/sql-wasm.wasm' })

  const stored = localStorage.getItem(DB_KEY)
  if (stored) {
    const arr = new Uint8Array(JSON.parse(stored))
    dbInstance = new SQL.Database(arr)
    migrateTable(dbInstance)
  } else {
    dbInstance = new SQL.Database()
    createTable(dbInstance)
    seedData(dbInstance)
    saveToStorage(dbInstance)
  }

  return dbInstance
}



function rowToImage(row: (string | number | Uint8Array | null)[]): Image {
  return {
    id: row[0] as number,
    title: row[1] as string,
    description: row[2] as string,
    category: row[3] as string,
    url: row[4] as string,
    cdnLink: row[5] as string,
    publicId: (row[6] as string) || '',
    createdAt: row[7] as string
  }
}

export function getAllImages(db: Database): Image[] {
  const results = db.exec('SELECT * FROM images ORDER BY id DESC')
  if (results.length === 0) return []
  return results[0].values.map(rowToImage)
}

export function getImagesByCategory(db: Database, category: string): Image[] {
  const stmt = db.prepare('SELECT * FROM images WHERE category = ? ORDER BY id DESC')
  stmt.bind([category])
  const results: Image[] = []
  while (stmt.step()) {
    results.push(rowToImage(stmt.get()))
  }
  stmt.free()
  return results
}

export function addImage(db: Database, image: Omit<Image, 'id'>): Image {
  const stmt = db.prepare(
    'INSERT INTO images (title, description, category, url, cdnLink, publicId, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)'
  )
  stmt.run([image.title, image.description, image.category, image.url, image.cdnLink, image.publicId || '', image.createdAt])
  stmt.free()
  saveToStorage(db)

  const lastId = db.exec('SELECT last_insert_rowid()')
  const id = lastId[0].values[0][0] as number
  return { ...image, id }
}

export async function deleteImage(db: Database, id: number): Promise<boolean> {
  const stmtDel = db.prepare(`SELECT publicId FROM images WHERE id = ?`)
  stmtDel.run([id])
  let publicId = ''
  if (stmtDel.step()) {
    const obj = stmtDel.getAsObject()
    publicId = (obj.publicId as string) || ''
  }
  stmtDel.free()

  const stmt = db.prepare('DELETE FROM images WHERE id = ?')
  stmt.run([id])
  stmt.free()
  saveToStorage(db)

  if (publicId) {
    try {
      const timestamp = Math.floor(Date.now() / 1000).toString()
      const signature = await sha1Hex(`public_id=${publicId}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`)

      const formData = new URLSearchParams()
      formData.append('public_id', publicId)
      formData.append('api_key', CLOUDINARY_API_KEY)
      formData.append('timestamp', timestamp)
      formData.append('signature', signature)

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
      })

      const data = await res.json()
      if (data.result === 'ok') {
        console.log('Cloudinary image deleted:', publicId)
      } else {
        console.warn('Cloudinary delete failed:', data)
      }
    } catch (err) {
      console.warn('Could not delete from Cloudinary:', err)
    }
  }

  return true
}
