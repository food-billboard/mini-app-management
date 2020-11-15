import React, { Component, Suspense, Fragment } from 'react'
import { PageContainer, GridContent } from '@ant-design/pro-layout'
import PageLoading from '@/components/PageLoading'
import { Row, Col } from 'antd'
import { connect } from 'react-redux'
import {  } from './data.d'

import { mapStateToProps, mapDispatchToProps } from './connect'

const NavCard = React.lazy(() => import('./components/nav-card'))
const TopSearch = React.lazy(() => import('./components/top-search'))
const DataStatistics = React.lazy(() => import('./components/data-statistics'))
const ProportionClassify = React.lazy(() => import('./components/proportion-classify'))
// const UserVisit = React.lazy(() => import('./components/user-visit'))

class Dashboard extends Component<any> {

  componentDidMount = async () => {
    //数据获取
  }

  public render = () => {

    return (
      <GridContent>
        <Fragment>
          <Suspense fallback={<PageLoading/>}>
            <NavCard />
          </Suspense>
          <Suspense fallback={null}>
            <DataStatistics />
          </Suspense>
        </Fragment>
        <Row 
          gutter={24}
          style={{ marginTop: 20 }}
        >
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Suspense fallback={null}>
              <TopSearch />
            </Suspense>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Suspense fallback={null}>
              <ProportionClassify />
            </Suspense>
          </Col>
        </Row>
        {/* <Suspense fallback={null}>
          <UserVisit />
        </Suspense> */}
      </GridContent>
    )

  }

}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)