import React, { useState } from 'react'
import { Card, Button, Tag, Divider, Statistic, Empty } from 'antd'
import {
  EyeFilled,
  EditFilled,
  InfoCircleTwoTone,
  ApiOutlined,
} from '@ant-design/icons'
import { IValue, ICreatedAction, FormState, ISubmitAction } from '../api/types'
import ActionDetails from './ActionDetails'

type Props = {
  id: string
  name?: string
  description?: string
  values?: Record<string, IValue>
  data?: ICreatedAction[]
  fetchActionData: (id: string) => void
  submitAction: (a: ISubmitAction) => void
}

const Action = ({
  id,
  name,
  description = 'No description provided',
  values,
  data = [],
  fetchActionData,
  submitAction,
}: Props) => {
  const [showDetails, setShowDetails] = useState<boolean>(false)
  const [formState, setFormState] = useState<FormState>({})

  const handleChange = (e: any) => {
    setFormState({ ...formState, [e.target.id]: e.target.value })
  }
  const handleSubmit = (e: any) => {
    e.preventDefault()
    submitAction({ actionId: id, formState })
  }

  const handleToggleDetails = () => {
    if (!data.length) {
      fetchActionData(id)
    }
    setShowDetails(!showDetails)
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
    <Card
      title={name || id}
      actions={[
        <Button onClick={handleToggleDetails} icon={<EyeFilled />}>
          {showDetails ? 'Hide ' : 'Show '} latest actions
        </Button>,
        <Button type="primary" icon={<EditFilled />}>
          Submit action
        </Button>,
      ]}
    >
      <h4>
        <span style={{ marginRight: 8 }}>
          <InfoCircleTwoTone />
        </span>
        {description}
      </h4>
      {showDetails && <ActionDetails data={data} />}
      {/* <h4>Actions</h4>
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
        <Empty description="No Actions Available" />
      )} */}
    </Card>
  )
}

export default Action
