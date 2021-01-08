import React, { FC, memo, useCallback, useEffect, useState } from 'react'
import { unstable_batchedUpdates } from 'react-dom'
import { Row, Col, Card } from 'antd'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { history } from 'umi'
import TagCloud, { ICloudData } from '../Dashboard/components/Charts/TagCloud'
import { getActorInfo, getDirectorInfo, getDistrictInfo, getLanguageInfo, getClassifyInfo } from '@/services'
import { withTry } from '@/utils/utils'
import styles from './style.less'

interface IProps {}

interface IList {
  title: string
  data: ICloudData
  action: () => void
}

const DataAbout: FC<IProps> = () => {

  const [ loading, setLoading ] = useState<boolean>(true)
  const [ list, setList ] = useState<IList[]>([])

  const content = (
    <div className={styles.pageHeaderContent}>
      <p>
        数据辅助信息，帮助多样化电影信息。
      </p>
    </div>
  )

  const extraContent = (
    <div className={styles.extraImg}>
      <img
        alt="数据相关"
        src="https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png"
      />
    </div>
  )

  const routerAction = useCallback((path) => {
    return function() {
      history.push(path)
    }
  }, [])

  const internalFetchData = useCallback(async () => {
    setLoading(true)
    const [ , actor ] = await withTry(getActorInfo)()
    const [ , director ] = await withTry(getDirectorInfo)()
    const [ , classify ] = await withTry(getClassifyInfo)()
    const [ , language ] = await withTry(getLanguageInfo)()
    const [ , district ] = await withTry(getDistrictInfo)()
    unstable_batchedUpdates(() => {
      setList([
        {
          title: '演员信息',
          data: actor ?? [],
          action: routerAction('actor')
        },
        {
          title: '导演信息',
          data: director ?? [],
          action: routerAction('director')
        },
        {
          title: '分类信息',
          data: classify ?? [],
          action: routerAction('classify')
        },
        {
          title: '语言信息',
          data: language ?? [],
          action: routerAction('language')
        },
        {
          title: '地区信息',
          data: district ?? [],
          action: routerAction('district')
        }
      ])
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    internalFetchData()
  })

  return (
    <PageHeaderWrapper 
      content={content} 
      extraContent={extraContent}
    >
      <Card
        loading={loading}
      >
        <Row
          gutter={24}
          style={{ marginTop: 20 }}
        >
          {
            list.map((item: IList) => {
              const { title, data, action } = item
              return (
                <Col 
                  xl={12} 
                  lg={24} 
                  md={24} 
                  sm={24} 
                  xs={24}
                >
                  <Card
                    title={title}
                  >
                    <TagCloud
                      onClick={action}
                      data={data}
                    />
                  </Card>
                </Col>
              )
            })
          }
        </Row>
      </Card>
    </PageHeaderWrapper>
  )

}

export default memo(DataAbout)