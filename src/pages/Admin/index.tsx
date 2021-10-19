import { Card, Col, Divider, Row } from 'antd'
import React, { Component } from 'react'
import { EditOutlined } from '@ant-design/icons'
import { GridContent } from '@ant-design/pro-layout'
import { connect } from 'dva'
import { Link, history } from 'umi'
import { ROLES_MAP } from '@/utils'
import Issue from './components/Issue'
import Comment from './components/Comment'
import { mapStateToProps, mapDispatchToProps } from './connect'
import styles from './index.less'

interface IState {
  tabKey: 'issue' | 'comment'
}

interface IProps {
  getUserInfo: () => Promise<API_ADMIN.IGetAdminInfoRes>
  userInfo: API_ADMIN.IGetAdminInfoRes
  loading: boolean
}

class Center extends Component<IProps> {

  state: IState = {
    tabKey: 'issue'
  }

  async componentDidMount() {
    const { getUserInfo } = this.props
    if(getUserInfo) await getUserInfo()
  }

  onTabChange = (key: string) => {
    this.setState({
      tabKey: key,
    })
  }

  renderChildrenByTabKey = (tabKey: IState["tabKey"]) => {
    if (tabKey === 'issue') {
      return <Issue />
    }

    if (tabKey === 'comment') {
      return <Comment />
    }

    return null
  }

  editAdmin = () => {
    return history.push('/admin/setting')
  }

  render() {
    const { tabKey } = this.state
    const { userInfo, loading } = this.props
    const dataLoading = loading || !(userInfo && Object.keys(userInfo).length)
    const rolesText = Array.isArray(userInfo.roles) ? userInfo.roles.map(item => ROLES_MAP[item]).join(',') : userInfo.roles

    return (
      <GridContent>
        <Row gutter={24}>
          <Col lg={7} md={24}>
            <Card
              bordered={false}
              style={{
                marginBottom: 24,
              }}
              loading={dataLoading}
            >
              {!dataLoading && (
                <div>
                  <div className={styles.avatarHolder}>
                    <img alt="" src={userInfo.avatar} />
                    <div className={styles.name}>
                      {userInfo.username}
                      <EditOutlined style={{cursor: 'pointer'}} onClick={this.editAdmin} />
                    </div>
                    <div>{userInfo.description}</div>
                  </div>
                  <div className={styles.info}>
                    <p title={userInfo.mobile.toString()}>
                      <i className={styles.mobile} />
                      {userInfo.mobile}
                    </p>
                    <p title={userInfo.email.toString()}>
                      <i className={styles.email} />
                      {userInfo.email}
                    </p>
                    <p title={rolesText.toString()}>
                      <i className={styles.auth} />
                      {
                        rolesText
                      }
                    </p>
                  </div>
                  <Divider dashed />
                  <div className={styles.detail}>
                    <div className={styles.detailTitle}>详情</div>
                    <Row gutter={36}>
                      <Col lg={24} xl={12}>
                        <Link to={`/member/${userInfo["_id"]}`}>
                          粉丝数量: {userInfo.fans}
                        </Link>
                      </Col>
                      <Col lg={24} xl={12}>
                        <Link to={`/member/${userInfo["_id"]}`}>
                          评论数量: {userInfo.comment}
                        </Link>
                      </Col>
                      <Col lg={24} xl={12}>
                        <Link to={`/member/${userInfo["_id"]}`}>
                          收藏数量: {userInfo.store}
                        </Link>
                      </Col>
                      <Col lg={24} xl={12}>
                        <Link to={`/member/${userInfo["_id"]}`}>
                          关注数量: {userInfo.attentions}
                        </Link>
                      </Col>
                      <Col lg={24} xl={12}>
                        <Link to={`/member/${userInfo["_id"]}`}>
                          人气: {userInfo.hot}
                        </Link>
                      </Col>
                    </Row>
                  </div>
                </div>
              )}
            </Card>
          </Col>
          <Col lg={17} md={24}>
            <Card
              className={styles.tabsCard}
              bordered={false}
              tabList={[
                {
                  key: 'issue',
                  tab: (
                    <span>
                      上传{' '}
                      <span
                        style={{
                          fontSize: 14,
                        }}
                      >
                        ({userInfo.issue})
                      </span>
                    </span>
                  ),
                },
                {
                  key: 'comment',
                  tab: (
                    <span>
                      评论{' '}
                      <span
                        style={{
                          fontSize: 14,
                        }}
                      >
                        ({userInfo.comment})
                      </span>
                    </span>
                  ),
                },
              ]}
              activeTabKey={tabKey}
              onTabChange={this.onTabChange}
            >
              {this.renderChildrenByTabKey(tabKey)}
            </Card>
          </Col>
        </Row>
      </GridContent>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Center)
