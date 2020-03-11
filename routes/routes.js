/**
 * Route controllers
 * Heavily borrowed code from https://github.com/webofthings/webofthings.js.git
 */

const express = require('express')
const router = express.Router()
const model = require('../model')
const runScripts = require('../lib/runScripts')

const properties = model.links.properties
const actions = model.links.actions

const getResources = subModel =>
  Object.keys(subModel).map(key => {
    const value = subModel[key]
    return {
      id: key,
      name: value.name,
      values: value.data ? value.data[value.data.length - 1] : {},
    }
  })

// GET /
router.get('/', (req, res, next) => {
  const { id, name, description, tags, customFields } = model
  req.model = model
  req.type = 'root'
  req.result = {
    id,
    name,
    description,
    tags,
    customFields,
  }
  let links = {
    model: '/model/',
  }
  Object.keys(model.links).forEach(key => {
    links[key] = model.links[key].link
  })
  res.links(links)
  next()
})

// GET /model
router.get('/model', (req, res, next) => {
  req.result = model
  res.links({
    type: model.links.type.link,
  })
  next()
})

// GET /properties
router.get(properties.link, (req, res, next) => {
  req.result = getResources(properties.resources)
  res.links({
    type: model.links.type.link + '#properties-resource',
  })
  next()
})

// GET /properties/{id}
router.get(`${properties.link}/:id`, (req, res, next) => {
  const resource = properties.resources[req.params.id]
  if (!resource) {
    req.route = null // sends 404 in response middleware
    return next()
  }
  req.result = resource.data ? [...resource.data].reverse() : []
  res.links({
    type: model.links.type.link + '#properties-resource',
  })
  next()
})

// GET /actions
router.get(actions.link, (req, res, next) => {
  req.result = getResources(actions.resources)
  res.links({
    type: model.links.type.link + '#actions-resource',
  })
  next()
})

//TODO: Add auth middleware?
// POST /actions/{actionType}
router.route(`${actions.link}/:actionType`).post((req, res, next) => {
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
    const messageObject = runScripts.sendMessage(message)
    res.location(req.originalUrl + '/' + messageObject.id)
  }
  next()
})

//   // GET /actions/{actionType}
//   router.route(actions.link + '/:actionType').get(function (req, res, next) {

//     req.result = reverseResults(actions.resources[req.params.actionType].data);
//     req.actionModel = actions.resources[req.params.actionType];
//     req.model = model;

//     req.type = 'action';
//     req.entityId = req.params.actionType;

//     if (actions.resources[req.params.actionType]['@context']) type = actions.resources[req.params.actionType]['@context'];
//     else type = 'http://model.webofthings.io/#actions-resource';

//     res.links({
//       type: type
//     });

//     next();
//   });

//   // GET /actions/{id}/{actionId}
//   router.route(actions.link + '/:actionType/:actionId').get(function (req, res, next) {
//     req.result = utils.findObjectInArray(actions.resources[req.params.actionType].data,
//       {"id" : req.params.actionId});
//     next();
//   });
// };

module.exports = router
