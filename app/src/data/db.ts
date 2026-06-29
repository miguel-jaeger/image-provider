import initSqlJs from 'sql.js'
import type { Database } from 'sql.js'
import type { Image } from '../types/image'

const DB_KEY = 'image-provider-sqlite'
const CLOUD_NAME = 'dhecags26'

let dbInstance: Database | null = null

function createTable(db: Database) {
  db.run(`CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    url TEXT NOT NULL,
    cdnLink TEXT NOT NULL,
    publicId TEXT NOT NULL DEFAULT '',
    deleteToken TEXT NOT NULL DEFAULT '',
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
      if (!columnNames.includes('deleteToken')) {
        db.run("ALTER TABLE images ADD COLUMN deleteToken TEXT NOT NULL DEFAULT ''")
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
    deleteToken: (row[7] as string) || '',
    createdAt: row[8] as string
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
    'INSERT INTO images (title, description, category, url, cdnLink, publicId, deleteToken, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  )
  stmt.run([image.title, image.description, image.category, image.url, image.cdnLink, image.publicId || '', image.deleteToken || '', image.createdAt])
  stmt.free()
  saveToStorage(db)

  const lastId = db.exec('SELECT last_insert_rowid()')
  const id = lastId[0].values[0][0] as number
  return { ...image, id }
}

export async function deleteImage(db: Database, id: number): Promise<boolean> {
  const stmtDel = db.prepare(`SELECT publicId, deleteToken FROM images WHERE id = ?`)
  stmtDel.bind([id])
  let publicId = ''
  let deleteToken = ''
  if (stmtDel.step()) {
    const obj = stmtDel.getAsObject()
    publicId = (obj.publicId as string) || ''
    deleteToken = (obj.deleteToken as string) || ''
  }
  stmtDel.free()

  const stmt = db.prepare('DELETE FROM images WHERE id = ?')
  stmt.run([id])
  stmt.free()
  saveToStorage(db)

  if (publicId && deleteToken) {
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/delete_by_token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: deleteToken })
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
  } else if (publicId) {
    console.warn('No delete token available for image:', publicId, '- Cloudinary cleanup needed manually')
  }

  return true
}