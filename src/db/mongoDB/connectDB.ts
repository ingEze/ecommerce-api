import { config } from 'src/config/index.js'
import { Database } from '../database.js'

const uri = config.db.URI

export async function connectDB(): Promise<void> {
  const db = Database.instance
  await db.connect(uri)
  console.log('Database running')
}

