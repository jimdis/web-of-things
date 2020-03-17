import React from 'react'
import moment from 'moment'
import { CalendarTwoTone } from '@ant-design/icons'

type Props = {
  date: string
  format?: string
}

const Timestamp = ({ date, format = 'YYYY-MM-DD H:mm:ss' }: Props) => (
  <div>
    <span style={{ marginRight: 8 }}>
      <CalendarTwoTone />
    </span>
    <span>{moment(date).format(format)}</span>
  </div>
)

export default Timestamp
