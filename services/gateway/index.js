import express from 'express'
import dotenv from 'dotenv'
import Consul from 'consul'

dotenv.config()

const port = parseInt(process.env.PORT, 10) || 3050
const app = express()
const consul = new Consul()

const jwtAuthMiddleware = async (req, res, next) => {
  const token = req.headers.authorization
  if (token) {
    try {
      const response = await fetch('http://localhost:3020/verify-token', {
        method: 'GET',
        headers: {
          Authorization: token
        }
      })
      if (response.ok) {
        next()
      } else {
        res.status(401).send('Unauthorized')
      }
    } catch (error) {
      console.error('Failed to verify token : ', error)
      res.status(500).send('Internal Server Error')
    }
  } else {
    res.status(401).send('Unauthorized, no token provided')
  }
}

console.log('Registering gateway service with consul')
// We expect only one instance of gateway service to be running at a time compared to the other services so no id is needed
try {
  consul.agent.service.register({
    id: 'gateway',
    name: 'gateway',
    address: 'localhost',
    port: port,
    check: {
      http: `http://localhost:${port}/health`,
      interval: '10s'
    }
  })
} catch (error) {
  console.error('Exception caught while registering gateway service with consul: ', error)
}
console.log('Registered gateway service with consul')

process.on('exit', () => {
  console.log('Unregistering gateway service from consul')
  consul.agent.service.deregister('gateway', () => {
    process.exit()
  })
})

app.listen(port, () => {
  console.log(`Postgres gateway microservice listening on port ${port} !`)
  console.log(`access it via http://localhost:${port}`)
})

app.get('/', (req, res) => {
  res.send('Hello World gateway !')
})

app.get('/health', (req, res) => {
  res.send('OK')
})

app.post('/auth', async (req, res) => {
  const { username, password } = req.body
  try {
    const response = await fetch('http://localhost:3020/auth', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json()
    res.send(data)
  } catch (error) {
    console.error('Failed to authenticate user : ', error)
    res.status(500).send('Internal Server Error')
  }
})

app.get('/services', async (req, res) => {
  try {
    const services = await consul.agent.services()
    console.log('Services : ', services)
    res.json(services)
  } catch (err) {
    console.error('Failed to fetch services : ', err)
    res.status(500).send('Internal Server Error')
  }
})

app.get('/student/:rest_of_request', jwtAuthMiddleware, async (req, res) => {
  try {
    const services = await consul.agent.services()
    const studentServices = Object.values(services).filter((service) => service.Service === 'student')
    const randomStudentService = studentServices[Math.floor(Math.random() * studentServices.length)]
    console.log('Random student service : ', randomStudentService)
    try {
      const response = await fetch(`http://${randomStudentService.Address}:${randomStudentService.Port}/${req.params.rest_of_request}`)
      const data = await response.json()
      res.json(data)
    } catch (error) {
      console.error('Failed to fetch student services : ', error)
      res.status(500).send('Internal Server Error')
    }
  } catch (error) {
    console.error('Failed to fetch student services : ', error)
    res.status(500).send('Internal Server Error')
  }
})

app.get('/school/:rest_of_request', jwtAuthMiddleware, async (req, res) => {
  try {
    const services = await consul.agent.services()
    const schoolServices = Object.values(services).filter((service) => service.Service === 'school')
    const randomSchoolService = schoolServices[Math.floor(Math.random() * schoolServices.length)]
    console.log('Random school service : ', randomSchoolService)
    try {
      const response = await fetch(`http://${randomSchoolService.Address}:${randomSchoolService.Port}/${req.params.rest_of_request}`)
      const data = await response.json()
      res.json(data)
    } catch (error) {
      console.error('Failed to fetch school services : ', error)
      res.status(500).send('Internal Server Error')
    }
  } catch (error) {
    console.error('Failed to fetch school services : ', error)
    res.status(500).send('Internal Server Error')
  }
})
