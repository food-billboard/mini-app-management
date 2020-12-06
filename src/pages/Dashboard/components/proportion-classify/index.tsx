import React, { useEffect, useState } from 'react'
import { Card, Radio } from 'antd'
import { Pie } from '../Charts'
import noop from 'lodash/noop'
import { connect } from 'react-redux'
import { mapStateToProps, mapDispatchToProps } from './connect'
import styles from './index.less'

export interface IClassifyData {
  _id: string | null
  name: string
  value: number
}

enum EType {
  classify = 'classify',
  movie = 'movie'
}

export type IType = 'classify' | 'movie'

const ProportionClassify: React.FC<any> = ({
  loading,
  data=[{
    name: '其他',
    _id: null,
    value: 1
  }],
  total=0,
  fetchData=noop
}: {
  loading: boolean,
  total: number,
  data: Array<IClassifyData>
  fetchData: () => any
}) => {

  const [ classifyType, setClassifyType ] =  useState<keyof typeof EType>(EType.classify)

  const onClassifyChange = (value: any) => {
    setClassifyType(value)
  }

  useEffect(() => {
    fetchData()
  }, [])

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
        hasLegend
        subTitle={
          '分类'
        }
        total={() => total}
        data={(Array.isArray(data) ? data : []).map(d => ({ y: d.value, x: d.name }))}
        valueFormat={(value: number) => `${(value || 0) * total}`}
        height={248}
        lineWidth={4}
      />
    </div>
  </Card>
  )

}

export default connect(mapStateToProps, mapDispatchToProps)(ProportionClassify)