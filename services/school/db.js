import postgres from 'postgres'
import dotenv from 'dotenv'
dotenv.config()

export const sql = postgres({
  host: 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.POSTGRES_DB,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD
})
