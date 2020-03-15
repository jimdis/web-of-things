import React from 'react'
import moment from 'moment'
import { VictoryTheme, VictoryLine, VictoryChart } from 'victory'
import { CreatedValueType, IValue, ICreatedValue } from '../api/types'

type Props = {
  values: Record<string, IValue>
  data: ICreatedValue[]
}

const PropertyDetails = ({ values, data }: Props) => {
  if (!data.length) {
    return <div>No data available</div>
  }

  const createChartData = (key: string) =>
    data.map(d => ({
      x: moment(d.timestamp).format('H:mm:ss'),
      y: d[key] as number,
    }))

  const displayBoolean = (value: boolean) => (
    <p>{value ? '\u2705' : '\u274C'}</p>
  )

  return (
    <div>
      {Object.keys(values).map(k => (
        <div key={k}>
          {typeof data[0][k] === 'number' ? (
            <LineChart data={createChartData(k)} />
          ) : typeof data[0][k] === 'boolean' ? (
            displayBoolean(data[0][k] as boolean)
          ) : (
            <p>data[0][k]</p>
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
  return (
    <div>
      <VictoryChart theme={VictoryTheme.material}>
        <VictoryLine data={data} />
      </VictoryChart>
    </div>
  )
}

export default PropertyDetails
