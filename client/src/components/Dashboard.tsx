import React from 'react'
import useDashboard from './useDashboard'
import Property from './Property'

const Dashboard = () => {
  const { properties, error } = useDashboard()
  console.log(properties)

  return (
    <div>
      <h1>Dashboard</h1>
      {error && <p>Error! {error}</p>}
      {properties.length ? (
        properties.map(property => (
          <Property key={property.id} resource={property} />
        ))
      ) : (
        <p>No properties found..</p>
      )}
    </div>
  )
}

export default Dashboard
