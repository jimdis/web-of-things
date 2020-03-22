/**
 * Module for running python scripts to read values from Sense HAT
 */

'use strict'
const { PythonShell } = require('python-shell')
const shortid = require('shortid')
const model = require('../model')
const sockets = require('../wsServer')

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
  sockets.sendMessage('sendMessage', actionObject)

  // Runs pending action when no executing actions are found
  const executeAction = () => {
    const pendingAction = actionResource.data.find(v => v.status === 'pending')
    if (
      pendingAction &&
      !actionResource.data.find(v => v.status === 'executing')
    ) {
      pendingAction.status = 'executing'
      sockets.sendMessage('sendMessage', pendingAction)
      runMessageScript(pendingAction.value[actionName])
        .then(() => {
          pendingAction.status = 'completed'
          sockets.sendMessage('sendMessage', pendingAction)
          const resourceObj = {
            [valueName]: pendingAction.value[actionName],
            timestamp,
          }
          updateDataArray(propertyResource.data, resourceObj)
          sockets.sendMessage('leds', resourceObj)
          executeAction() // run next pending action
        })
        .catch(e => {
          pendingAction.status = 'failed'
          console.error(e)
        })
    }
  }
  executeAction()
  return actionObject
}

const runMessageScript = message =>
  new Promise((res, rej) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(message)
      setTimeout(() => res(), 10000)
    } else {
      const options = {
        scriptPath: './scripts',
        args: [message],
      }
      PythonShell.run('sendMessage.py', options, err => {
        if (err) {
          return rej(err)
        }
        return res()
      })
    }
  })

/**
 * Start collecting data from Sense HAT and write to model at selected interval
 * @param {number} interval Collect data every n seconds. Default 10s
 */
module.exports.collectData = (interval = 10) => {
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
        const valueObj = {
          [valueName]: value,
          timestamp,
        }
        sockets.sendMessage(key, valueObj)
        updateDataArray(resource.data, valueObj)
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
