import React from 'react'
import moment from 'moment'
import useDashboard from './useDashboard'
import { IProperty, ICreatedValue } from '../api/types'
import Property from './Property'

const Dashboard = () => {
  const { model, properties, error } = useDashboard()
  console.log(properties)
  console.log(model)

  //TODO: Create better map with unit that can also be mapped for data array..
  const mapPropertyToModel = (property: IProperty) => {
    const selectedProperty = model?.links?.properties?.resources?.[property.id]
    const name = selectedProperty?.name || property.id
    const description =
      selectedProperty?.description || 'No description provided'
    const values: ICreatedValue = {
      timestamp: moment(property.values.timestamp).format('YYYY-MM-DD H:mm:ss'),
    }
    Object.keys(property.values)
      .filter(k => k !== 'timestamp')
      .forEach(key => {
        const name = selectedProperty?.values?.[key].name || key
        values[name] = property.values[key]
      })
    return { name, description, values }
  }

  const mappedProperties = properties.map(p => mapPropertyToModel(p))
  console.log(mappedProperties)

  return (
    <div>
      <h1>Dashboard</h1>
      {error && <p>Error! {error}</p>}
      {mappedProperties.length ? (
        mappedProperties.map(p => <Property key={p.name} {...p} />)
      ) : (
        <p>No properties found..</p>
      )}
    </div>
  )
}

export default Dashboard
