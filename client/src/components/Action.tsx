import React, { useState } from 'react'
import moment from 'moment'
import {
  ICreatedValue,
  IValue,
  CreatedValueType,
  FormState,
} from '../api/types'

type Props = {
  name?: string
  description?: string
  values?: Record<string, IValue>
  latestValues?: ICreatedValue
  onSubmit: (v: FormState) => void
}

const Action = ({
  name,
  description,
  values,
  latestValues,
  onSubmit,
}: Props) => {
  const [formState, setFormState] = useState<FormState>({})

  const handleChange = (e: any) => {
    setFormState({ ...formState, [e.target.id]: e.target.value })
  }
  const handleSubmit = (e: any) => {
    e.preventDefault()
    onSubmit(formState)
  }
  const renderInput = (id: string) => {
    const value = values?.[id]
    if (value?.type === 'boolean') {
      return <div>RENDER TOGGLE HERE</div> // TODO: IMPLEMENT
    }
    if (value?.type === 'float' || value?.type === 'integer') {
      return <div>RENDER number input HERE</div> // TODO: IMPLEMENT
    }
    if (value?.type === 'string') {
      return (
        <input
          id={id}
          type="text"
          value={(formState[id] as string) ?? ''}
          onChange={handleChange}
        />
      )
    }
  }

  //TODO: Continue here: show actions rather than latest property values!
  const displayValue = (value: CreatedValueType) => {
    if (typeof value === 'number') {
      return Math.round(value)
    }
    if (typeof value === 'boolean') {
      return value ? '\u2705' : '\u274C'
    }
    return value
  }
  return (
    <div>
      <h3>{name}</h3>
      <h4>{description}</h4>
      <h4>Actions</h4>
      {values ? (
        <div>
          <form onSubmit={handleSubmit}>
            {Object.keys(values).map(
              key =>
                values[key].required && <div key={key}>{renderInput(key)}</div>
            )}
            <input type="submit" value="Submit" />
          </form>
          <h4>Latest value</h4>
          {Object.keys(values).map(key => (
            <div key={key}>
              {latestValues && latestValues.timestamp ? (
                <div>
                  <p>
                    {moment(latestValues.timestamp).format(
                      'YYYY-MM-DD H:mm:ss'
                    )}
                  </p>
                  <p>
                    {displayValue(latestValues[key])} {values[key].unit}
                  </p>
                </div>
              ) : (
                <p>No Data available</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No Data available</p>
      )}
    </div>
  )
}

export default Action
