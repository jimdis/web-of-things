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
import ActionSubmit from './ActionSubmit'

type Props = {
  id: string
  name?: string
  description?: string
  values?: Record<string, IValue>
  data?: ICreatedAction[]
  fetchActionData: (id: string) => void
  submitAction: (a: ISubmitAction) => Promise<ICreatedAction>
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
  const [showDetails, setShowDetails] = useState(false)
  const [showSubmit, setShowSubmit] = useState(false)

  const handleToggleDetails = () => {
    if (!data.length) {
      fetchActionData(id)
    }
    setShowDetails(!showDetails)
  }

  return (
    <Card
      title={name || id}
      actions={[
        <Button onClick={handleToggleDetails} icon={<EyeFilled />}>
          {showDetails ? 'Hide ' : 'Show '} latest actions
        </Button>,
        <Button
          type="primary"
          onClick={() => setShowSubmit(true)}
          icon={<EditFilled />}
        >
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
