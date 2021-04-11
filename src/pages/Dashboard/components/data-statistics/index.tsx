import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Tabs, DatePicker, Card, Row, Col } from 'antd'
import moment, { Moment } from 'moment'
import noop from 'lodash/noop'
import { connect } from 'umi'
import RankList, { IRankData } from './rank'
import { Bar } from '../Charts'
import { mapStateToProps, mapDispatchToProps } from './connect'
import styles from './index.less'

const { TabPane } = Tabs
const { RangePicker } = DatePicker

export interface IDataStatisticsChartData {
  day: string
  count: number
}

type TOriginRankData = {
  name: string 
  count: number 
  _id: string 
  hot: number 
}

type TDateType = 'day' | 'week' | 'month' | 'year'

const TopSearch: React.FC<any> = ({
  data=[],
  dataLoading,
  userLoading,
  rank=[],
  getDataStatisticsList=noop,
  getUserStatisticsList=noop
}: {
  data: Array<IDataStatisticsChartData>
  rank: TOriginRankData[]
  dataLoading: boolean
  userLoading: boolean
  getDataStatisticsList: (params: { start_date: string, end_date: string } | { date_type: TDateType }) => any
  getUserStatisticsList: (params: { start_date: string, end_date: string } | { date_type: TDateType }) => any
}) => {

  const [ dateType, setDateType ] = useState<TDateType | undefined>('day')
  const [ date, setDate ] = useState<[Moment, Moment]>([ moment(), moment() ])
  const [ activeKey, setActiveKey ] = useState<'user' | 'upload'>('user')

  const fetchData = useCallback(async () => {
    let method 
    let params
    if(activeKey === 'user') {
      method = getUserStatisticsList
    }else if(activeKey === 'upload'){
      method = getDataStatisticsList
    }else {
      return 
    }
    const [ startDate, endDate ] = date
    if(!!dateType) {
      params = { date_type: dateType }
    }else {
      params = { start_date: startDate.format('YYYY-MM-DD'), end_date: endDate.format('YYYY-MM-DD') }
    }
    await method(params)
  }, [date, activeKey])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const isActive = useCallback((type: TDateType) => {
    return type === dateType ? styles.currentDate : ''
  }, [ dateType ])

  const setData = (type: TDateType | undefined, startDate: Moment, endDate: Moment) => {
    setDateType(type)
    setDate([startDate, endDate])
  }

  const chartData = useMemo(() => {
    return data.map((item: IDataStatisticsChartData) => ({ x: item.day, y: item.count }))
  }, [data])

  const rankData = useMemo(() => {
    return rank.map((item: TOriginRankData) => ({ title: item.name, value: item.count, _id: item._id }))
  }, [rank])

  return (
    <Card
      bordered
      loading={activeKey == 'user' ? userLoading : dataLoading}
      bodyStyle={{
        padding: '10px 20px',
      }}
    >
      <Tabs
        tabBarExtraContent={
          <div className={styles.salesExtraWrap}>
            <div className={styles.salesExtra}>
              {/* <a className={isActive('day')} onClick={() => setData('day', moment().startOf('D').subtract(12, 'h'), moment().endOf('D').add(12, 'h'))}>
                今日
              </a> */}
              <a className={isActive('day')} onClick={() => setData('day', moment().startOf('D'), moment().endOf('D'))}>
                今日
              </a>
              <a className={isActive('week')} onClick={() => setData('week', moment().startOf('week'), moment().endOf('week'))}>
                本周
              </a>
              <a className={isActive('month')} onClick={() => setData('month', moment().startOf('month'), moment().endOf('month'))}>
                本月
              </a>
              <a className={isActive('year')} onClick={() => setData('year', moment().startOf('year'), moment().endOf('year'))}>
                全年
              </a>
            </div>
            <RangePicker
              format={'YYYY-MM-DD'}
              value={date}
              onChange={(dates: any) => setData(undefined, dates[0], dates[1])}
              style={{
                width: 256,
              }}
            />
          </div>
        }
        size="large"
        tabBarStyle={{
          marginBottom: 24,
        }}
        activeKey={activeKey}
        onChange={setActiveKey as any}
      >
        {/* 用户注册 */}
        <TabPane
          key="user"
          tab="用户注册"
        >
          <Row gutter={24}>
            <Col xl={16} lg={12} md={12} sm={24} xs={24}>
              <div className={styles.salesBar}>
                <Bar
                  height={400}
                  title={"注册用户数量"}
                  data={chartData}
                />
              </div>
            </Col>
            <Col xl={8} lg={12} md={12} sm={24} xs={24}>
              <RankList 
                key={'user-rank'}
                title={'用户人气排行榜'}
                data={rankData}
              />
            </Col>
          </Row>
        </TabPane>
        {/* 电影上传 */}
        <TabPane
          tab="用户上传"
          key="upload"
        >
          <Row gutter={24}>
            <Col xl={16} lg={12} md={12} sm={24} xs={24}>
              <div className={styles.salesBar}>
                <Bar
                  height={400}
                  title={"用户上传电影量"}
                  data={chartData}
                />
              </div>
            </Col>
            <Col xl={8} lg={12} md={12} sm={24} xs={24}>
              <RankList 
                key={'user-upload'}
                title={'电影排行榜'}
                data={rankData}
              />
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </Card>
  )

}

export default connect(mapStateToProps, mapDispatchToProps)(TopSearch)