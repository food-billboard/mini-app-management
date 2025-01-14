import useUserInfo from '@/hooks/useUserInfo';
import { ROLES_MAP } from '@/utils';
import { EditOutlined } from '@ant-design/icons';
import { GridContent } from '@ant-design/pro-components';
import { Card, Col, Divider, Row } from 'antd';
import { useMemo, useState } from 'react';
import { Link, history, useModel } from 'umi';
import Comment from './components/Comment';
import Issue from './components/Issue';
import styles from './index.less';

const Center = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser: userInfo, loading = false } = initialState || {};

  const [tabKey, setTabKey] = useState('issue');

  useUserInfo();

  const renderChildrenByTabKey = useMemo(() => {
    if (tabKey === 'issue') {
      return <Issue />;
    }

    if (tabKey === 'comment') {
      return <Comment />;
    }

    return null;
  }, [tabKey]);

  const editAdmin = () => {
    return history.push('/admin/setting');
  };

  const dataLoading = loading || !(userInfo && Object.keys(userInfo).length);
  const rolesText = Array.isArray(userInfo?.roles)
    ? userInfo?.roles.map((item) => ROLES_MAP[item]).join(',')
    : (userInfo?.roles as string);

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
                    <EditOutlined
                      style={{ cursor: 'pointer' }}
                      onClick={editAdmin}
                    />
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
                    {rolesText}
                  </p>
                </div>
                <Divider dashed />
                <div className={styles.detail}>
                  <div className={styles.detailTitle}>详情</div>
                  <Row gutter={36}>
                    <Col lg={24} xl={12}>
                      <Link to={`/member/${(userInfo as any)['_id']}`}>
                        粉丝数量: {userInfo.fans}
                      </Link>
                    </Col>
                    <Col lg={24} xl={12}>
                      <Link to={`/member/${(userInfo as any)['_id']}`}>
                        评论数量: {userInfo.comment}
                      </Link>
                    </Col>
                    <Col lg={24} xl={12}>
                      <Link to={`/member/${(userInfo as any)['_id']}`}>
                        收藏数量: {userInfo.store}
                      </Link>
                    </Col>
                    <Col lg={24} xl={12}>
                      <Link to={`/member/${(userInfo as any)['_id']}`}>
                        关注数量: {userInfo.attentions}
                      </Link>
                    </Col>
                    <Col lg={24} xl={12}>
                      <Link to={`/member/${(userInfo as any)['_id']}`}>
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
                      ({userInfo?.issue})
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
                      ({userInfo?.comment})
                    </span>
                  </span>
                ),
              },
            ]}
            activeTabKey={tabKey}
            onTabChange={setTabKey}
          >
            {renderChildrenByTabKey}
          </Card>
        </Col>
      </Row>
    </GridContent>
  );
};

export default Center;
