import mongoose from 'mongoose'
import { config } from '../../config/index.js'
import { Database } from '../database.js'
import logger from '../../utils/logger.js'

const uri = config.db.URI

export async function connectDB(): Promise<void> {
  const db = Database.instance
  await db.connect(uri, mongoose, 5)

  const admin = mongoose.connection.db?.admin()
  let isPrimary = false

  while (!isPrimary) {
    const status = await admin?.command({ replSetGetStatus: 1 })
      .catch(() => null)

    if (status && status.myState === 1) {
      isPrimary = true
    } else {
      logger.info('Waiting for replica set to become PRIMARY...')
      await new Promise(res => setTimeout(res, 5000))
    }
  }

  logger.info('MongoDB connected and PRIMARY')
}

