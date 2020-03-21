import { useState, useEffect } from 'react'
import {
  ICreatedValue,
  ICreatedAction,
  ISubmitAction,
  IValue,
} from '../api/types'
import useApi from '../api/useApi'

export interface IResource {
  id: string
  name?: string
  description?: string
  tags?: string[]
  endpoint: string
  values?: {
    [k: string]: IValue
  }
}

const useDashboard = () => {
  const [loading, setLoading] = useState(true)

  const {
    endpoints,
    fetchData,
    model,
    postAction,
    error,
    clearError,
  } = useApi()

  useEffect(() => {
    if (model) {
      setLoading(false)
    }
  }, [model])

  useEffect(() => {
    if (error) {
      setLoading(false)
    }
  }, [error])

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
    fetchPropertyData,
    fetchActionData,
    submitAction,
    error,
    clearError,
  }
}
export default useDashboard
