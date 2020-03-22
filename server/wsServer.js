'use strict'
const WebSocket = require('ws')
const model = require('./model')

const sockets = {}

const createServer = server => {
  const wss = new WebSocket.Server({ server })
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
      }
    })
  })
}

/**
 * Sends JSON with payload to all sockets connected to ID
 * Cleans sockets object of closed sockets
 * @param {id of model} id
 * @param {payload to send} payload
 */
const sendMessage = (id, payload) => {
  if (sockets[id]) {
    sockets[id] = sockets[id].filter(s => s.readyState === WebSocket.OPEN)
    sockets[id].forEach(ws => ws.send(JSON.stringify(payload)))
  }
}

module.exports = {
  createServer,
  sendMessage,
}
