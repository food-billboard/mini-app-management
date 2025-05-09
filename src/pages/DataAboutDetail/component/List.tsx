import React, { memo, useCallback, useEffect, useState, useImperativeHandle, forwardRef, useMemo } from 'react'
import { List, Pagination } from 'antd'
import { unstable_batchedUpdates } from 'react-dom'
import { ProFormText, LightFilter } from '@ant-design/pro-components'
import PageContainer from '@/components/PageContainer'
import styles from '../style.less'

export interface IList {
  name: string
  createdAt?: string
  updatedAt?: string
  avatar?: string
  source_type: 'ORIGIN' | 'USER'
}

export interface IProps<T=any> {
  loading?: boolean
  headerContent?: (init: () => any) => React.ReactNode
  headerExtra?: React.ReactNode | null
  renderItem: (item: T) => React.ReactNode
  fetchData: (...args: any[]) => Promise<T | T[]>
}

export interface DataAboutRef {
  fetchData: (params?: {
    currPage?: number 
    pageSize?: number
    [key: string]: any
  }) => Promise<void>
}

const DEFAULT_PAGE_SIZE = 10

const Data = forwardRef<DataAboutRef, IProps>((props, ref) => {

  const { loading: propsLoading, headerContent, headerExtra, renderItem, fetchData, } = props

  const [ loading, setLoading ] = useState<boolean>(true)
  const [ list, setList ] = useState<any[]>([])
  const [ total, setTotal ] = useState<number>(0)
  const [ currPage, setCurrPage ] = useState<number>(1)

  const internalFetchData = useCallback(async (params?) => {
    setLoading(true)
    const data = await fetchData({
      currPage: currPage - 1,
      pageSize: DEFAULT_PAGE_SIZE,
      ...params || {}
    })
    unstable_batchedUpdates(() => {
      setList([
        {},
        ...data?.list || [],
      ])
      setTotal(data?.total || 0)
      setLoading(false)
    })
  }, [currPage])

  useImperativeHandle(ref, () => ({
    fetchData: internalFetchData
  }))

  const init = useCallback(async (nextParams?: any) => {
    setCurrPage(1)
    await internalFetchData(nextParams)
  }, [internalFetchData])

  const content = useMemo(() => {
    if(headerContent) {
      return headerContent
    }
    return () => (
      <div className={styles.pageHeaderContent}>
        <div
          style={{display: 'flex', alignItems: 'center'}}
        >
          数据辅助信息，帮助多样化电影信息。
          <LightFilter
            collapse
            onFinish={init}
          >
            <ProFormText
              name="content"
              label="名称"
            />
          </LightFilter>
        </div>
      </div>
    )
  }, [headerContent, init])

  const extraContent = headerExtra === undefined ? (
    <div className={styles.extraImg}>
      <img
        alt="数据相关"
        src="https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png"
      />
    </div>
  ) : headerExtra

  const pageChange = useCallback(async (page: number) => {
    setCurrPage(page)
    await internalFetchData({
      currPage: page - 1
    })
  }, [internalFetchData])

  const footerContent = useMemo(() => {
    return [
      (
        <Pagination
          key="pagination"
          defaultCurrent={1}
          current={currPage}
          defaultPageSize={DEFAULT_PAGE_SIZE}
          hideOnSinglePage
          responsive
          showQuickJumper
          total={total}
          onChange={pageChange}
          style={{padding: '12px 0'}}
        />
      )
    ]
  }, [ total, pageChange, currPage ])

  useEffect(() => {
    internalFetchData()
  }, [])

  return (
    <PageContainer 
      content={content(init)} 
      extraContent={extraContent}
      footer={footerContent}
    >
      <div className={styles.cardList}>
        <List
          rowKey="id"
          loading={propsLoading || loading}
          grid={{
            gutter: 24,
            lg: 3,
            md: 2,
            sm: 1,
            xs: 1,
            xl: 4,
            xxl: 4
          }}
          dataSource={list}
          renderItem={renderItem}
        />
      </div>
    </PageContainer>
  )

})

export const DataAbout = memo(Data)