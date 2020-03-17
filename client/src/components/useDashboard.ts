import { useState, useEffect } from 'react'
import {
  IProperty,
  ICreatedValue,
  ICreatedAction,
  ISubmitAction,
} from '../api/types'
import useApi from '../api/useApi'

const useDashboard = () => {
  const [properties, setProperties] = useState<IProperty[]>([])
  const [propertyData, setPropertyData] = useState<
    Record<string, ICreatedValue[]>
  >({})
  const [actionData, setActionData] = useState<
    Record<string, ICreatedAction[]>
  >({})

  const {
    endpoints,
    fetchData,
    model,
    postAction,
    error,
    clearError,
  } = useApi()

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

  const fetchActionData = async (id: string) => {
    if (endpoints?.actions) {
      const data = (await fetchData(`${endpoints.actions.url}/${id}`)) as
        | ICreatedAction[]
        | undefined
      if (data) {
        setActionData({
          ...actionData,
          [id]: data,
        })
      }
    }
  }

  const submitAction = async (action: ISubmitAction) => {
    const res = await postAction(action)
    return res
  }

  return {
    model,
    properties,
    propertyData,
    actionData,
    fetchPropertyData,
    fetchActionData,
    submitAction,
    error,
    clearError,
  }
}
export default useDashboard
