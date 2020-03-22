import React from 'react'
import { VictoryTheme, VictoryLine, VictoryChart, VictoryAxis } from 'victory'

type LCProps = {
  data: {
    x: string
    y: number
  }[]
}
const LineChart = ({ data }: LCProps) => {
  let domain: [number, number] | undefined

  const values: number[] = []
  data.forEach(d => {
    if (!values.includes(d.y)) {
      values.push(d.y)
    }
  })
  if (values.length < 2) {
    const value = values[0]
    domain = [value - 1, value + 1]
  }

  return (
    <div>
      <VictoryChart
        theme={VictoryTheme.material}
        domainPadding={{ y: 10 }}
        animate
      >
        <VictoryLine
          data={data}
          style={{
            data: {
              stroke: '#1890ff',
            },
          }}
        />
        <VictoryAxis dependentAxis domain={domain} />
        <VictoryAxis tickCount={3} />
      </VictoryChart>
    </div>
  )
}

export default LineChart
