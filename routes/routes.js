/**
 * Route controllers
 * Heavily borrowed code from https://github.com/webofthings/webofthings.js.git
 */

const express = require('express')
const router = express.Router()
const model = require('../model')
const modelResources = model.links.properties.resources

// GET /
router.route('/').get((req, res, next) => {
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
router.route('/model').get((req, res, next) => {
  req.result = model
  res.links({
    type: model.links.type.link,
  })
  next()
})

// GET /properties
router.route(model.links.properties.link).get((req, res, next) => {
  const resources = Object.keys(modelResources).map(key => {
    const value = modelResources[key]
    return {
      id: key,
      name: value.name,
      values: value.data[value.data.length - 1],
    }
  })
  req.result = resources
  res.links({
    type: model.links.type.link + '#properties-resource',
  })

  next()
})

// GET /properties/{id}
router.route(`${model.links.properties.link}/:id`).get((req, res, next) => {
  const resource = modelResources[req.params.id]
  if (!resource) {
    req.route = null // sends 404 in response middleware
    return next()
  }
  req.result = [...modelResources[req.params.id].data].reverse()
  res.links({
    type: model.links.type.link + '#properties-resource',
  })
  next()
})

// function createActionsRoutes(model) {
//   var actions = model.links.actions;

//   // GET /actions
//   router.route(actions.link).get(function (req, res, next) {
//     req.result = utils.modelToResources(actions.resources, true);

//     req.model = model;
//     req.type = 'actions';
//     req.entityId = 'actions';

//     if (actions['@context']) type = actions['@context'];
//     else type = 'http://model.webofthings.io/#actions-resource';

//     res.links({
//       type: type
//     });

//     next();
//   });

//   // POST /actions/{actionType}
//   router.route(actions.link + '/:actionType').post(function (req, res, next) {
//     var action = req.body;
//     action.id = uuid.v1();
//     action.status = "pending";
//     action.timestamp = utils.isoTimestamp();
//     utils.cappedPush(actions.resources[req.params.actionType].data, action);
//     res.location(req.originalUrl + '/' + action.id);

//     next();
//   });

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
