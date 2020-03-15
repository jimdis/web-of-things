import React from 'react'
import moment from 'moment'
import { ICreatedValue, IValue, CreatedValueType } from '../api/types'

type Props = {
  name?: string
  description?: string
  tags?: string[]
  values?: Record<string, IValue>
  latestValues?: ICreatedValue
}

const PropertySummary = ({
  name = 'No name provided',
  description = 'No description provided',
  tags = [],
  values,
  latestValues,
}: Props) => {
  const displayValue = (value: CreatedValueType) => {
    if (typeof value === 'number') {
      return Math.round(value)
    }
    if (typeof value === 'boolean') {
      return value ? '\u2705' : '\u274C'
    }
    return value
  }
  return (
    <div>
      <h3>{name}</h3>
      <h4>{description}</h4>
      <h4>Tags</h4>
      <ul>
        {tags.map((tag, i) => (
          <li key={tag + i}>{tag}</li>
        ))}
      </ul>
      <h4>Data</h4>
      {values ? (
        Object.keys(values).map(key => (
          <div key={key}>
            <h4>{values[key].name}</h4>
            <p>{values[key].description}</p>
            <h4>Latest value</h4>
            {latestValues && latestValues.timestamp ? (
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
