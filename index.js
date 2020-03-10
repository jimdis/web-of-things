'use strict'
require('dotenv').config()
const express = require('express')
const compression = require('compression')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
const response = require('./middleware/response')
const errors = require('./middleware/errors')
const collectData = require('./lib/collectData')
const ngrok = require('./lib/ngrok')

// Start collecting data from sensors
collectData.start()

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

app.use(cors())

// Routes
app.use('/', require('./routes'))

// Handle response
app.use(response)

// Handle errors
app.use(errors)

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Server listening on port ${port}`))

if (process.env.NODE_ENV === 'production') {
  ngrok.connect(port)
}
