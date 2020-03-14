import React from 'react'
import moment from 'moment'
import { VictoryTheme, VictoryLine, VictoryChart } from 'victory'
import { IProperty, ICreatedValue } from '../api/types'

type Props = {
  values: ICreatedValue[]
  unit: string
}

const getNumber = (input: any) => {
  if (typeof input === 'number') {
    return input
  }
  if (typeof input === 'string') {
    return parseFloat(input)
  }
}

const PropertyDetails = ({ values, unit }: Props) => {
  if (!values.length) {
    return <div>No Data!</div>
  }
  const keys = Object.keys(values[0]).filter(k => k !== 'timestamp')
  console.log(keys)
  if (keys.length === 1 && getNumber(values[0][keys[0]])) {
    const data = values.map(v => ({
      x: moment(v.timestamp).format('H:mm:ss'),
      y: getNumber(v[keys[0]]),
    }))
    console.log(data)
    return (
      <div>
        <VictoryChart theme={VictoryTheme.material}>
          <VictoryLine data={data} />
        </VictoryChart>
      </div>
    )
  }
  return <div>Not suitable for chart..</div>
}

export default PropertyDetails
