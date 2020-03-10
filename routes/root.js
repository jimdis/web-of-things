/**
 * Controller for / route
 */

'use strict'
const express = require('express')
const router = express.Router()
const model = require('../model')

router.route('/').get(async (req, res, next) => {
  try {
    res.json(model)
  } catch (e) {
    next(e)
  }
})

module.exports = router
