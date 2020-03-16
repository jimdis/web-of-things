//http://model.webofthings.io/#resources
export interface IEndpoints {
  model?: string
  properties?: string
  actions?: string
  product?: string
  type?: string
  help?: string
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
            [k: string]: IValue
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
            [k: string]: IValue
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
  [k: string]: CreatedValueType
}

export type CreatedValueType = number | boolean | string

export interface IProperty extends IThing {
  values: ICreatedValue
}

// http://model.webofthings.io/#retrieve-recent-executions-of-a-specific-action
export interface ICreatedAction extends IThing {
  timestamp: string
  status: 'pending' | 'executing' | 'completed' | 'failed'
  value: {
    [k: string]: CreatedValueType
  }
}

export interface ISubmitAction {
  actionId: string
  formState: FormState
}

export type FormState = {
  [key: string]: CreatedValueType
}
