//TODO: Add base url
import { useState, useEffect } from 'react'
import axios from 'axios'
import parseLink, { Links } from 'parse-link-header'
import { IEndpoints, IThing, IProperty } from './types'
const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? '!!!!!!!INSERT PROD URL HERE!!!!'
    : 'http://localhost:5000'

const useApi = () => {
  const [error, setError] = useState<String | null>(null)
  const [endpoints, setEndpoints] = useState<Links | null>(null)
  const [model, setModel] = useState<IThing | null>(null)

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const res = await axios.get(BASE_URL)
        const links = parseLink(res.headers.link)
        setEndpoints(links)
      } catch (e) {
        setError(e.message)
      }
    }
    fetchLinks()
  }, [])

  useEffect(() => {
    const fetchModel = async (url: string) => {
      try {
        const { data } = await axios.get<IThing>(url)
        setModel(data)
      } catch (e) {
        setError(e.message)
      }
    }
    if (endpoints?.model) {
      fetchModel(BASE_URL + endpoints.model.url)
    }
  }, [endpoints])

  const fetchData = async (endpoint: string) => {
    try {
      const { data } = await axios.get(BASE_URL + endpoint)
      return data
    } catch (e) {
      setError(e.message)
    }
  }

  return {
    error,
    endpoints,
    model,
    fetchData,
  }
}

export default useApi