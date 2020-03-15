import { useState, useEffect } from 'react'
import { IThing, IProperty, ICreatedValue, ISubmitAction } from '../api/types'
import useApi from '../api/useApi'

const useDashboard = () => {
  const [properties, setProperties] = useState<IProperty[]>([])
  const [propertyData, setPropertyData] = useState<
    Record<string, ICreatedValue[]>
  >({})

  const { endpoints, fetchData, model, postAction, error } = useApi()

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

  const fetchPropertyData = async (id: string) => {
    if (endpoints?.properties) {
      const data = (await fetchData(`${endpoints.properties.url}/${id}`)) as
        | ICreatedValue[]
        | undefined
      if (data) {
        setPropertyData({
          ...propertyData,
          [id]: data,
        })
      }
    }
  }

  const submitAction = (action: ISubmitAction) => {
    postAction(action)
  }

  return {
    model,
    properties,
    propertyData,
    fetchPropertyData,
    submitAction,
    error,
  }
}
export default useDashboard
