import React, { Suspense } from 'react'
import { Table, Card, Row, Col, Tooltip } from 'antd'
import { InfoCircleOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons'
import numeral from 'numeral'
import NumberInfo from '../NumberInfo'
import { MiniArea } from '../Charts'
import PageLoading from '@/components/PageLoading'
import KeyWord, { IStatisticsTopSearchChart } from './key-word'
import columns from './columns'

export interface IStatisticsTopSearchAverageChart extends IStatisticsTopSearchChart {}

export interface ITopSearchList {
  index: number
  key_wrod: string
  count: number
}

export interface IKeyword {
  count: number
  name: string
}

const SalesCard: React.FC<any> = ({
  loading,
  totalSearch,
  totalTrend,
  averageSearch,
  averageTrend,
  statisticsTopSearchChart=[],
  statisticsTopSearchAverageChart=[],
  topSearchList=[],
  keyword=[]
}: {
  loading: boolean,
  totalSearch: number,
  totalTrend: number,
  averageSearch: number,
  averageTrend: number,
  statisticsTopSearchChart: Array<IStatisticsTopSearchChart>,
  statisticsTopSearchAverageChart: Array<IStatisticsTopSearchAverageChart>,
  topSearchList: Array<ITopSearchList>
  keyword: Array<IKeyword>
}) => {

  return (
    <Card
      loading={loading}
      bordered={false}
      title={'线上热门搜索'}
      style={{
        height: '100%',
      }}
      extra={
        <Tooltip
          title={
            // <Suspense fallback={<PageLoading />}>
            //   <KeyWord data={keyword} />
            // </Suspense>
            '开发中...'
          }
        >
          <InfoCircleOutlined />
        </Tooltip>
      }
    >
      <Row gutter={24}>
        <Col 
          sm={12} xs={24}
          style={{marginBottom: 20}}
        >
          <NumberInfo
            subTitle={
              <span>
                搜索总数
                <Tooltip
                  title={
                    '指标说明'
                  }
                >
                  <InfoCircleOutlined style={{
                    marginLeft: 8
                  }} />
                </Tooltip>
              </span>
            }
            gap={8}
            total={numeral(totalSearch).format('0')}
            {...(typeof averageTrend !== 'number' || averageTrend == 0 ? {} : {
              status: averageTrend > 0 ? <CaretUpOutlined style={{color: 'rgb(238, 10, 38)'}} /> : <CaretDownOutlined style={{color: 'rgba(70, 189, 21)'}} />
            })}
            subTotal={totalTrend}
          />
          <MiniArea line height={45} data={statisticsTopSearchChart.map(item => ({ x: item.day, y: item.count }))} />
        </Col>
        <Col 
          sm={12} xs={24}
          style={{marginBottom: 20}}
        >
          <NumberInfo
            subTitle={
              <span>
                人均搜索数
                <Tooltip
                  title={'指标说明'}
                >
                  <InfoCircleOutlined style={{
                    marginLeft: 8
                  }} />
                </Tooltip>
              </span>
            }
            total={numeral(averageSearch).format('0')}
            {...(typeof averageTrend !== 'number' || averageTrend == 0 ? {} : {
              status: averageTrend > 0 ? <CaretUpOutlined style={{color: 'rgb(238, 10, 38)'}} /> : <CaretDownOutlined style={{color: 'rgba(70, 189, 21)'}} />
            })}
            subTotal={averageTrend || 0}
            gap={8}
          />
          <MiniArea line height={45} data={statisticsTopSearchAverageChart.map(item => ({ x: item.day, y: item.count }))} />
        </Col>
      </Row>
      <Table
        rowKey={record => record.index}
        columns={columns as any[]}
        dataSource={topSearchList}
        size="small"
        pagination={{
          style: {
            marginBottom: 0,
          },
          pageSize: 5,
        }}
      ></Table>
    </Card>
  )

}

export default SalesCard