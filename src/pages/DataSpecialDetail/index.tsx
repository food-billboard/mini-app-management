import { Button, message, Modal } from 'antd'
import React, { memo, useEffect, useCallback, useState, useRef } from 'react'
import { unstable_batchedUpdates } from 'react-dom'
import { history } from 'umi'
import { PageContainer } from '@ant-design/pro-layout'
import ProCard from '@ant-design/pro-card'
import { getInstanceSpecialList, deleteInstanceSpecial, putInstanceSpecial } from '@/services'
import Table from './components/Table'
import Descriptions from './components/Descriptions'
import Form from '../DataSpecial/components/form'
import type { IFormRef } from '../DataSpecial/components/form'

export default memo(() => {

  const [ detail, setDetail ] = useState<API_INSTANCE.IGetInstanceSpecialData>()
  const [ loading, setLoading ] = useState<boolean>(true)
  const [ activeKey, setActiveKey ] = useState<string>('base')

  const modalRef = useRef<IFormRef>(null)

  const fetchData = useCallback(async (specialId: string) => {
    setLoading(true)
    const data = await getInstanceSpecialList({ _id: specialId })
    const list = data?.list
    unstable_batchedUpdates(() => {
      if(list.length) setDetail(list[0])
      setLoading(false)
    })
  }, [])

  const deleteSpecial = useCallback(async () => {
    return new Promise((resolve) => {
      Modal.confirm({
        okText: '确定',
        cancelText: '取消',
        title: '提示',
        content: '确定删除该专题吗?',
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
      const id = detail?.["_id"]
      if(res && id) {
        return deleteInstanceSpecial({ _id: id })
      }
      return Promise.reject()
    })
    .then(() => {
      message.info('操作成功')
    })
    .catch(() => {})
  }, [detail])

  const edit = useCallback(() => {
    modalRef.current?.open(detail)
  }, [detail])

  const editSpecial = useCallback(async (params: Partial<API_INSTANCE.IPutInstanceSpecialParams>) => {
    const newValue = {
      ...detail,
      ...params 
    } as API_INSTANCE.IPutInstanceSpecialParams
    await putInstanceSpecial(newValue)
    message.info('操作成功')
    await fetchData(newValue["_id"])
  }, [detail, fetchData])

  const onTabChange = useCallback((newActiveKey: string) => {
    setActiveKey(newActiveKey)
  }, [])

  useEffect(() => {
    const { location: { pathname } } = history
    const [specialId] = pathname.split('/').slice(-1) || []
    fetchData(specialId)
  }, [])

  return (
    <PageContainer
      header={{
        title: detail?.name || '专题详情',
        ghost: true,
        extra: [
          <Button onClick={edit} key="1" type="primary">编辑</Button>,
          <Button onClick={deleteSpecial} key="2" danger>删除</Button>,
          detail?.valid === false && <Button type="primary" onClick={editSpecial.bind(null, { valid: true })} key="3">启用</Button>,
          detail?.valid === true && <Button danger key="4" onClick={editSpecial.bind(null, { valid: false })}>禁用</Button>,
        ],
      }}
      tabList={[
        {
          tab: '基本信息',
          key: 'base',
          closable: false,
        },
        {
          tab: '电影信息',
          key: 'info',
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
            onChange={editSpecial}
            value={detail}
          />
        )
      }
      {
        activeKey === 'info' && (
          <ProCard
            loading={loading}
            title="电影数据"
          >
            <Table 
              value={detail?.movie.map(item => item["_id"]) || []}
              onChange={editSpecial}
            />
          </ProCard>
        )
      }
      <Form
        onSubmit={editSpecial}
        ref={modalRef}
      />
    </PageContainer>
  )

})