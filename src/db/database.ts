import logger from '../utils/logger.js'

export class Database {
  static #instance: Database | null

  private constructor() {}

  public static get instance(): Database {
    if (!Database.#instance) {
      Database.#instance = new Database()
    }
    return Database.#instance
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async connect(uri: string, dbService: any, retries: number = 5): Promise<void> {
    for (let i = 0; i < retries; i++) {
      try {
        await dbService.connect(uri)
        logger.info('URI', uri)
        logger.info('DB Connected')
        return
      } catch (error) {
        logger.error(`DB connection failed, retrying ${i + 1}/${retries}...`)
        if (i === retries - 1) {
          logger.error('Failed to connect to DB after retries')
          logger.error(error)
          process.exit(1)
        }
        await new Promise(r => setTimeout(r, 5000))
      }
    }
  }
}
