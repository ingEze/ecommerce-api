import mongoose from 'mongoose'

export class Database {
  static #instance: Database | null

  private constructor() {}

  public static get instance(): Database {
    if (!Database.#instance) {
      Database.#instance = new Database()
    }
    return Database.#instance
  }

  public async connect(uri: string): Promise<void> {
    try {
      await mongoose.connect(uri)
      console.log('MongoDB connected')
    } catch (err) {
      console.error('Error connecting DB', err)
      process.exit(1)
    }
  }
}
