import React from 'react'
import { Tooltip } from 'antd'
import {
  CheckCircleFilled,
  ExclamationCircleFilled,
  CloseCircleFilled,
} from '@ant-design/icons'
type Props = {
  status: 'active' | 'connecting' | 'inactive'
}

const LiveIcon = ({ status }: Props) => {
  let icon

  if (status === 'active') {
    icon = <CheckCircleFilled style={{ color: '#52c41a' }} />
  }

  if (status === 'connecting') {
    icon = <ExclamationCircleFilled style={{ color: '#faad14' }} />
  }

  if (status === 'inactive') {
    icon = <CloseCircleFilled style={{ color: '#ff4d4f' }} />
  }
  return (
    <span>
      <Tooltip title={`Live updates ${status}`}>{icon}</Tooltip>
    </span>
  )
}

export default LiveIcon
