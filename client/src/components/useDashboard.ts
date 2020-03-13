import { useState, useEffect } from 'react'
import { ThingResource, fetchProperties } from '../api/thingApi'
const useDashboard = () => {
  const [properties, setProperties] = useState<ThingResource[]>([])
  const [error, setError] = useState<String | null>(null)

  useEffect(() => {
    fetchProperties()
      .then(properties => {
        setProperties(properties)
      })
      .catch((e: Error) => setError(e.message))
  }, [])

  useEffect(() => {
    if (properties.length) {
    }
  }, [properties])

  return { properties, error }
}
export default useDashboard
