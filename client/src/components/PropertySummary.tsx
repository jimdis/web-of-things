import React from 'react'
import moment from 'moment'
import { IProperty, ICreatedValue } from '../api/types'

type Props = {
  name: string
  description?: string
  values?: ICreatedValue
}

const PropertySummary = ({ name, description, values }: Props) => {
  return (
    <div>
      <h1>{name}</h1>
      <h2>{description}</h2>
      <h3>{values?.timestamp}</h3>
      {values ? (
        <ul>
          {Object.keys(values)
            .filter(k => k !== 'timestamp')
            .map(key => (
              <li key={key}>
                {key}: {values[key]}
              </li>
            ))}
        </ul>
      ) : (
        <p>No values found for this property</p>
      )}
    </div>
  )
}

export default PropertySummary
