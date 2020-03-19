const events = require('events')
const modelEmitter = new events.EventEmitter()
modelEmitter.setMaxListeners(100)
module.exports = modelEmitter
