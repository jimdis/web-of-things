import React from 'react'
import { Card, Tag, Divider } from 'antd'
import { LinkOutlined } from '@ant-design/icons'
import { IThing } from '../api/types'

type Props = {
  thing: IThing
}

const About = ({ thing }: Props) => {
  const {
    id,
    name,
    description = 'No description provided',
    tags = [],
    links,
  } = thing

  return (
    <Card>
      <Card.Meta
        title={name || id}
        description={description}
        style={{ marginBottom: 8 }}
      />
      {tags.map((tag, i) => (
        <Tag color="blue" key={tag + i}>
          {tag}
        </Tag>
      ))}
      {links?.product && (
        <div>
          <Divider />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <LinkOutlined style={{ marginRight: 8 }} />
            <a
              href={links.product.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {links.product.title}
            </a>
          </div>
        </div>
      )}
    </Card>
  )
}

export default About
