/**
 * Module to setup ngrok tunnel in production
 */
'use strict'
const ngrok = require('ngrok')

/**
 * Connects to ngrok and logs url
 * @param {number} port Port of server
 */
module.exports.connect = async port => {
  const token = process.env.NGROK_KEY
  await ngrok.authtoken(token)
  const url = await ngrok.connect(port)
  console.log(`ngrok tunnel url: ${url}`)
}
