import React, { useEffect, useMemo } from 'react'
import { Row, Col, Tooltip } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import { ChartCard, MiniArea, MiniBar, MiniProgress, Field } from '../Charts';
import Trend from '../Trend'
import { INavUserCount, INavVisitDay, INavDataCount, INavFeedbackCount, IDataStatisticsData } from '../../service'
import noop from 'lodash/noop'
import { connect } from 'umi'
import { mapStateToProps, mapDispatchToProps } from './connect'
import styles from './index.less'

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: {
    marginBottom: 24,
  },
}

const NavCard: React.FC<any> = ({ 
  loading,
  user_count,
  visit_day,
  data_count,
  feedback_count,
  fetchData=noop
}: {
  loading: boolean,
  user_count: INavUserCount,
  visit_day: INavVisitDay,
  data_count: INavDataCount,
  feedback_count: INavFeedbackCount
  fetchData: () => any
}) => {

  const miniProgressData = useMemo(() => {
    const data = feedback_count?.transform_count || 0
    return data > 1 ? data : data * 100
  }, [feedback_count])

  const miniAreaData = useMemo(() => {
    return (visit_day?.data || []).map((item: IDataStatisticsData) => ({ x: item.day, y: item.count }))
  }, [visit_day])

  const miniBarData = useMemo(() => {
    return (data_count?.data || []).map((item: IDataStatisticsData) => ({ x: item.day, y: item.count }))
  }, [data_count])

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Row gutter={24}>
      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          title={
            '用户数量'
          }
          action={
            <Tooltip
              title={
                '用户数量'
              }
            >
              <InfoCircleOutlined />
            </Tooltip>
          }
          loading={loading}
          total={() => user_count?.total || 0}
          footer={
            <Field
              label={
                '今日新增'
              }
              value={user_count?.day_add_count || 0}
            />
          }
          contentHeight={46}
        >
          <Trend
            flag={Trend.flag(user_count?.week_add)}
            style={{
              marginRight: 16,
            }}
          >
            <span>周同比</span>
            <span className={styles.trendText}>{(user_count?.week_add || 0) * 100}%</span>
          </Trend>
          <Trend 
            flag={Trend.flag(user_count?.day_add)}
          >
            <span>日同比</span>
            <span className={styles.trendText}>{(user_count?.day_add || 0) * 100}%</span>
          </Trend>
        </ChartCard>
      </Col>
      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          title={
            '电影数量'
          }
          action={
            <Tooltip
              title={
                '电影数量'
              }
            >
              <InfoCircleOutlined />
            </Tooltip>
          }
          loading={loading}
          total={() => data_count?.total || 0}
          footer={
            <Field
              label={
                '今日新增'
              }
              value={data_count?.day_count || 0}
            />
          }
          contentHeight={46}
        >
          <MiniBar data={miniBarData} />
        </ChartCard>
      </Col>
      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          title={
            '访问量'
          }
          action={
            <Tooltip
              title={
                '访问量'
              }
            >
              <InfoCircleOutlined />
            </Tooltip>
          }
          loading={loading}
          total={() => visit_day?.total || 0}
          footer={
            <Field
              label={
                '日访问量'
              }
              value={visit_day?.day_count || 0}
            />
          }
          contentHeight={46}
        >
          <MiniArea data={miniAreaData} />
        </ChartCard>
      </Col>
      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          title={
            '用户反馈量'
          }
          action={
            <Tooltip
              title={
                '用户反馈量'
              }
            >
              <InfoCircleOutlined />
            </Tooltip>
          }
          loading={loading}
          total={() => feedback_count?.total || 0}
          footer={
            <div
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden'
              }}
            >
              {/* <Field
                label={
                  '今日新增反馈量'
                }
                value={feedback_count?.day_add_count || 0}
              /> */}
              <Trend
                flag={Trend.flag(feedback_count?.day_add)}
                style={{
                  marginRight: 16,
                }}
              >
                日同比
                <span className={styles.trendText}>{(feedback_count?.day_add || 0) * 100}%</span>
              </Trend>
              <Trend 
                flag={Trend.flag(feedback_count?.week_add)}
              >
                周同比
                <span className={styles.trendText}>{(feedback_count?.week_add || 0) * 100}%</span>
              </Trend>
            </div>
          }
          contentHeight={46}
        >
          <MiniProgress percent={miniProgressData} strokeWidth={8} target={miniProgressData} color="#13C2C2" />
        </ChartCard>
      </Col>
    </Row>
  )
  
}

export default connect(mapStateToProps, mapDispatchToProps)(NavCard)