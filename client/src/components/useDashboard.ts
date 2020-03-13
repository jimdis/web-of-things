import { useState, useEffect } from 'react'
import { IProperty, IEndpoints, fetchData } from '../api/thingApi'

const useDashboard = () => {
  const [properties, setProperties] = useState<IProperty[]>([])
  const [endpoints, setEndpoints] = useState({})
  const [error, setError] = useState<String | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  // useEffect(() => {
  //   fetchProperties('/properties')
  //     .then(properties => {
  //       setProperties(properties)
  //     })
  //     .catch((e: Error) => setError(e.message))
  // }, [])

  return { properties, error }
}
export default useDashboard
