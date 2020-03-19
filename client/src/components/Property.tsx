import React, { useState, useEffect } from 'react'
import { useSpring, animated } from 'react-spring'
import moment from 'moment'
import {
  Button,
  Card,
  Tag,
  Divider,
  Statistic,
  Empty,
  Spin,
  Tooltip,
} from 'antd'
import {
  EyeFilled,
  CheckCircleFilled,
  InfoCircleTwoTone,
} from '@ant-design/icons'
import { ICreatedValue, CreatedValueType } from '../api/types'
import { IResource } from './useDashboard'
import useWs from '../api/useWs'
import PropertyDetails from './PropertyDetails'
import Timestamp from './Timestamp'

type Props = {
  resource: IResource
  fetchPropertyData: (id: string) => Promise<ICreatedValue[]>
}

const Property = ({ resource, fetchPropertyData }: Props) => {
  const [showDetails, setShowDetails] = useState<boolean>(false)
  const [data, setData] = useState<ICreatedValue[]>([])
  const [loading, setLoading] = useState(false)

  const {
    id,
    name,
    description = 'No description provided',
    tags = [],
    values,
    endpoint,
  } = resource

  const ws = useWs(endpoint)

  const latestData = ws.latestData as ICreatedValue

  const connectionStatus = ws.connectionStatus()

  const springProps = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    reset: true,
  })

  useEffect(() => {
    try {
      setLoading(true)
      fetchPropertyData(id).then(pData => {
        setData(pData)
        setLoading(false)
      })
    } catch (e) {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (latestData) {
      setData(
        [...data, latestData].sort((a, b) =>
          moment(a.timestamp).isBefore(b.timestamp) ? 1 : -1
        )
      )
    }
  }, [latestData])

  console.log(data)

  return (
    <Card
      title={
        <div style={{ display: 'flex' }}>
          <span style={{ flex: 1 }}>{name || id}</span>
          {connectionStatus === 'Open' && (
            <span>
              <Tooltip title="Live updates enabled">
                <CheckCircleFilled style={{ color: 'green' }} />
              </Tooltip>
            </span>
          )}
        </div>
      }
      actions={[
        <Button
          onClick={() => setShowDetails(!showDetails)}
          icon={<EyeFilled />}
        >
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
      {loading ? (
        <Spin />
      ) : values && data.length ? (
        <div>
          {Object.keys(values).map(key => (
            <Statistic
              key={key}
              title={
                <div>
                  <span style={{ marginRight: 8 }}>{values[key].name}</span>
                  {values[key].description && (
                    <span>
                      <Tooltip title={values[key].description}>
                        <InfoCircleTwoTone />
                      </Tooltip>
                    </span>
                  )}
                </div>
              }
              value={displayValue(data[0][key])}
              // suffix={}
              formatter={value => (
                <animated.div style={springProps}>
                  {value} {values[key].unit}
                </animated.div>
              )}
            />
          ))}
          <Timestamp date={data[0].timestamp} />
          {showDetails && (
            <>
              <Divider />
              <PropertyDetails values={values} data={data} />
            </>
          )}
        </div>
      ) : (
        <Empty description="No Data Available" />
      )}
    </Card>
  )
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

export default Property
