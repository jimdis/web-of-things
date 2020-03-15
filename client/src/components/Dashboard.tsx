import React from 'react'
import moment from 'moment'
import useDashboard from './useDashboard'
import { IProperty, ICreatedValue } from '../api/types'
import PropertySummary from './PropertySummary'
import PropertyDetails from './PropertyDetails'

const Dashboard = () => {
  const {
    model,
    properties,
    propertyData,
    fetchPropertyData,
    error,
  } = useDashboard()
  console.log(properties)
  console.log(model)

  const propertyResources = model?.links?.properties?.resources

  const mappedProperties = propertyResources
    ? Object.keys(propertyResources).map(k => ({
        id: k,
        ...propertyResources[k],
      }))
    : []

  console.log(mappedProperties)

  console.log(propertyData)

  return (
    <div>
      <h1>Dashboard</h1>
      {error && <p>Error! {error}</p>}
      {propertyResources ? (
        mappedProperties.map(p => (
          <div key={p.id}>
            <PropertySummary
              name={p.name}
              description={p.description}
              values={p.values}
              latestValues={properties.find(el => el.id === p.id)?.values}
            />
            {propertyData[p.id] ? (
              <PropertyDetails unit="FIX!" values={propertyData[p.id]} />
            ) : (
              <button onClick={() => fetchPropertyData(p.id)}>Get data</button>
            )}
          </div>
        ))
      ) : (
        <p>No properties found..</p>
      )}
    </div>
  )
}

export default Dashboard
