import React, { useState } from 'react'
import { IValue, FormState } from '../api/types'

type Props = {
  name?: string
  description?: string
  values?: Record<string, IValue>
  onSubmit: (v: FormState) => void
}

const Action = ({ name, description, values, onSubmit }: Props) => {
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
      return (
        <input
          id={id}
          type="number"
          min={value?.minValue ?? 0}
          max={value?.maxValue ?? 100}
          value={(formState[id] as string) ?? 0}
          onChange={handleChange}
        />
      )
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
                values[key].required && (
                  <div key={key}>
                    <p>{values[key].name}</p>
                    <p>{values[key].description}</p>
                    {renderInput(key)}
                  </div>
                )
            )}
            <input type="submit" value="Submit" />
          </form>
        </div>
      ) : (
        <p>No Data available</p>
      )}
    </div>
  )
}

export default Action
