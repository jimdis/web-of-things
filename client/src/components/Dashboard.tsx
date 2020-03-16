import React from 'react'
import useDashboard from './useDashboard'
import PropertySummary from './PropertySummary'
import PropertyDetails from './PropertyDetails'
import Action from './Action'
import ActionDetails from './ActionDetails'

const Dashboard = () => {
  const {
    model,
    properties,
    propertyData,
    actionData,
    fetchPropertyData,
    fetchActionData,
    submitAction,
    error,
  } = useDashboard()

  const mapResourceToModel = (resourceKey: 'properties' | 'actions') => {
    const resources = model?.links?.[resourceKey]?.resources
    return resources
      ? Object.keys(resources).map(k => ({
          id: k,
          name: resources[k].name as string | undefined,
          description: resources[k].description as string | undefined,
          tags: resources[k].tags as string[] | undefined,
          values: resources[k].values,
        }))
      : []
  }

  const propertyResources = mapResourceToModel('properties')
  const actionResources = mapResourceToModel('actions')

  const getData = (id: string) => properties.find(el => el.id === id)?.values

  return (
    <div>
      <h1>Dashboard</h1>

      {error && <p>Error! {error}</p>}
      <div>
        <h2>Properties</h2>
        {propertyResources.length ? (
          propertyResources.map(p => (
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
      <h2>Actions</h2>
      {actionResources.length ? (
        actionResources.map(a => (
          <div key={a.id}>
            <Action
              name={a.name}
              description={a.description}
              values={a.values}
              onSubmit={formState =>
                submitAction({ actionId: a.id, formState })
              }
            />
            {actionData[a.id] ? (
              <ActionDetails data={actionData[a.id]} />
            ) : (
              <button onClick={() => fetchActionData(a.id)}>
                Get Latest Actions
              </button>
            )}
          </div>
        ))
      ) : (
        <p>No Actions found...</p>
      )}
    </div>
  )
}

export default Dashboard
