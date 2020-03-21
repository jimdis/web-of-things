'use strict'
const WebSocketServer = require('ws').Server
const model = require('./model')

const sockets = {}

const createServer = server => {
  const wss = new WebSocketServer({ server })
  console.info('WebSocket server started...')

  wss.on('connection', (ws, req) => {
    const urlParts = req.url.split('/').slice(1)
    const [link, id] = urlParts
    Object.keys(model.links).forEach(key => {
      const resource = model.links[key]
      if (resource.link === '/' + link) {
        if (sockets[id]) {
          sockets[id].push(ws)
        } else {
          sockets[id] = [ws]
        }
        // emitter.on(id, payload => ws.send(JSON.stringify(payload)))
        // console.log(`listeners on ${id}: ${emitter.listenerCount(id)}`)
        console.log(sockets)
      }
    })
  })
}

module.exports = {
  sockets,
  createServer,
}
