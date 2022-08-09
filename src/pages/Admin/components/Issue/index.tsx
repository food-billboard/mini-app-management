import { Card, List, Pagination, Carousel } from 'antd'
import React, { Fragment, memo, useCallback, useEffect, useState } from 'react'
import { unstable_batchedUpdates } from 'react-dom'
import { history } from 'umi'
import { merge } from 'lodash'
import moment from 'moment'
import AvatarList from './components/AvatarList'
import { GetAdminIssueList } from '@/services'
import styles from './index.less'

const Issue = () => {
  
  const [ currPage, setCurrPage ] = useState<number>(1)
  const [ list, setList ] = useState<API_ADMIN.IGetAdminIssueListData[]>([])
  const [ total, setTotal ] = useState<number>(0)

  const fetchData = useCallback(async (params: API_ADMIN.IGetAdminIssueListParams={}) => {
    const data = await GetAdminIssueList(merge({}, params, {
      currPage: currPage - 1,
      pageSize: 10
    }))
    unstable_batchedUpdates(() => {
      setList(data.list || [])
      setTotal(data.total || 0)
    })
  }, [currPage])

  const onPageChange = useCallback((page: number) => {
    setCurrPage(page)
  }, [])

  const getUserDetail = useCallback((id: string) => {
    return history.push(`/data/main/${id}`)
  }, [])

  useEffect(() => {
    fetchData()
  }, [currPage])

  return (
    <Fragment>
      <List
        className={styles.coverCardList}
        rowKey="_id"
        grid={{
          gutter: 24,
          xxl: 3,
          xl: 2,
          lg: 2,
          md: 2,
          sm: 2,
          xs: 1,
        }}
        dataSource={list}
        renderItem={item => (
          <List.Item>
            <Card 
              className={styles.card} 
              hoverable 
              cover={
                <Carousel
                  autoplay={false}
                >
                  {
                    (item.images || []).map(src => {
                      return (
                        <div
                          key={src}
                        >
                          <img style={{width: '100%', height: 200}} src={src} />
                        </div>
                      )
                    })
                  }
                </Carousel>
              }
            >
              <div onClick={getUserDetail.bind(null, item["_id"])}>
                <Card.Meta title={<a>{item.name}</a>} description={item.description} />
                <div className={styles.cardItemContent}>
                  <span>{moment(item.updatedAt).fromNow()}</span>
                  <div className={styles.avatarList}>
                    <AvatarList
                      id={item["_id"]}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </List.Item>
        )}
      />
    <div style={{textAlign: 'right'}}>
      <Pagination
        pageSize={10}
        current={currPage}
        total={total}
        onChange={onPageChange}
        hideOnSinglePage
      />
    </div>
  </Fragment>
  )
}

export default memo(Issue)
