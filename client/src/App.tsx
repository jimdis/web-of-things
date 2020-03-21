import React from 'react'
import { Layout } from 'antd'
import Dashboard from './components/Dashboard'
const { Header, Content } = Layout

const App = () => {
  return (
    <Layout>
      <Header>
        <h1>Web of things client 1dv527</h1>
      </Header>
      <Content style={{ padding: '16px 32px' }}>
        <Dashboard />
      </Content>
    </Layout>
  )
}

export default App
