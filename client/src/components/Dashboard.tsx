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
        tags: propertyResources[k].tags,
        ...propertyResources[k],
      }))
    : []

  console.log(mappedProperties)

  console.log(propertyData)

  const getData = (id: string) => properties.find(el => el.id === id)?.values

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
              tags={p.tags}
              values={p.values}
              latestValues={getData(p.id)}
            />
            {propertyData[p.id] && p.values ? (
              <PropertyDetails values={p.values} data={propertyData[p.id]} />
            ) : (
              getData(p.id) && (
                <button onClick={() => fetchPropertyData(p.id)}>
                  Get data
                </button>
              )
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
