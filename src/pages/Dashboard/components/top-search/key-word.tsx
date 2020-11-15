import React from 'react'
import { Card } from 'antd'
import { TagCloud } from '../Charts'

export interface IStatisticsTopSearchChart {
  day: string
  count: number
}

const Keyword: React.FC<any> = ({
  data=[]
}: {
  data: Array<IStatisticsTopSearchChart>
}) => {

  return (
    <Card
      title={"热门搜索关键词"}
      bordered={false}
      bodyStyle={{
        overflow: 'hidden',
      }}
    >
      <TagCloud data={data} height={161} />
    </Card>
  )

}

export default Keyword