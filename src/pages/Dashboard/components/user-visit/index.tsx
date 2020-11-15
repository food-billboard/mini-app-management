import React from 'react'
import { Card, Tabs } from 'antd'
import {} from '../Charts'
import styles from './index.less'

export interface IUserVisitData {
  day: string
  count: number
}

const UserVisit: React.FC<any> = ({
  loading,
  data=[]
}: {
  loading: boolean
  data: Array<IUserVisitData>
}) => {

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
        {/* <TimelineChart
          height={400}
          data={data}
          titleMap={{
            y1: 'a',
            y2: 'b',
          }}
        /> */}
      </div>
    </Card>
  )

}

export default UserVisit