import React, { useEffect, memo, useMemo, useCallback, useState } from 'react'
import { Button, message, Modal } from 'antd'
import { unstable_batchedUpdates } from 'react-dom'
import { PageContainer } from '@ant-design/pro-layout'
import ProCard from '@ant-design/pro-card'
import { history } from 'umi'
import Descriptions from './components/Descriptions'
import UserTable from './components/User'
import CommentTable from './components/Comment'
import { movieDetail, deleteMovie, putMovieStatus, deleteMovieStatus } from '@/services'

export default memo(() => {

  const movieId: string | undefined = useMemo(() => {
    const { location: { pathname } } = history
    const [,,,movieId] = pathname.split('/')
    return movieId
  }, [])

  const [ detail, setDetail ] = useState<API_DATA.IGetMovieDetailRes>()
  const [ loading, setLoading ] = useState<boolean>(true)
  const [ activeKey, setActiveKey ] = useState<string>('base')

  const fetchData = useCallback(async (movieId: string) => {
    setLoading(true)
    const data = await movieDetail({ _id: movieId })
    unstable_batchedUpdates(() => {
      setDetail(data)
      setLoading(false)
    })
  }, [])

  const edit = useCallback(() => {
    return history.push({
      pathname: '/data/main/edit',
      query: {
        id: detail?._id || ''
      }
    })
  }, [detail])

  const deleteMovieInfo = useCallback(async () => {
    return new Promise((resolve, reject) => {
      Modal.confirm({
        okText: '确定',
        cancelText: '取消',
        title: '提示',
        content: '确定删除该电影吗?',
        onCancel: (close) => {
          close()
          resolve(false)
        },
        onOk: (close) => {
          close()
          resolve(true)
        }
      })
    })
    .then(res => {
      const id = detail?._id
      if(res && id) {
        return deleteMovie({ _id: id })
      }
      return Promise.reject()
    })
    .then(_ => {
      message.info('操作成功')
      history.replace('/data/main')
    })
    .catch(_ => {})
  }, [loading, detail])

  const editStatus = useCallback(async (valid: boolean, _id: string) => {
    const method = valid ? putMovieStatus : deleteMovieStatus
    await method({ _id })
    .then(_ => {
      message.info('操作成功')
      return fetchData(_id)
    })
    .catch(err => message.info('操作失败'))
  }, [])

  const editStatusDom = useMemo(() => {
    const not = <Button danger key="4" onClick={editStatus.bind(this, false, movieId)}>禁用</Button>
    const is = <Button type="primary" onClick={editStatus.bind(this, true, movieId)} key="3">启用</Button>
    if(detail?.status === 'COMPLETE') return [
      not
    ]
    if(detail?.status === 'NOT_VERIFY') return [
      is 
    ]
    return [
      not,
      is
    ]
  }, [detail?.status, movieId])

  const onTabChange = useCallback((activeKey: string) => {
    setActiveKey(activeKey)
  }, [])

  useEffect(() => {
    if(movieId) {
      fetchData(movieId)
    }
  }, [movieId])

  return (
    <PageContainer
      header={{
        title: detail?.name || '专题详情',
        ghost: true,
        extra: [
          <Button onClick={edit} key="1" type="primary">编辑</Button>,
          <Button onClick={deleteMovieInfo} key="2" danger>删除</Button>,
          ...editStatusDom
        ],
      }}
      tabList={[
        {
          tab: '详情',
          key: 'base',
          closable: false,
        },
        {
          tab: '访问用户列表',
          key: 'user',
          closable: false,
        },
        {
          tab: '用户评论列表',
          key: 'comment',
          closable: false,
        },
      ]}
      tabProps={{
        onChange: onTabChange,
        activeKey
      }}
    >
      {
        activeKey === 'base' && (
          <Descriptions
            loading={loading}
            value={detail}
          />
        )
      }
      {
        activeKey === 'user' && (
          <ProCard
            loading={loading}
            title="电影数据"
          >
            <UserTable 
              _id={detail?._id}
            />
          </ProCard>
        )
      }
      {
        activeKey === 'comment' && (
          <ProCard
            loading={loading}
            title="电影数据"
          >
            <CommentTable 
              _id={detail?._id}
            />
          </ProCard>
        )
      }
    </PageContainer>
  )

})