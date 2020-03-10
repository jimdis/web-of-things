/**
 * Module for running python scripts to read values from Sense HAT
 */

'use strict'
const model = require('../model')
const { PythonShell } = require('python-shell')

/**
 * Start collecting data from Sense HAT and write to model at selected interval
 * @param {number} interval Collect data every n seconds.
 */
module.exports.start = (interval = 60) => {
  const updateSensorData = async () => {
    try {
      const [temperature, humidity, pressure] = await getSensorValues()

      const values = {
        temperature,
        humidity,
        pressure,
      }

      const timeStamp = new Date().toISOString()

      Object.keys(values).forEach(key => {
        const value = values[key]
        if (typeof value !== 'number') {
          throw new Error('did not receive correct data from Sense HAT')
        }
        const resource = model.links.properties.resources[key]
        const valueName = Object.keys(resource.values)[0]
        resource.data = {
          [valueName]: value,
          timeStamp,
        }
      })
      setTimeout(updateSensorData, interval * 1000)
    } catch (e) {
      console.error(e)
    }
  }
  updateSensorData()
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
