import React from 'react'
import moment from 'moment'
import { Card, Tag, Divider, Statistic, Empty } from 'antd'
import { CalendarTwoTone } from '@ant-design/icons'
import { ICreatedValue, IValue, CreatedValueType } from '../api/types'

type Props = {
  name?: string
  description?: string
  tags?: string[]
  values?: Record<string, IValue>
  latestValues?: ICreatedValue
}

const PropertySummary = ({
  name = 'No name provided',
  description = 'No description provided',
  tags = [],
  values,
  latestValues,
}: Props) => {
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
    <Card title={name}>
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
        </div>
      ) : (
        <Empty />
      )}
    </Card>
  )
}

export default PropertySummary
