import React, { useState } from 'react'
import moment from 'moment'
import { Button, Card, Tag, Divider, Statistic, Empty } from 'antd'
import { EyeFilled, CalendarTwoTone } from '@ant-design/icons'
import { ICreatedValue, IValue, CreatedValueType } from '../api/types'
import PropertyDetails from './PropertyDetails'

type Props = {
  id: string
  name?: string
  description?: string
  tags?: string[]
  values?: Record<string, IValue>
  data?: ICreatedValue[]
  latestValues?: ICreatedValue
  fetchPropertyData: (id: string) => void
}

const Property = ({
  id,
  name,
  description = 'No description provided',
  tags = [],
  values,
  data = [],
  latestValues,
  fetchPropertyData,
}: Props) => {
  const [showDetails, setShowDetails] = useState<boolean>(false)

  const handleToggleDetails = () => {
    if (!data.length) {
      fetchPropertyData(id)
    }
    setShowDetails(!showDetails)
  }

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
    <Card
      title={name || id}
      actions={[
        <Button onClick={handleToggleDetails} icon={<EyeFilled />}>
          {showDetails ? 'Hide ' : 'Show '} latest values
        </Button>,
      ]}
    >
      <h4>{description}</h4>
      {tags.map((tag, i) => (
        <Tag color="blue" key={tag + i}>
          {tag}
        </Tag>
      ))}
      <Divider />
      {values && latestValues?.timestamp ? (
        <div>
          {Object.keys(values).map(key => (
            //TODO: Add description popover
            <Statistic
              key={key}
              title={values[key].name}
              value={displayValue(latestValues[key])}
              suffix={values[key].unit}
            />
          ))}
          <div>
            <span style={{ marginRight: 8 }}>
              <CalendarTwoTone />
            </span>
            <span>
              {moment(latestValues.timestamp).format('YYYY-MM-DD H:mm:ss')}
            </span>
          </div>
          {showDetails && <PropertyDetails values={values} data={data} />}
        </div>
      ) : (
        <Empty description="No Data Available" />
      )}
    </Card>
  )
}

export default Property
