import React from 'react'
import moment from 'moment'
import { List, Empty } from 'antd'
import { ICreatedAction, CreatedValueType } from '../api/types'
import Timestamp from './Timestamp'

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
    <List
      header="Latest actions"
      dataSource={data.map(d =>
        Object.keys(d.value)
          .map(k => `${k}: ${showValue(d.value[k])}`)
          .join('|')
      )}
      renderItem={(item, i) => (
        <List.Item>
          <Timestamp date={data[i].timestamp} format="H:mm:ss" />
          {item}
          <p>Status: {data[i].status}</p>
        </List.Item>
      )}
    />
  )
}

export default ActionDetails
