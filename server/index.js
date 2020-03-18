'use strict'
require('dotenv').config()
const http = require('http')
const express = require('express')
const compression = require('compression')
const cors = require('cors')
const morgan = require('morgan')
const WebSocketServer = require('ws').Server
const app = express()
const emitter = require('./lib/modelEmitter')
const response = require('./middleware/response')
const errors = require('./middleware/errors')
const runScripts = require('./lib/runScripts')
const ngrok = require('./lib/ngrok')
const model = require('./model')

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
wss.on('connection', (ws, req) => {
  const urlParts = req.url.split('/').slice(1)
  const [link, id] = urlParts
  Object.keys(model.links).forEach(key => {
    const resource = model.links[key]
    if (resource.link === '/' + link) {
      emitter.on(id, payload => ws.send(JSON.stringify(payload)))
    }
  })
})

if (process.env.NODE_ENV === 'production') {
  ngrok.connect(port)
}
