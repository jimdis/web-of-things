import React, { useState, useEffect } from 'react'
import { Card, Button, Tag, Divider, Statistic, Empty, Spin } from 'antd'
import { EyeFilled, EditFilled, InfoCircleTwoTone } from '@ant-design/icons'
import { IValue, ICreatedAction, FormState, ISubmitAction } from '../api/types'
import { IResource } from './useDashboard'
import useWs from '../api/useWs'
import ActionDetails from './ActionDetails'
import ActionSubmit from './ActionSubmit'

type Props = {
  resource: IResource
  fetchActionData: (id: string) => Promise<ICreatedAction[]>
  submitAction: (a: ISubmitAction) => Promise<ICreatedAction>
}

const Action = ({ resource, fetchActionData, submitAction }: Props) => {
  const [data, setData] = useState<ICreatedAction[]>([])
  const [loading, setLoading] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [showSubmit, setShowSubmit] = useState(false)
  const {
    id,
    name,
    description = 'No description provided',
    values,
    endpoint,
  } = resource

  const { connectionStatus, latestData } = useWs(endpoint)

  useEffect(() => {
    if (latestData) {
      const action = latestData as ICreatedAction
      setData([action, ...data.filter(d => d.id !== action.id)])
    }
  }, [latestData])

  console.log(connectionStatus)
  console.log(latestData)

  const handleToggleDetails = async () => {
    setShowDetails(!showDetails)
    try {
      setLoading(true)
      const actionData = await fetchActionData(id)
      setData(actionData)
      setLoading(false)
    } catch (e) {
      setLoading(false)
    }
  }

  return (
    <Card
      title={name || id}
      actions={[
        <Button onClick={handleToggleDetails} icon={<EyeFilled />}>
          Latest actions
        </Button>,
        <Button
          type="primary"
          onClick={() => setShowSubmit(true)}
          icon={<EditFilled />}
        >
          New action
        </Button>,
      ]}
    >
      <h4>
        <span style={{ marginRight: 8 }}>
          <InfoCircleTwoTone />
        </span>
        {description}
      </h4>
      {showDetails ? loading ? <Spin /> : <ActionDetails data={data} /> : null}
      {showSubmit && values && (
        <ActionSubmit
          id={id}
          values={values}
          open={showSubmit}
          onClose={() => setShowSubmit(false)}
          submitAction={submitAction}
        />
      )}
    </Card>
  )
}

export default Action
