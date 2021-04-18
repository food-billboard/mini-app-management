import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Card, Radio } from 'antd'
import { Pie } from '../Charts'
import noop from 'lodash/noop'
import { connect } from 'umi'
import { mapStateToProps, mapDispatchToProps } from './connect'
import styles from './index.less'

export interface IClassifyData {
  count: string
  classify: {
    name: string
    _id: string | null
  }
}

enum EType {
  classify = 'classify',
  movie = 'movie'
}

export type IType = 'classify' | 'movie'

const ProportionClassify: React.FC<any> = ({
  loading,
  fetchData=noop,
  data=[],
  total=0
}: {
  data: IClassifyData[]
  total: number
  loading: boolean,
  fetchData: () => any
}) => {

  const [ classifyType, setClassifyType ] =  useState<keyof typeof EType>(EType.classify)

  const onClassifyChange = useCallback((e: any) => {
    setClassifyType(e.target.value)
  }, [])

  const chartData = useMemo(() => {
    let rest = 1 
    const newData: IClassifyData[] = Array.isArray(data) ? data : []
    const newList = newData.reduce<{ x: string, y: number, value: number }[]>((acc, cur) => {
      const { count, classify: { name, _id }={} } = cur
      let value = parseFloat(count)
      if(!Number.isNaN(value) && !!name && rest - value >= 0) {
        rest -= value
        acc.push({
          x: name,
          y: value,
          value: total * value
        })
      }
      return acc 
    }, [])
    if(rest !== 0) newList.push({
      x: '未知',
      y: rest,
      value: total * rest
    })
    return newList
  }, [data])

  useEffect(() => {
    fetchData()
  }, [classifyType])

  return (
    <Card
    loading={loading}
    className={styles.salesCard}
    bordered={false}
    title={
      '数据分类占比'
    }
    style={{
      height: '100%',
    }}
    extra={
      <div className={styles.salesCardExtra}>
        <div className={styles.salesTypeRadio}>
          <Radio.Group value={classifyType} onChange={onClassifyChange}>
            <Radio.Button value={EType.classify}>
              分类
            </Radio.Button>
            <Radio.Button value={EType.movie}>
              来源类型
            </Radio.Button>
          </Radio.Group>
        </div>
      </div>
    }
  >
    <div>
      <h4
        style={{
          marginTop: 8,
          marginBottom: 32,
        }}
      >
        分类
      </h4>
      <Pie
        // total={() => (total || 0).toString()}
        data={chartData}
        // valueFormat={(value: number) => `${(value || 0) * total}`}
        height={248}
        lineWidth={4}
      />
    </div>
  </Card>
  )

}

export default connect(mapStateToProps, mapDispatchToProps)(ProportionClassify)