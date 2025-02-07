import { MongoClient } from 'mongodb'

const url = 'mongodb://localhost:27017'
const client = new MongoClient(url)
let conn
try {
  conn = await client.connect()
  console.info('Connected to MongoDB successfully')
} catch (e) {
  console.error('Error connecting to MongoDB: ', e)
}

const db = conn.db('studentdb')

export default db
