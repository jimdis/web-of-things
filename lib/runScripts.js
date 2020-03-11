/**
 * Module for running python scripts to read values from Sense HAT
 */

'use strict'
const { PythonShell } = require('python-shell')
const shortid = require('shortid')
const model = require('../model')

/**
 * Updates data field on model by pushing value along with timestamp to data array
 * @param {string} resourceKey id of the resource
 * @param {*} value value to push to data field along with timestamp
 * @param {Object} [additional] object with optional additional fields
 */
const updateDataField = (resourceKey, value, additional) => {
  const resource = model.links.properties.resources[resourceKey]
  const valueName = Object.keys(resource.values)[0]
  const timeStamp = new Date().toISOString()
  if (!resource.data) {
    resource.data = []
  }
  if (resource.data.length === model.customFields.dataArraySize) {
    resource.data.shift()
  }
  resource.data.push({
    [valueName]: value,
    timeStamp,
    ...additional,
  })
}

/**
 * Gets values from Sense HAT
 * @returns {Promise<number[]>} [temperature, humidity, pressure]
 */
const getSensorValues = () =>
  new Promise((resolve, reject) => {
    //Dummy values for development environment
    if (process.env.NODE_ENV !== 'production') {
      return resolve([30, 40, 50])
    }
    const options = {
      scriptPath: './scripts',
      args: [],
    }
    PythonShell.run('printSensorValues.py', options, (err, data) => {
      if (err) {
        return reject(err)
      }
      return resolve(data.map(d => parseInt(d)))
    })
  })

/**
 * Sends message to Sense HAT
 * @param {string} message The message to send
 */
module.exports.sendMessage = message => {
  if (!message || typeof message !== 'string') {
    throw new Error('Message needs to be a non-empty string')
  }
  const id = shortid.generate()
  const additionalFields = {
    id,
    status: 'pending',
  }
  updateDataField('leds', message, additionalFields)
  const messageObject = model.links.properties.resources.leds.data.find(
    d => d.id === id
  )
  if (process.env.NODE_ENV !== 'production') {
    //Simulate 1s delay
    setTimeout(() => {
      messageObject.status = 'completed'
      messageObject.message = message
    }, 1000)
    return messageObject
  }

  const options = {
    scriptPath: './scripts',
    args: [message],
  }
  PythonShell.run('sendMessage.py', options, (err, data) => {
    if (err) {
      messageObject.status = 'failed'
      console.error(err)
    } else {
      messageObject.status = 'completed'
      messageObject.message = data[0]
    }
  })

  return messageObject
}

/**
 * Start collecting data from Sense HAT and write to model at selected interval
 * @param {number} interval Collect data every n seconds.
 */
module.exports.collectData = (interval = 60) => {
  const updateSensorData = async () => {
    try {
      const [temperature, humidity, pressure] = await getSensorValues()
      const values = {
        temperature,
        humidity,
        pressure,
      }
      Object.keys(values).forEach(key => {
        const value = values[key]
        if (typeof value !== 'number') {
          throw new Error('did not receive correct data from Sense HAT')
        }
        updateDataField(key, value)
      })
      setTimeout(updateSensorData, interval * 1000)
    } catch (e) {
      console.error(e)
    }
  }
  updateSensorData()
}
