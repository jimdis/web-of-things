/**
 * Module for running python scripts to read values from Sense HAT
 */

'use strict'
const { PythonShell } = require('python-shell')
const shortid = require('shortid')
const model = require('../model')

/**
 * Gets values from Sense HAT
 * @returns {Promise<number[]>} [temperature, humidity, pressure]
 */
const getSensorValues = () =>
  new Promise((resolve, reject) => {
    //Dummy values for development environment
    if (process.env.NODE_ENV !== 'production') {
      const getRandomNumber = range => Math.random() * range
      return resolve([
        getRandomNumber(50),
        getRandomNumber(30),
        getRandomNumber(1000),
      ])
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
  const actionResource = model.links.actions.resources.sendMessage
  const propertyResource = model.links.properties.resources.leds
  const id = shortid.generate()
  const actionName = Object.keys(actionResource.values)[0]
  const valueName = Object.keys(propertyResource.values)[0]
  const timestamp = new Date().toISOString()
  const actionObject = {
    id,
    value: {
      [actionName]: message,
    },
    status: 'pending',
    timestamp,
  }
  updateDataArray(actionResource.data, actionObject)

  if (process.env.NODE_ENV !== 'production') {
    //Simulate 1s delay
    setTimeout(() => {
      actionObject.status = 'completed'
      updateDataArray(propertyResource.data, {
        [valueName]: message,
        timestamp,
      })
    }, 1000)
  } else {
    const options = {
      scriptPath: './scripts',
      args: [message],
    }
    PythonShell.run('sendMessage.py', options, (err, data) => {
      if (err) {
        actionObject.status = 'failed'
        console.error(err)
      } else {
        actionObject.status = 'completed'
        updateDataArray(propertyResource.data, {
          [valueName]: data[0],
          timestamp,
        })
      }
    })
  }
  return actionObject
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
        const resource = model.links.properties.resources[key]
        const valueName = Object.keys(resource.values)[0]
        const timestamp = new Date().toISOString()
        updateDataArray(resource.data, {
          [valueName]: value,
          timestamp,
        })
      })
      setTimeout(updateSensorData, interval * 1000)
    } catch (e) {
      console.error(e)
    }
  }
  updateSensorData()
}

/**
 * Helper util to keep array length at set size
 * @param {*[]} arr Array to update
 * @param {*} value Value to push
 */
const updateDataArray = (arr, value) => {
  if (arr.length === model.customFields.dataArraySize) {
    arr.shift()
  }
  arr.push(value)
}
