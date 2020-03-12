//TODO: Add base url
import axios from 'axios'
const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? '!!!!!!!INSERT PROD URL HERE!!!!'
    : 'http://localhost:5000'

//endpoints according to http://model.webofthings.io/#web-things-model
export const endpoints = {
  root: BASE_URL,
  model: BASE_URL + '/model',
  properties: BASE_URL + '/properties',
  property: (id: string) => BASE_URL + '/properties/' + id,
  actions: BASE_URL + '/actions',
  action: (id: string) => BASE_URL + '/actions/' + id,
  actionExecution: (id: string, actionId: string) =>
    BASE_URL + '/actions/' + id + '/' + actionId,
}

// http://model.webofthings.io/#common-constructs
export type ThingResource = {
  id: string
  createdAt: string | undefined
  updatedAt: string | undefined
  name: string | undefined
  description: string | undefined
  tags: string[] | undefined
  customFields:
    | {
        [key: string]: any
      }
    | undefined
  links: ThingLinks | undefined
}

// http://model.webofthings.io/#links
export type ThingLinks = {
  [key: string]: {
    link: string
    title: string
  }
}

// http://model.webofthings.io/#values
export type ThingValue = {
  [key: string]: {
    name: string | undefined
    description: string | undefined
    type: string | undefined
    unit: string | undefined
    required: boolean | undefined
    minValue: number | undefined
    maxValue: number | undefined
    enum: { [key: string]: string } | undefined
  }
}

// http://model.webofthings.io/#retrieve-recent-executions-of-a-specific-action
export type ThingActionExecution = {
  status: 'pending' | 'executing' | 'completed' | 'failed'
} & ThingResource

export const fetchRoot = async () => {
  const { data } = await axios.get<ThingResource>(endpoints.root)
  return data
}

export const fetchModel = async () => {
  const { data } = await axios.get<ThingResource>(endpoints.model)
  return data
}

export const fetchProperties = async () => {
  const { data } = await axios.get<ThingResource[]>(endpoints.properties)
  return data
}

export const fetchProperty = async (id: string) => {
  //TODO: continue here. Determine static type of a single property.
  const { data } = await axios.get<ThingResource>(endpoints.property(id))
  return data
}
