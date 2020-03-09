'use strict'
require('dotenv').config()
const express = require('express')
const compression = require('compression')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
const errors = require('./middleware/errors')

// Middle-ware
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
app.use('/', require('./routes/root'))
// Handle errors

app.use(errors)

// Handle 404
app.use((req, res) => {
  return res.status(404).json({ error: { code: 404, message: 'Not found' } })
})

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Server listening on port ${port}`))
