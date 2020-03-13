import React from 'react'
import moment from 'moment'
import { IProperty } from '../api/thingApi'

type Props = {
  resource: IProperty
}

const createListItem = (value: IProperty) => {
  return (
    <ul>
      {Object.keys(value).map(key => (
        <li key={key}>
          {key}: ${value[key]}
        </li>
      ))}
    </ul>
  )
}

//TODO: map keys of values to model..
const Property = ({ resource }: Props) => {
  console.log(resource)
  const { id, name, values } = resource
  if (values) {
    values.timestamp = moment(values.timestamp).format('YYYY-MM-DD H:mm:ss')
  }

  return (
    <div>
      <h1>{name || `ID: ${id}`}</h1>
      {values ? (
        <ul>
          {Object.keys(values).map(key => (
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
