import React from 'react'
import { Card } from 'antd'
import { TagCloud } from '../Charts'
import { IKeyword } from './index'
// export interface IStatisticsTopSearchChart {
//   text: string
//   count: number
// }

const Keyword: React.FC<any> = ({
  data=[]
}: {
  data: Array<IKeyword>
}) => {

  return (
    <Card
      // title={"热门搜索关键词"}
      bordered={false}
      bodyStyle={{
        overflow: 'hidden',
      }}
    >
      <TagCloud data={data.map((item: IKeyword) => ({ name: item.name, text: item.name, value: item.count }))} height={100} />
    </Card>
  )

}

export default Keyword