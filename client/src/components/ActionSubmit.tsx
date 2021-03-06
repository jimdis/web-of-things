import React, { useState } from 'react'
import {
  Card,
  Modal,
  Input,
  InputNumber,
  Switch,
  Button,
  Result,
  List,
} from 'antd'
import { IValue, ICreatedAction, FormState, ISubmitAction } from '../api/types'
import Timestamp from './Timestamp'

type Props = {
  title: string
  id: string
  open: boolean
  onClose: () => void
  values: Record<string, IValue>
  submitAction: (a: ISubmitAction) => Promise<ICreatedAction>
}

const ActionSubmit = ({
  title,
  id,
  open,
  onClose,
  values,
  submitAction,
}: Props) => {
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
          autoFocus
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
          autoFocus
          id={id}
          value={(formState[id] as string) ?? ''}
          onChange={handleChange}
        />
      )
    }
  }

  return (
    <Modal
      title="Submit action"
      visible={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Submit"
      okButtonProps={{ loading }}
      footer={
        createdAction || error ? (
          <Button onClick={onClose}>Close</Button>
        ) : (
          undefined
        )
      }
    >
      {createdAction || error ? (
        <Result
          status={error ? 'error' : 'success'}
          title={error ? 'Something went wrong' : 'Your action was created'}
          extra={
            createdAction && (
              <Card title="Action details">
                <h4>ID: {createdAction.id}</h4>
                <Timestamp date={createdAction.timestamp} />
                <List
                  header="Value"
                  dataSource={Object.keys(createdAction.value).map(
                    k => `${[k]}: ${createdAction.value[k]}`
                  )}
                  renderItem={item => <List.Item>{item}</List.Item>}
                />
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
                  <h4>{title}</h4>
                  <p>{values[key].name}</p>
                  <p>{values[key].description}</p>
                  {renderInput(key)}
                </div>
              )
          )}
        </div>
      )}
    </Modal>
  )
}

export default ActionSubmit
