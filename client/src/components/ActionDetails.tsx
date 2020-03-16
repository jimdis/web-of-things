import React from 'react'
import moment from 'moment'
import { Card, Button, Tag, Divider, Statistic, Empty } from 'antd'
import { ICreatedAction, CreatedValueType } from '../api/types'

type Props = {
  data: ICreatedAction[]
}

const ActionDetails = ({ data }: Props) => {
  if (!data.length) {
    return <Empty description="No action data available" />
  }

  const showValue = (value: CreatedValueType) => {
    if (typeof value === 'boolean') {
      return value ? '\u2705' : '\u274C'
    }
    return value
  }

  return (
    <div>
      <ul>
        {data.map(d => (
          <li key={d.timestamp}>
            {moment(d.timestamp).format('H:mm:ss')}:{' '}
            <ul>
              {Object.keys(d.value).map(k => (
                <li key={k}>
                  {k}: {showValue(d.value[k])}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ActionDetails
