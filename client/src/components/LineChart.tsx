import React from 'react'
import { VictoryTheme, VictoryLine, VictoryChart, VictoryAxis } from 'victory'

type LCProps = {
  data: {
    x: string
    y: number
  }[]
}
const LineChart = ({ data }: LCProps) => {
  let domain
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
        <VictoryAxis dependentAxis />
        <VictoryAxis tickCount={3} />
      </VictoryChart>
    </div>
  )
}

export default LineChart
