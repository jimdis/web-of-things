import React from 'react'
import moment from 'moment'
import { VictoryTheme, VictoryLine, VictoryChart, VictoryAxis } from 'victory'
import { List } from 'antd'
import { CreatedValueType, IValue, ICreatedValue } from '../api/types'
import Timestamp from './Timestamp'

type Props = {
  values: Record<string, IValue>
  data: ICreatedValue[]
}

const PropertyDetails = ({ values, data }: Props) => {
  if (!data.length) {
    return <div>No data available</div>
  }

  const createChartData = (key: string) =>
    data
      .sort((a, b) => (moment(a.timestamp).isBefore(b.timestamp) ? -1 : 1))
      .map(d => ({
        x: moment(d.timestamp).format('H:mm:ss'),
        y: d[key] as number,
      }))

  const displayBoolean = (value: boolean) => (value ? '\u2705' : '\u274C')

  return (
    <div>
      <h4>Latest values</h4>
      {Object.keys(values).map(k => (
        <div key={k}>
          {typeof data[0][k] === 'number' ? (
            <LineChart data={createChartData(k)} />
          ) : (
            <List
              dataSource={data.map(d =>
                typeof d[k] === 'boolean'
                  ? displayBoolean(d[k] as boolean)
                  : d[k]
              )}
              renderItem={(item, i) => (
                <List.Item>
                  <Timestamp date={data[i].timestamp} /> {item}
                </List.Item>
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}

type LCProps = {
  data: {
    x: string
    y: number
  }[]
}
const LineChart = ({ data }: LCProps) => {
  console.log('LC DATA', data)
  return (
    <div>
      <VictoryChart theme={VictoryTheme.material}>
        <VictoryLine
          data={data}
          style={{
            data: {
              stroke: '#1890ff',
            },
          }}
        />
        <VictoryAxis dependentAxis />
        <VictoryAxis tickCount={3} />
      </VictoryChart>
    </div>
  )
}

export default PropertyDetails
