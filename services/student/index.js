import express from 'express'
import dotenv from 'dotenv'
import Consul from 'consul'
import db from './db.js'
//import { MongoClient } from 'mongodb'

dotenv.config()

//Create a unique id for the service using the current timestamp and a random number
const id = Date.now() + Math.random()
const port = parseInt(process.env.PORT, 10) || 3000

//! Removed docker env variables, will be run will pnpm directly
//const port = process.env.SERVICE_PORT || 3001
//const service_outside_port = process.env.SERVICE_OUTSIDE_PORT || port
//const container_name = process.env.CONTAINER_NAME || 'student'
//const service_name = process.env.SERVICE_NAME || 'student'

const app = express()
const consul = new Consul()

console.log('Registering student service with consul')
try {
  consul.agent.service.register({
    id: 'student_' + id,
    name: 'student',
    address: 'localhost',
    port: port,
    check: {
      http: `http://localhost:${port}/health`,
      interval: '10s'
    }
  })
} catch (error) {
  console.error('Exception caught while registering student service with consul: ', error)
}
console.log('Registered student service with consul')

process.on('exit', () => {
  console.log('Unregistering student service from consul')
  consul.agent.service.deregister('student', () => {
    process.exit()
  })
})

app.listen(port, () => {
  console.log(`Mongodb student microservice listening on port ${port} !`)
  console.log(`access it via http://localhost:${port}`)
})

app.get('/', (req, res) => {
  res.send('Hello World students mongodb !')
})

app.get('/health', (req, res) => {
  res.send('OK')
})

app.get('/services', async (req, res) => {
  try {
    const service = await consul.agent.service.get('school')
    console.log('Service : ', service)
    res.json(services)
  } catch (err) {
    console.error('Failed to fetch services : ', err)
    res.status(500).send('Internal Server Error')
  }
})

app.get('/students', async (req, res) => {
  try {
    let students = await db.collection('students').find().toArray()
    const services = await consul.agent.services()
    const schoolServices = Object.values(services).filter((service) => service.Service === 'school')

    for (const student of students) {
      const schoolService = schoolServices.find((service) => service.ID === student.school_id)
      if (schoolService) {
        const response = await fetch(`http://${schoolService.Address}:${schoolService.Port}/schools/${student.school_id}`)
        if (response.ok) {
          student.school = await response.json()
        } else {
          console.error(`Failed to fetch school for student ${student._id}`)
        }
      }
    }
    res.send(students).status(200)
  } catch (err) {
    console.error('Failed to fetch students : ', err)
    res.status(500).send('Internal Server Error : ', err)
  }
})

/* app.get('/students/:id', async (req, res) => {
  try {
    const student = await db.collection('students').findOne({ _id: new MongoClient.ObjectID(req.params.id) })
    if (!student) {
      res.status(404).send('Student not found')
    } else {
      res.json(student)
    }
  } catch (err) {
    console.error('Failed to fetch student', err)
    res.status(500).send('Internal Server Error')
  }
}) */

/* app.post('/students', async (req, res) => {
  try {
    const result = await db.collection('students').insertOne(req.body)
    res.status(201).json(result.ops[0])
  } catch (err) {
    console.error('Failed to create student', err)
    res.status(500).send('Internal Server Error')
  }
}) */

/* app.put('/students/:id', async (req, res) => {
  try {
    const result = await db
      .collection('students')
      .findOneAndUpdate({ _id: new MongoClient.ObjectID(req.params.id) }, { $set: req.body }, { returnOriginal: false })
    if (!result.value) {
      res.status(404).send('Student not found')
    } else {
      res.json(result.value)
    }
  } catch (err) {
    console.error('Failed to update student', err)
    res.status(500).send('Internal Server Error')
  }
}) */

/* app.delete('/students/:id', async (req, res) => {
  try {
    const result = await db.collection('students').deleteOne({ _id: new MongoClient.ObjectID(req.params.id) })
    if (result.deletedCount === 0) {
      res.status(404).send('Student not found')
    } else {
      res.sendStatus(204)
    }
  } catch (err) {
    console.error('Failed to delete student', err)
    res.status(500).send('Internal Server Error')
  }
}) */
