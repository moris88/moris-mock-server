const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const dotenv = require('dotenv')
const fs = require('fs')

dotenv.config()

const mockData1 = JSON.parse(fs.readFileSync('./example/mock1.json', 'utf8'))

const app = express()
const PORT = process.env.PORT || 5000
const SERVER_URL = process.env.SERVER_URL || 'http://localhost'
const ORIGIN = process.env.ORIGIN || '*'

// Configuration of the options CORS
const corsOptions = {
  origin: ORIGIN, // Set allowed source
  methods: ['GET,PUT,DELETE,POST'], // Set allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Set allowed headers
}

// LIST OF MIDDLEWARES
app.use(cors(corsOptions)) // middleware with options CORS
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use(authorizationMiddleware)

function authorizationMiddleware (
  req,
  res,
  next
) {
  console.log(`-->New request! - Path: ${req.path}`)
  // Check if the request has the authorization header
  next()
}

app.get('/example', async (req, res) => {
  return res.status(500).json(mockData1)
})

app.all('*', generalPathMatch)

function generalPathMatch (req, res) {
  console.log('REQUEST REJECTED - PATH NOT FOUND')
  return res.status(404).json(
    {
      statusText: 'ERROR',
      status: 404,
      error: 'path not found'
    }
  )
}
app.listen(PORT, () => console.log(`Server Running On: ${SERVER_URL}:${PORT}`))
