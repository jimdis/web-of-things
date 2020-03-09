/**
 * Controller for / route
 */

'use strict'
const express = require('express')
const router = express.Router()
const { spawn } = require('child_process')

const script = './scripts/test.py'

router.route('/').get(async (req, res, next) => {
  try {
    let scriptOutput = ''
    const python = spawn('python', [script])
    python.stdout.on('data', data => (scriptOutput = data.toString()))
    python.on('close', code => {
      console.log(code)
      res.json({ output: scriptOutput })
    })
  } catch (e) {
    next(e)
  }
})

module.exports = router
