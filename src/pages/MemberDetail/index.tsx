import { Button, message, Modal } from 'antd'
import React, { memo, useEffect, useCallback, useState, useRef } from 'react'
import { unstable_batchedUpdates } from 'react-dom'
import { history } from 'umi'
import { PageContainer } from '@ant-design/pro-layout'
import ProCard from '@ant-design/pro-card'
import { putUser, deleteUser, getUserDetail } from '@/services'
import Table from './components/Table'
import Descriptions from './components/Descriptions'
import Form from '../Member/components/CreateForm'
import { ACTIVE_KEY_MAP } from './constants'

export default memo(() => {

  const [ detail, setDetail ] = useState<API_USER.IGetUserDetailRes>()
  const [ loading, setLoading ] = useState<boolean>(true)
  const [ activeKey, setActiveKey ] = useState<keyof typeof ACTIVE_KEY_MAP>('upload')

  const modalRef = useRef<Form>(null)

  const fetchData = useCallback(async (userId: string) => {
    setLoading(true)
    const data = await getUserDetail({ _id: userId })
    unstable_batchedUpdates(() => {
      setDetail(data)
      setLoading(false)
    })
  }, [])

  const deleteUsers = useCallback(async () => {
    return new Promise((resolve) => {
      Modal.confirm({
        okText: '确定',
        cancelText: '取消',
        title: '提示',
        content: '确定删除该用户吗?',
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
        return deleteUser({ _id: id })
      }
      return Promise.reject()
    })
    .then(_ => {
      message.info('操作成功')
    })
    .catch(_ => {})
  }, [loading, detail])

  const edit = useCallback(() => {
    modalRef.current?.open(detail?._id)
  }, [detail])

  const editUser = useCallback(async (params) => {
    const newValue = {
      ...detail,
      ...params 
    } as API_USER.IPutUserParams
    await putUser(newValue)
    message.info('操作成功')
    return await fetchData(newValue._id)
  }, [loading, detail, fetchData])

  const onTabChange = useCallback((activeKey: string) => {
    setActiveKey(activeKey as any)
  }, [])

  useEffect(() => {
    const { location: { pathname } } = history
    const [specialId] = pathname.split('/').slice(-1) || []
    fetchData(specialId)
  }, [])

  return (
    <PageContainer
      header={{
        title: detail?.username || '用户详情',
        ghost: true,
        extra: [
          <Button onClick={edit} key="1" type="primary">编辑</Button>,
          <Button onClick={deleteUsers} key="2" danger>删除</Button>,
        ],
      }}
      tabList={[
        {
          tab: '上传记录',
          key: 'upload',
          closable: false,
        },
        {
          tab: '评论记录',
          key: 'comment',
          closable: false,
        },
        {
          tab: '评分记录',
          key: 'rate',
          closable: false,
        },
        {
          tab: '反馈记录',
          key: 'feedback',
          closable: false,
        },
      ]}
      tabProps={{
        onChange: onTabChange,
        activeKey
      }}
      content={
        <Descriptions
          loading={loading}
          onChange={editUser}
          value={detail}
        />
      }
    >
      <ProCard
        loading={loading}
      >
        <Table 
          value={detail?._id}
          activeKey={activeKey}
        />
      </ProCard>
      <Form
        onSubmit={editUser}
        ref={modalRef}
      />
    </PageContainer>
  )

})