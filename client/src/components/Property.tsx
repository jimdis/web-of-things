import React, { useState } from 'react'
import moment from 'moment'
import { Button, Card, Tag, Divider, Statistic, Empty, Spin } from 'antd'
import { EyeFilled, CalendarTwoTone } from '@ant-design/icons'
import { ICreatedValue, IValue, CreatedValueType } from '../api/types'
import PropertyDetails from './PropertyDetails'
import Timestamp from './Timestamp'

type Props = {
  id: string
  name?: string
  description?: string
  tags?: string[]
  values?: Record<string, IValue>
  latestValues?: ICreatedValue
  fetchPropertyData: (id: string) => Promise<ICreatedValue[]>
}

const Property = ({
  id,
  name,
  description = 'No description provided',
  tags = [],
  values,
  latestValues,
  fetchPropertyData,
}: Props) => {
  const [showDetails, setShowDetails] = useState<boolean>(false)
  const [data, setData] = useState<ICreatedValue[]>([])
  const [loading, setLoading] = useState(false)

  const handleToggleDetails = async () => {
    setShowDetails(!showDetails)
    if (!data.length) {
      try {
        setLoading(true)
        const propertyData = await fetchPropertyData(id)
        setData(propertyData)
        setLoading(false)
      } catch (e) {
        setLoading(false)
      }
    }
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
          <Timestamp date={latestValues.timestamp} />
          {showDetails ? (
            <>
              <Divider />
              {loading ? (
                <Spin />
              ) : (
                <PropertyDetails values={values} data={data} />
              )}
            </>
          ) : null}
        </div>
      ) : (
        <Empty description="No Data Available" />
      )}
    </Card>
  )
}

export default Property
