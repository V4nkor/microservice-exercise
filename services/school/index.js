import express from 'express'
import dotenv from 'dotenv'
import Consul from 'consul'
import { sql } from './db.js'
import { getSchools, getSchoolById } from './functions.js'

dotenv.config()

//Create a unique id for the service using the current timestamp and a random number
const id = Date.now() + Math.random()
const port = parseInt(process.env.PORT, 10) || 3000
const app = express()
const consul = new Consul()

console.log('Registering school service with consul')
try {
  consul.agent.service.register({
    id: 'school_' + id,
    name: 'school',
    address: 'localhost',
    port: port,
    check: {
      http: `http://localhost:${port}/health`,
      interval: '10s'
    }
  })
} catch (error) {
  console.error('Exception caught while registering school service with consul: ', error)
}
console.log('Registered school service with consul')

process.on('exit', () => {
  console.log('Unregistering school service from consul')
  consul.agent.service.deregister('school', () => {
    process.exit()
  })
})

app.listen(port, () => {
  console.log(`Postgres School microservice listening on port ${port} !`)
  console.log(`access it via http://localhost:${port}`)
})

app.get('/', (req, res) => {
  res.send('Hello World school postgre !')
})

app.get('/health', (req, res) => {
  res.send('OK')
})

app.get('/schools', async (req, res) => {
  try {
    const schools = await getSchools()
    res.json(schools)
  } catch (error) {
    console.error('Error fetching schools : ', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.get('/schools/:id', async (req, res) => {
  try {
    const [school] = await getSchoolById(req.params.id)
    if (!school) {
      console.log('School with id : ', req.params.id, ' not found')
      return res.status(404).json({ error: 'School not found' })
    }
    res.json(school)
  } catch (error) {
    console.error('Error fetching schools by Id : ', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.post('/schools', async (req, res) => {
  const [school] = await sql`
    INSERT INTO school (name, address, directorName)
    VALUES (${req.body.name}, ${req.body.address}, ${req.body.directorName})
    RETURNING *
  `
  res.status(201).json(school)
})

app.put('/schools/:id', async (req, res) => {
  const [school] = await sql`
    UPDATE school
    SET name = ${req.body.name}, address = ${req.body.address}, directorName = ${req.body.directorName}
    WHERE id = ${req.params.id}
    RETURNING *
  `
  res.json(school)
})

app.delete('/schools/:id', async (req, res) => {
  await sql`
    DELETE FROM school
    WHERE id = ${req.params.id}
  `
  res.sendStatus(204)
})
