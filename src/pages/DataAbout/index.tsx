import React, { FC, memo, useCallback, useEffect, useState } from 'react'
import { unstable_batchedUpdates } from 'react-dom'
import { Row, Col, Card } from 'antd'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { history } from 'umi'
import TagCloud, { ICloudData } from '../Dashboard/components/Charts/TagCloud'
import { getActorInfo, getDirectorInfo, getDistrictInfo, getLanguageInfo, getClassifyInfo } from '@/services'
import { localFetchData4Array } from '../Data/component/utils'
import styles from './style.less'

interface IProps {}

interface IList {
  title: string
  data: ICloudData[]
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
      history.push(`/data/about/${path}`)
    }
  }, [])

  const wrapperRandomData: (list?: any[]) => ICloudData[] = useCallback((list) => {
    return (list ?? []).map(item => {
      const value = (Math.random() * 100).toFixed(0) + 20
      return { ...item, text: item.name, value }
    })

  }, [])

  const internalFetchData = useCallback(async () => {
    setLoading(true)
    const actor = await localFetchData4Array<API_DATA.IGetActorInfoResData, API_DATA.IGetActorInfoRes, ICloudData>(getActorInfo)(['name', 'name'], data => data.list)
    const director = await localFetchData4Array<API_DATA.IGetDirectorInfoResData, API_DATA.IGetDirectorInfoRes, ICloudData>(getDirectorInfo)(['name', 'name'], data => data.list)
    const classify = await localFetchData4Array<API_DATA.IGetClassifyInfoResData, API_DATA.IGetClassifyInfoRes, ICloudData>(getClassifyInfo)(['name', 'name'], data => data.list)
    const language = await localFetchData4Array<API_DATA.IGetLanguageInfoResData, API_DATA.IGetLanguageInfoRes, ICloudData>(getLanguageInfo)(['name', 'name'], data => data.list)
    const district = await localFetchData4Array<API_DATA.IGetDistrictInfoResData, API_DATA.IGetDistrictInfoRes, ICloudData>(getDistrictInfo)(['name', 'name'], data => data.list)

    unstable_batchedUpdates(() => {
      setList([
        {
          title: '演员信息',
          data: wrapperRandomData(actor),
          action: routerAction('actor')
        },
        {
          title: '导演信息',
          data: wrapperRandomData(director),
          action: routerAction('director')
        },
        {
          title: '分类信息',
          data: wrapperRandomData(classify),
          action: routerAction('classify')
        },
        {
          title: '语言信息',
          data: wrapperRandomData(language),
          action: routerAction('language')
        },
        {
          title: '地区信息',
          data: wrapperRandomData(district),
          action: routerAction('district')
        }
      ])
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    internalFetchData()
  }, [])

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
                  style={{marginBottom: 20}}
                  key={title}
                >
                  <Card
                    title={title}
                  >
                    <TagCloud
                      height={250}
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