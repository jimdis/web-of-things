/**
 * Controller for / route
 */

'use strict'
const express = require('express')
const router = express.Router()
const { PythonShell } = require('python-shell')

router.route('/').get(async (req, res, next) => {
  try {
    const options = {
      scriptPath: './scripts',
      args: [],
    }
    PythonShell.run('test.py', options, (err, data) => {
      if (err) {
        return next(err)
      }
      console.log(typeof data[0])
      res.json({ data })
    })
  } catch (e) {
    console.log('CAUGHT ERROR!!!')
    next(e)
  }
})

router.route('/:id').get(async (req, res, next) => {
  try {
    PythonShell.run(`./scripts/${req.params.id}.py`, null, (err, data) => {
      if (err) {
        return next(err)
      }
      console.log(typeof data[0])
      res.json({ data })
    })
  } catch (e) {
    next(e)
  }
})

module.exports = router
