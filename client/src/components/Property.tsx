import React from 'react'
import moment from 'moment'
import { IProperty, ICreatedValue } from '../api/types'

type Props = {
  name: string
  description?: string
  values?: ICreatedValue
}

//TODO: map keys of values to model..
const Property = ({ name, description, values }: Props) => {
  return (
    <div>
      <h1>{name}</h1>
      <h2>{values?.timestamp}</h2>
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

export default Property
