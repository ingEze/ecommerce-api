import { config } from 'src/config/index'
import { Database } from '../database'

const uri = config.db.URI

export async function connectDB(): Promise<void> {
  const db = Database.instance
  await db.connect(uri)
  console.log('Database running')
}

