import React, { memo, useCallback, useEffect, useState } from 'react'
import { List, Pagination } from 'antd'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { PaginationProps } from 'antd/es/pagination'
import styles from '../style.less'

export interface IList {
  name: string
  createdAt?: string
  updatedAt?: string
  avatar?: string
  source_type: 'ORIGIN' | 'USER'
}

export interface IProps<T> {
  loading?: boolean
  headerContent?: React.ReactNode | null
  headerExtra?: React.ReactNode | null
  renderItem(item: T): React.ReactNode
  fetchData(...args: any[]): Promise<T[]>
  // pagination?: PaginationProps
}

function Data<T>({
  loading: propsLoading,
  headerContent,
  headerExtra,
  renderItem,
  fetchData,
  // pagination
}: IProps<T>) {

  const [ loading, setLoading ] = useState<boolean>(true)
  const [ list, setList ] = useState<T[]>([])
  // const [ currPage, setCurrpage ] = useState<number>(0)

  const content = headerContent === undefined ? (
    <div className={styles.pageHeaderContent}>
      <p>
        数据辅助信息，帮助多样化电影信息。
      </p>
      {/* <div className={styles.contentLink}>
        <a>
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/MjEImQtenlyueSmVEfUD.svg" />{' '}
          快速开始
        </a>
        <a>
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/NbuDUAuBlIApFuDvWiND.svg" />{' '}
          产品简介
        </a>
        <a>
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/ohOEPSYdDTNnyMbGuyLb.svg" />{' '}
          产品文档
        </a>
      </div> */}
    </div>
  ) : headerContent

  const extraContent = headerExtra === undefined ? (
    <div className={styles.extraImg}>
      <img
        alt="数据相关"
        src="https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png"
      />
    </div>
  ) : headerExtra

  const internalFetchData = useCallback(async () => {
    setLoading(true)
    const data: T[] = await fetchData()
    setList(data)
    setLoading(false)
  }, [])

  // const pageChange = useCallback((page: number) => {
  //   setCurrpage(page)
  // }, [ currPage ])

  useEffect(() => {
    internalFetchData()
  }, [])

  return (
    <PageHeaderWrapper 
      content={content} 
      extraContent={extraContent}
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
          }}
          dataSource={list}
          renderItem={renderItem}
        />
      </div>
      {/* {
        pagination && 
        <Pagination
          pageSize={10}
          responsive
          onChange={pageChange}
          {...pagination}
        />
      } */}
    </PageHeaderWrapper>
  )

}

export const DataAbout = memo(Data)