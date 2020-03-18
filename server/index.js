'use strict'
require('dotenv').config()
const http = require('http')
const express = require('express')
const compression = require('compression')
const cors = require('cors')
const morgan = require('morgan')
const WebSocketServer = require('ws').Server
const app = express()
const url = require('url')
const emitter = require('./lib/modelEmitter')
const response = require('./middleware/response')
const errors = require('./middleware/errors')
const runScripts = require('./lib/runScripts')
const ngrok = require('./lib/ngrok')

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
    exposedHeaders: '*',
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
const wss = new WebSocketServer({ server })
console.info('WebSocket server started...')

server.listen(port, () => console.log(`Server listening on port ${port}`))
wss.on('connection', ws => {
  const reqUrl = url.parse(ws.upgradeReq.url, true)
  console.log(reqUrl.pathname)
})

emitter.on('action', action => console.log(action))

if (process.env.NODE_ENV === 'production') {
  ngrok.connect(port)
}
