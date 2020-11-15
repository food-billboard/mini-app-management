import React, { Fragment } from 'react'
import { Row, Col, Tooltip } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import numeral from 'numeral'
import { ChartCard, MiniArea, MiniBar, MiniProgress, Field, Pie } from '../Charts';
import Trend from '../Trend'
import styles from './index.less'

interface IVisitDayChart {
  day: string
  count: number
}

interface IDataCountChart extends IVisitDayChart {}

export interface IUserCount {
  total: number
  week_add: number
  day_add: number
  day_add_count: number
}

export interface IVisitDay {
  total: number
  data: Array<IVisitDayChart>
  day_count: number
}

export interface IDataCount {
  total: number
  week_add: number
  day_add: number
  day_count: number
  data: Array<IDataCountChart>
}

export interface IFeedbackCount {
  total: number
  week_add: number
  day_add: number
  day_add_count: number
  transform_count: number
}

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
  feedback_count
}: {
  loading: boolean,
  user_count: IUserCount,
  visit_day: IVisitDay,
  data_count: IDataCount,
  feedback_count: IFeedbackCount
}) => {

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
            <span className={styles.trendText}>{(user_count?.week_add || 0) * 100}%</span>
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
          <MiniBar data={(data_count?.data || []).map((item: IDataCountChart) => ({ x: item.day, y: item.count }))} />
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
          <MiniArea data={(visit_day?.data || []).map((item: IDataCountChart) => ({ x: item.day, y: item.count }))} />
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
          <MiniProgress percent={(feedback_count?.transform_count || 0) * 100} strokeWidth={8} target={(feedback_count?.transform_count || 0) * 100} color="#13C2C2" />
        </ChartCard>
      </Col>
    </Row>
  )
  
}

export default NavCard