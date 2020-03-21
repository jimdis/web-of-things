import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { Card, Button, Spin } from 'antd'
import { EyeFilled, EditFilled } from '@ant-design/icons'
import { ICreatedAction, ISubmitAction } from '../api/types'
import { IResource } from './useDashboard'
import useWs from '../api/useWs'
import ActionDetails from './ActionDetails'
import ActionSubmit from './ActionSubmit'
import LiveIcon from './LiveIcon'

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

  const ws = useWs(endpoint)

  const latestData = ws.latestData as ICreatedAction

  const connectionStatus = ws.connectionStatus()

  useEffect(() => {
    try {
      setLoading(true)
      fetchActionData(id).then(aData => {
        setData(aData)
        setLoading(false)
      })
    } catch (e) {
      setLoading(false)
    }
  }, [fetchActionData, id])

  useEffect(() => {
    if (latestData?.timestamp) {
      setData(d => [
        latestData,
        ...d
          .filter(d => d.id !== latestData.id)
          .sort((a, b) => (moment(a.timestamp).isBefore(b.timestamp) ? 1 : -1)),
      ])
    }
  }, [latestData])

  return (
    <Card
      actions={[
        <Button
          onClick={() => setShowDetails(!showDetails)}
          icon={<EyeFilled />}
        >
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
      <Card.Meta
        title={
          <div style={{ display: 'flex' }}>
            <span style={{ flex: 1 }}>{name || id}</span>
            <LiveIcon
              status={
                connectionStatus === 'Open'
                  ? 'active'
                  : connectionStatus === 'Connecting'
                  ? 'connecting'
                  : 'inactive'
              }
            />
          </div>
        }
        description={description}
        style={{ marginBottom: 8 }}
      />
      {showDetails ? loading ? <Spin /> : <ActionDetails data={data} /> : null}
      {showSubmit && values && (
        <ActionSubmit
          title={description}
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
