import { useState, useEffect } from 'react'
import {
  IProperty,
  ICreatedValue,
  ICreatedAction,
  ISubmitAction,
} from '../api/types'
import useApi from '../api/useApi'

const useDashboard = () => {
  const [loading, setLoading] = useState(true)
  const [properties, setProperties] = useState<IProperty[]>([])

  const {
    endpoints,
    fetchData,
    model,
    postAction,
    error,
    clearError,
  } = useApi()

  useEffect(() => {
    if (model && properties) {
      setLoading(false)
    }
  }, [model, properties])

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
    try {
      if (!endpoints?.properties) {
        throw new Error()
      }
      const data = (await fetchData(`${endpoints.properties.url}/${id}`)) as
        | ICreatedValue[]
        | undefined
      if (!data) {
        throw new Error()
      }
      return data
    } catch (e) {
      return Promise.reject('Could not get property data')
    }
  }

  const fetchActionData = async (id: string) => {
    try {
      if (!endpoints?.actions) {
        throw new Error()
      }
      const data = (await fetchData(`${endpoints.actions.url}/${id}`)) as
        | ICreatedAction[]
        | undefined
      if (!data) {
        throw new Error()
      }
      return data
    } catch (e) {
      return Promise.reject('Could not get action data')
    }
  }

  const submitAction = async (action: ISubmitAction) => {
    const res = await postAction(action)
    return res
  }

  return {
    loading,
    model,
    properties,
    fetchPropertyData,
    fetchActionData,
    submitAction,
    error,
    clearError,
  }
}
export default useDashboard
