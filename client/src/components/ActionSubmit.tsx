import React, { useState } from 'react'
import moment from 'moment'
import {
  Card,
  Drawer,
  Input,
  InputNumber,
  Switch,
  Button,
  Result,
  Tag,
  Divider,
  Statistic,
  Empty,
} from 'antd'
import {
  EyeFilled,
  EditFilled,
  InfoCircleTwoTone,
  ApiOutlined,
} from '@ant-design/icons'
import { IValue, ICreatedAction, FormState, ISubmitAction } from '../api/types'
import ActionDetails from './ActionDetails'
import { create } from 'domain'

type Props = {
  id: string
  open: boolean
  onClose: () => void
  values: Record<string, IValue>
  submitAction: (a: ISubmitAction) => Promise<ICreatedAction>
}

const ActionSubmit = ({ id, open, onClose, values, submitAction }: Props) => {
  const [formState, setFormState] = useState<FormState>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [createdAction, setCreatedAction] = useState<ICreatedAction | null>(
    null
  )

  const handleChange = (e: any) => {
    setFormState({ ...formState, [e.target.id]: e.target.value })
  }
  const handleSubmit = async () => {
    setError(false)
    setLoading(true)
    try {
      const actionResource = await submitAction({ actionId: id, formState })
      setCreatedAction(actionResource)
      setLoading(false)
    } catch (e) {
      setLoading(false)
      setError(true)
    }
  }

  const renderInput = (id: string) => {
    const value = values?.[id]
    if (value?.type === 'boolean') {
      return (
        <Switch
          onChange={checked =>
            handleChange({
              target: {
                id,
                value: checked,
              },
            })
          }
          checked={formState[id] as boolean}
        />
      )
    }
    if (value?.type === 'float' || value?.type === 'integer') {
      return (
        <InputNumber
          id={id}
          min={value?.minValue ?? 0}
          max={value?.maxValue ?? 100}
          step={value?.type === 'float' ? 0.1 : 1}
          value={(formState[id] as number) ?? 0}
          onChange={handleChange}
        />
      )
    }
    if (value?.type === 'string') {
      return (
        <Input
          id={id}
          value={(formState[id] as string) ?? ''}
          onChange={handleChange}
        />
      )
    }
  }

  console.log(createdAction)

  return (
    <Drawer
      title="Submit action"
      placement="bottom"
      height="80vh"
      visible={open}
      onClose={onClose}
      footer={
        <div
          style={{
            textAlign: 'right',
          }}
        >
          {createdAction || error ? (
            <Button onClick={onClose}>Close</Button>
          ) : (
            <>
              <Button onClick={onClose} style={{ marginRight: 8 }}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} type="primary" loading={loading}>
                Submit
              </Button>
            </>
          )}
        </div>
      }
    >
      <h4>Actions</h4>
      {createdAction || error ? (
        <Result
          status={error ? 'error' : 'success'}
          title={error ? 'Something went wrong' : 'Your action was created'}
          extra={
            createdAction && (
              <Card title="Action details">
                <p>id: {createdAction.id}</p>
                <p>
                  created:{' '}
                  {moment(createdAction.timestamp).format('YYYY-MM-DD H:mm:ss')}
                </p>
                <p>Value:</p>
                <ul>
                  {Object.keys(createdAction.value).map(k => (
                    <li key={k}>{[k] + ': ' + createdAction.value[k]}</li>
                  ))}
                </ul>
              </Card>
            )
          }
        />
      ) : (
        <div>
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
        </div>
      )}
    </Drawer>
  )
}

export default ActionSubmit
