import express from 'express'
import dotenv from 'dotenv'
import Consul from 'consul'
import { sql } from './db.js'
import jwt from 'jsonwebtoken'

dotenv.config()

const port = parseInt(process.env.PORT, 10) || 3020
const app = express()
const consul = new Consul()

console.log('Registering auth service with consul')
// We expect only one instance of auth service to be running at a time compared to the other services so no id is needed
try {
  consul.agent.service.register({
    id: 'auth',
    name: 'auth',
    address: 'localhost',
    port: port,
    check: {
      http: `http://localhost:${port}/health`,
      interval: '10s'
    }
  })
} catch (error) {
  console.error('Exception caught while registering auth service with consul: ', error)
}
console.log('Registered auth service with consul')

process.on('exit', () => {
  console.log('Unregistering auth service from consul')
  consul.agent.service.deregister('auth', () => {
    process.exit()
  })
})

app.listen(port, () => {
  console.log(`Postgres auth microservice listening on port ${port} !`)
  console.log(`access it via http://localhost:${port}`)
})

app.get('/', (req, res) => {
  res.send('Hello World auth postgre !')
})

app.get('/health', (req, res) => {
  res.send('OK')
})

app.post('/auth', async (req, res) => {
  const { username, password } = req.body
  const user = await sql`SELECT * FROM users WHERE username = ${username} AND password = ${password}`
  if (user.length === 1) {
    const token = jwt.sign({ username }, 'secret')
    res.send({ token })
  } else {
    res.status(401).send('Unauthorized')
  }
})

app.get('/verify-token', (req, res) => {
  const token = req.headers.authorization
  if (token) {
    jwt.verify(token, 'secret', (err, decoded) => {
      if (err) {
        res.status(401).send('Unauthorized')
      } else {
        res.send({ decoded })
      }
    })
  } else {
    res.status(401).send('Unauthorized, no token provided')
  }
})
