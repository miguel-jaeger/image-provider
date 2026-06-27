import initSqlJs from 'sql.js'
import type { Database } from 'sql.js'
import type { Image } from '../types/image'

const DB_KEY = 'image-provider-sqlite'

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
  db.run(
    'INSERT INTO images (title, description, category, url, cdnLink, publicId, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [image.title, image.description, image.category, image.url, image.cdnLink, image.publicId || '', image.createdAt]
  )
  saveToStorage(db)

  const lastId = db.exec('SELECT last_insert_rowid()')
  const id = lastId[0].values[0][0] as number
  return { ...image, id }
}

export async function deleteImage(db: Database, id: number): Promise<boolean> {
  const row = db.exec(`SELECT publicId FROM images WHERE id = ${id}`)
  const publicId = row.length > 0 ? (row[0].values[0][0] as string) : ''

  db.run('DELETE FROM images WHERE id = ?', [id])
  saveToStorage(db)

  if (publicId) {
    console.warn(`Cloudinary image not deleted. Manual deletion needed for public_id: ${publicId}`)
  }

  return true
}
