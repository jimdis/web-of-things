import { useState, useEffect } from 'react'
import ax from 'axios'
import parseLink, { Links } from 'parse-link-header'
import { IThing, ISubmitAction, ICreatedAction } from './types'
import { API_URL } from '../config'

const axios = ax.create({
  baseURL: API_URL,
  headers: { Accept: 'application/json' },
})

const useApi = () => {
  const [error, setError] = useState<String | null>(null)
  const [endpoints, setEndpoints] = useState<Links | null>(null)
  const [model, setModel] = useState<IThing | null>(null)

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const res = await axios.get('')
        const links = parseLink(res.headers.link)
        setEndpoints(links)
      } catch (e) {
        setError(e.message)
      }
    }
    fetchLinks()
  }, [])

  useEffect(() => {
    const fetchModel = async (endpoint: string) => {
      try {
        const { data } = await axios.get<IThing>(endpoint)
        // In case root url failed to provide endpoint links
        if (
          !endpoints &&
          data?.links?.properties?.link &&
          data?.links?.actions?.link
        ) {
          setEndpoints({
            model: {
              rel: 'model',
              url: endpoint,
            },
            properties: {
              rel: 'properties',
              url: data.links.properties.link,
            },
            actions: {
              rel: 'actions',
              url: data.links.actions.link,
            },
          })
        }
        setModel(data)
      } catch (e) {
        setError(e.message)
      }
    }
    if (endpoints?.model) {
      fetchModel(endpoints.model.url)
    } else {
      fetchModel('/model') // in case root URL did not return links.. try /model
    }
  }, [endpoints])

  const fetchData = async (endpoint: string) => {
    try {
      const { data } = await axios.get(endpoint)
      return data
    } catch (e) {
      setError(e.message)
    }
  }

  const postAction = async (action: ISubmitAction) => {
    try {
      if (!endpoints?.actions) {
        throw new Error('Endpoint does not exist')
      }
      const url = `${endpoints.actions.url}/${action.actionId}`
      const res = await axios.post(url, action.formState, {
        headers: {
          'X-API-Key': '51dae9035fe242f7b252bed2b65dc33f',
        },
      })
      const location = res.headers.location
      if (!location) {
        throw new Error('Did not receive location of new action')
      }
      const createdAction = await fetchData(location)
      return createdAction as ICreatedAction
    } catch (e) {
      setError(e.message)
      return Promise.reject(e)
    }
  }

  return {
    error,
    endpoints,
    model,
    fetchData,
    postAction,
    clearError: () => setError(null),
  }
}

export default useApi
