import initSqlJs, { Database } from 'sql.js'
import type { Image } from '../types/image'

let db: Database | null = null

const SEED_DATA: Omit<Image, 'id'>[] = [
  {
    title: 'Harbor Horizon',
    description: 'Ultra-modern minimalist office space featuring sustainable materials and ergonomic design elements for creative teams.',
    category: 'Architecture',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvQD9VVrvBf9zhmuva2VpTe4BMK1JVcL8WO1XKSBBNhU6XM8eYDQLSthoP0D5jLTByn5x9w9UgFx-60kyArV1So6ULKFs8z1pTADn8WeJMMFwnqqflXXrUpXrZoT2tsryAw_KjPHvbWkfo_MOHzMtfjD3AkYmmf_xscgLC5ZjsvJJpA5ea70B8kCvAPXfP0tGBG-mIs5lItDpW6xDqHLRCaemagPbZOR6yTFoiCkqomaV1hHcEAcTn_MDAK0I_ZKOVk4ppv4vnF_bi',
    cdnLink: 'cdn.imageprovider.com/arch/office_01',
    createdAt: new Date().toISOString()
  },
  {
    title: 'Summit Blue',
    description: 'Panoramic mountain range view captured at sunrise with atmospheric depth and natural color grading.',
    category: 'Nature',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAp7XMvd-HFvOBNEZIBKmyLm9Pm3D9q5E4crJnfyGJJ0Ta8I296IqLqMmuErE9Ns1-HOYLhu21zTEzjYgxgcILPeCXlBzIGDecJy23re3FW5Zl7PjeW6poh-6tD3gKeo6IHm0OJGtUmaVr7XAZdtoK4vixIG2VvZxkTXnz8QKnoagOz9_G6GYEtlkWcM6DIWgCw8tsaIIrRMBUADLBnYQ2upfN6COTcrvjcvScO6Mikhr682Mab7XZ_wU28P3_CSYfyqTjRbZM67QZL',
    cdnLink: 'cdn.imageprovider.com/nat/summit_blue',
    createdAt: new Date().toISOString()
  },
  {
    title: 'Core Processing',
    description: 'Macro shot of a next-generation semiconductor with integrated neural processing units and light-pathways.',
    category: 'Technology',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6BO6yyNTEV0AwR_I7ThtoXmlf_FhJIFsYHb7hFkDtnuNTkPeRfLvKvRHCloyO9hyth4-KlhzK3TMYx6z54u5a9pI-ILtWEVdyCXo4KQsx9MlEaplRGGICRmQ19soDofJqo0ju3vl643r96cujMMLoMu1CPh7ViIr_OVsi1APZyKd891d9s6SIs8mR5mlBhsMHNeDisOmGkjlMnb0tqSozli_dvxxpwhfjO3M2mD0qZdBHtR3_ZwUkGLoVXSXPdCnu9bfnoKIdW7vM',
    cdnLink: 'cdn.imageprovider.com/tech/core_nx',
    createdAt: new Date().toISOString()
  },
  {
    title: 'Team Sync',
    description: 'Collaborative team workshop session in a modern daylight studio setting, highlighting creative synergy.',
    category: 'People',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTiConYnXUL923ke5AgBwy4RIb1egX_vLAbiwFfFDUdeALrKBIwIyisedpvxTYQC05uzazZ2--xWf-GhRoXkTNMbuJEAoCWOLq1FZCKjVh6-atWEU8AqiwWH0F3cb7chTSydQHdkBxX0PDyFqjsajh5l4yWFJMUoMIavdXFJaiCkTcAljCL2FjQ7gLqf45Ev6SSPnC9Um7RL0AaGTAjy6PFkre5iMRRethCF-Sa8oDnXGR3U0INw3pMqPOT_PSyH5YDlX5UH8VcAGl',
    cdnLink: 'cdn.imageprovider.com/people/team_sync',
    createdAt: new Date().toISOString()
  },
  {
    title: 'Fluid Flow',
    description: 'Generative 3D fluid art representing dynamic data streams and algorithmic fluidity for digital interfaces.',
    category: 'Abstract',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtzwJiChoDLoquOwnT9iCvvSyvjWV_auqRHFPZfZ-0NTiI_xWsMw2Zk-20Cp2Pu5U575ljvL-tz5j5nYb0leaU_j-42iydX_MTv3R5mfZvMCocpMVFXWmB6xLFWkDcRWVisXUSaaENOGq7sx92KXDtIrie5Ku4ZX5yIBfidqfsmRusDj8R3TbexfTFSp0_qF9EWxsdCT1t86XY954-mnf2MpYTQQOZP9STu6FkSW8IztXywpM80O5MyFYqRgQlyqGNwl_ee1ofV59O',
    cdnLink: 'cdn.imageprovider.com/gen/fluid_flow',
    createdAt: new Date().toISOString()
  }
]

export async function initDatabase(): Promise<Database> {
  if (db) return db

  const SQL = await initSqlJs({
    locateFile: (file) => `https://sql.js.org/dist/${file}`
  })

  const savedData = localStorage.getItem('image-provider-db')
  if (savedData) {
    const buf = new Uint8Array(JSON.parse(savedData))
    db = new SQL.Database(buf)
  } else {
    db = new SQL.Database()
    db.run(`
      CREATE TABLE IF NOT EXISTS images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        category TEXT NOT NULL,
        url TEXT NOT NULL,
        cdnLink TEXT,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `)
    for (const item of SEED_DATA) {
      db.run(
        'INSERT INTO images (title, description, category, url, cdnLink, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
        [item.title, item.description, item.category, item.url, item.cdnLink, item.createdAt]
      )
    }
    saveDatabase()
  }

  return db
}

function saveDatabase() {
  if (!db) return
  const data = db.export()
  const arr = Array.from(data)
  localStorage.setItem('image-provider-db', JSON.stringify(arr))
}

export function getAllImages(): Image[] {
  if (!db) return []
  const results = db.exec('SELECT * FROM images ORDER BY id DESC')
  if (results.length === 0) return []
  const { values } = results[0]
  return values.map((row) => ({
    id: row[0] as number,
    title: row[1] as string,
    description: row[2] as string,
    category: row[3] as string,
    url: row[4] as string,
    cdnLink: row[5] as string,
    createdAt: row[6] as string
  }))
}

export function getImagesByCategory(category: string): Image[] {
  if (!db) return []
  const results = db.exec('SELECT * FROM images WHERE category = ? ORDER BY id DESC', [category])
  if (results.length === 0) return []
  const { values } = results[0]
  return values.map((row) => ({
    id: row[0] as number,
    title: row[1] as string,
    description: row[2] as string,
    category: row[3] as string,
    url: row[4] as string,
    cdnLink: row[5] as string,
    createdAt: row[6] as string
  }))
}

export function addImage(image: Omit<Image, 'id'>): number {
  if (!db) return 0
  db.run(
    'INSERT INTO images (title, description, category, url, cdnLink, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
    [image.title, image.description, image.category, image.url, image.cdnLink, image.createdAt]
  )
  saveDatabase()
  const result = db.exec('SELECT last_insert_rowid()')
  return result[0]?.values[0][0] as number
}

export function deleteImage(id: number): boolean {
  if (!db) return false
  db.run('DELETE FROM images WHERE id = ?', [id])
  saveDatabase()
  return true
}
