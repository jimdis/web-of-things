'use strict'
require('dotenv').config()
const http = require('http')
const express = require('express')
const compression = require('compression')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
const response = require('./middleware/response')
const errors = require('./middleware/errors')
const runScripts = require('./lib/runScripts')
const ngrok = require('./lib/ngrok')
const wsServer = require('./wsServer')

// Start collecting data from sensors
runScripts.collectData()

// Middleware
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}
app.use(express.json())
app.use(
  express.urlencoded({
    extended: false,
  })
)
app.use(compression())

app.use(
  cors({
    methods: ['GET', 'POST'],
    exposedHeaders: ['Link', 'Location'],
  })
)

// Routes
app.use('/', require('./routes'))

// Handle response
app.use(response)

// Handle errors
app.use(errors)

const port = process.env.PORT || 5000

const server = http.createServer(app)

server.listen(port, () => console.log(`Server listening on port ${port}`))
wsServer.createServer(server)

if (process.env.NODE_ENV === 'production') {
  ngrok.connect(port)
}
