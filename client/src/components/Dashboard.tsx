import React, { useState } from 'react'
import { Alert, Row, Col, Tabs, Empty, Spin } from 'antd'
import useDashboard from './useDashboard'
import Property from './Property'
import Action from './Action'

const { TabPane } = Tabs

const Dashboard = () => {
  const {
    model,
    properties,
    fetchPropertyData,
    fetchActionData,
    submitAction,
    loading,
    error,
    clearError,
  } = useDashboard()

  const mapResourceToModel = (resourceKey: 'properties' | 'actions') => {
    const resources = model?.links?.[resourceKey]?.resources
    return resources
      ? Object.keys(resources).map(k => ({
          id: k,
          name: resources[k].name as string | undefined,
          description: resources[k].description as string | undefined,
          tags: resources[k].tags as string[] | undefined,
          values: resources[k].values,
        }))
      : []
  }

  const propertyResources = mapResourceToModel('properties')
  const actionResources = mapResourceToModel('actions')

  const getData = (id: string) => properties.find(el => el.id === id)?.values

  return (
    <div>
      {error && (
        <Alert
          message={'Error: ' + error}
          type="error"
          banner
          closable
          onClose={clearError}
        />
      )}
      <Tabs defaultActiveKey="1">
        <TabPane tab="Properties" key="1">
          <h2>Properties</h2>
          {loading ? (
            <Spin size="large" />
          ) : (
            <Row>
              {propertyResources.length ? (
                propertyResources.map(p => (
                  <Col key={p.id} xs={24} sm={12} md={8} lg={6}>
                    <Property
                      id={p.id}
                      name={p.name}
                      description={p.description}
                      tags={p.tags}
                      values={p.values}
                      latestValues={getData(p.id)}
                      fetchPropertyData={fetchPropertyData}
                    />
                  </Col>
                ))
              ) : (
                <Empty description="No properties found" />
              )}
            </Row>
          )}
        </TabPane>
        <TabPane tab="Actions" key="2">
          <h2>Actions</h2>
          {loading ? (
            <Spin size="large" />
          ) : (
            <Row>
              {actionResources.length ? (
                actionResources.map(a => (
                  <Col key={a.id} xs={24} sm={12}>
                    <Action
                      id={a.id}
                      name={a.name}
                      description={a.description}
                      values={a.values}
                      fetchActionData={fetchActionData}
                      submitAction={submitAction}
                    />
                  </Col>
                ))
              ) : (
                <Empty description="No actions found" />
              )}
            </Row>
          )}
        </TabPane>
      </Tabs>
    </div>
  )
}

export default Dashboard
