import React from 'react'
import moment from 'moment'
import { ICreatedValue, IValue, CreatedValueType } from '../api/types'

type Props = {
  name?: string
  description?: string
  values?: Record<string, IValue>
  latestValues?: ICreatedValue
}

const PropertySummary = ({
  name = 'No name provided',
  description = 'No description provided',
  values,
  latestValues,
}: Props) => {
  const displayValue = (value: CreatedValueType) => {
    console.log(value)
    if (typeof value === 'number') {
      return Math.round(value)
    }
    if (typeof value === 'boolean') {
      return value === true ? '\u2705' : '\u274C'
    }
    return value
  }
  return (
    <div>
      <h1>{name}</h1>
      <h2>{description}</h2>
      <h3>Data</h3>
      {values ? (
        Object.keys(values).map(key => (
          <div key={key}>
            <h4>{values[key].name}</h4>
            <p>{values[key].description}</p>
            <h4>Latest value</h4>
            {latestValues ? (
              <div>
                <p>
                  {moment(latestValues.timestamp).format('YYYY-MM-DD H:mm:ss')}
                </p>
                <p>
                  {displayValue(latestValues[key])} {values[key].unit}
                </p>
              </div>
            ) : (
              <p>No Data available</p>
            )}
          </div>
        ))
      ) : (
        <p>No Data available</p>
      )}
    </div>
  )
}

export default PropertySummary
