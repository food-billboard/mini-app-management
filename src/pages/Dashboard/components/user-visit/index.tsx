import React, { useEffect } from 'react'
import { Card } from 'antd'
import { TimelineChart } from '../Charts'
import { connect } from 'react-redux'
import { mapStateToProps, mapDispatchToProps } from './connect'
import noop from 'lodash/noop'
import { IVisitStatisticsData } from '../../service'
import styles from './index.less'

interface IProps {
  loading: boolean
  data: Array<IVisitStatisticsData>
  fetchData: (params?: {
    date_type?: 'year' | 'month' | 'week' | 'day'
    start_date?: string
    end_date?: string
  }) => any
}

const UserVisit: React.FC<IProps> = ({
  loading,
  data=[],
  fetchData=noop
}) => {

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Card
      loading={loading}
      className={styles.offlineCard}
      bordered={false}
      style={{
        marginTop: 32,
      }}
    >
      <div
        style={{
          padding: '0 24px',
        }}
      >
        <TimelineChart
          height={400}
          data={data.map((item: IVisitStatisticsData) => ({ x: item.day, y1: item.count }))}
        />
      </div>
    </Card>
  )

}

export default connect(mapStateToProps, mapDispatchToProps)(UserVisit)