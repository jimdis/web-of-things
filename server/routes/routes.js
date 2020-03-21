/**
 * Route controllers
 * Heavily borrowed code from https://github.com/webofthings/webofthings.js.git
 */

const express = require('express')
const router = express.Router()
const model = require('../model')
const runScripts = require('../lib/runScripts')
const auth = require('../middleware/auth')

const properties = model.links.properties
const actions = model.links.actions

const timestamp = new Date().toISOString()

const getResources = subModel =>
  Object.keys(subModel).map(key => {
    const value = subModel[key]
    return {
      id: key,
      name: value.name,
      values: value.data[value.data.length - 1],
    }
  })

// GET /
router.get('/', (req, res, next) => {
  const { id, name, description, tags, customFields } = model
  req.result = {
    id,
    name,
    description,
    tags,
    customFields,
    createdAt: timestamp,
    updatedAt: timestamp,
  }
  req.links = {
    model: {
      link: '/model/',
      title: 'The model for this Web Thing',
    },
  }
  Object.keys(model.links).forEach(key => {
    req.links[key] = {
      link: model.links[key].link,
      title: model.links[key].title,
    }
  })
  next()
})

// GET /model
router.get('/model', (req, res, next) => {
  req.result = model
  req.links = { type: { ...model.links.type } }
  next()
})

// GET /properties
router.get(properties.link, (req, res, next) => {
  req.result = getResources(properties.resources)
  req.links = {
    type: {
      ...model.links.type,
      link: model.links.type.link + '#properties-resource',
    },
  }
  next()
})

// GET /properties/{id}
router.get(`${properties.link}/:id`, (req, res, next) => {
  const resource = properties.resources[req.params.id]
  if (!resource) {
    req.route = null // sends 404 in response middleware
    return next()
  }
  req.result = [...resource.data].reverse()
  req.links = {
    type: {
      ...model.links.type,
      link: model.links.type.link + '#properties-resource',
    },
  }
  next()
})

// GET /actions
router.get(actions.link, (req, res, next) => {
  req.result = getResources(actions.resources)
  req.links = {
    type: {
      ...model.links.type,
      link: model.links.type.link + '#actions-resource',
    },
  }
  next()
})

// /actions/{actionType} (POST, GET)
router
  .route(`${actions.link}/:actionType`)
  .post(auth, (req, res, next) => {
    const { actionType } = req.params
    if (!actions.resources[actionType]) {
      req.route = null // sends 404 in response middleware
      return next()
    }
    if (actionType === 'sendMessage') {
      const { message } = req.body
      if (!message || typeof message !== 'string') {
        const error = new Error(
          'POST body needs to contain a message property with a string value'
        )
        error.statusCode = 400
        return next(error)
      }
      try {
        const { id } = runScripts.sendMessage(message)
        res.location(req.originalUrl + '/' + id)
        return res.status(201).send()
      } catch (e) {
        return next(e)
      }
    }
  })
  .get((req, res, next) => {
    const resource = actions.resources[req.params.actionType]
    if (!resource) {
      req.route = null
      return next()
    }
    req.result = [...resource.data].reverse()
    req.links = {
      type: {
        ...model.links.type,
        link: model.links.type.link + '#actions-resource',
      },
    }
    next()
  })

// GET /actions/{id}/{actionId}
router.get(`${actions.link}/:actionType/:actionId`, (req, res, next) => {
  const { actionType, actionId } = req.params
  if (!actions.resources[actionType]) {
    req.route = null
    return next()
  }
  const actionObject = actions.resources[actionType].data.find(
    obj => obj.id === actionId
  )
  if (!actionObject) {
    req.route = null
    return next()
  }
  req.result = actionObject
  next()
})

module.exports = router
