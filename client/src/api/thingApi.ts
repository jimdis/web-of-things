//TODO: Add base url
import axios from 'axios'
import parseLink from 'parse-link-header'
const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? '!!!!!!!INSERT PROD URL HERE!!!!'
    : 'http://localhost:5000'

export interface IEndpoints {
  properties?: string
}

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
export interface IThing {
  id: string
  createdAt?: string
  updatedAt?: string
  name?: string
  description?: string
  tags?: string[]
  customFields?: {
    [k: string]: any
  }
  links?: {
    model?: ILink
    properties?: {
      link?: string
      title?: string
      resources?: {
        [k: string]: {
          name?: string
          description?: string
          values?: {
            [k: string]: {
              name?: string
              description?: string
              [k: string]: any
            } & IValue
          }
          [k: string]: any
        }
      }
    }
    actions?: {
      link?: string
      title?: string
      resources?: {
        [k: string]: {
          values?: {
            [k: string]: any
          }
          [k: string]: any
        }
      }
    }
    product?: ILink
    type?: ILink
    help?: ILink
    ui?: ILink
    [k: string]: any
  }
  [k: string]: any
}

// http://model.webofthings.io/#links
export interface ILink {
  link: string
  title: string
  [k: string]: any
}
// http://model.webofthings.io/#values
export interface IValue {
  name?: string
  description?: string
  type?: 'integer' | 'float' | 'boolean' | 'string'
  unit?: string
  required?: boolean
  minValue?: number
  maxValue?: number
  enum?: { [k: string]: any }
  customFields?: {
    [k: string]: any
  }
}

export interface ICreatedValue {
  timestamp: string
  [k: string]: number | boolean | string
}

export interface IProperty extends IThing {
  values: ICreatedValue
}

// http://model.webofthings.io/#retrieve-recent-executions-of-a-specific-action
export interface IActionExecution {
  status: 'pending' | 'executing' | 'completed' | 'failed'
}

export const fetchData = async (endpoint: string = '/') => {
  const res = await axios.get(BASE_URL + endpoint)
  const links = parseLink(res.headers.link)
  console.log(links)
  // return data
}

// export const fetchModel = async () => {
//   const { data } = await axios.get<ThingResource>(endpoints.model)
//   return data
// }

export const fetchProperties = async (endpoint: string) => {
  const { data } = await axios.get<IProperty[]>(BASE_URL + endpoint)
  return data
}

// export const fetchProperty = async (id: string) => {
//   const { data } = await axios.get<{ [k: string]: any }>(endpoints.property(id))
//   return data
// }

// export const fetchActions = async () => {
//   const { data } = await axios.get<ThingActions[]>(endpoints.properties)
//   return data
// }
