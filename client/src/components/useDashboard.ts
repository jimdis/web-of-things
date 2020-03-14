import { useState, useEffect } from 'react'
import { IThing, IProperty } from '../api/types'
import useApi from '../api/useApi'

const useDashboard = () => {
  const [properties, setProperties] = useState<IProperty[]>([])

  const { endpoints, fetchData, model, error } = useApi()

  useEffect(() => {
    const fetchProperties = async () => {
      if (endpoints?.properties) {
        const data = (await fetchData(endpoints.properties.url)) as
          | IProperty[]
          | undefined
        setProperties(data ?? [])
      }
    }
    fetchProperties()
  }, [endpoints])

  return { model, properties, error }
}
export default useDashboard
