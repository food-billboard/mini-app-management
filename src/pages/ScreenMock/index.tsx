import React, { useRef, useCallback, memo, useMemo } from 'react'
import { Button, message, Space, Popconfirm } from 'antd'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import ProTable from '@ant-design/pro-table'
import type { ActionType } from '@ant-design/pro-table'
import { getScreenMockList, deleteScreenMock, updateScreenMock, postScreenMock } from '@/services'
import AddModal from './AddModal'
import type { IFormRef } from './AddModal'
import column from './columns'

const ScreenMockManage = memo(() => {

  const actionRef = useRef<ActionType>()
  const formRef = useRef<IFormRef>(null)

  const handleDelete = useCallback(async (record: API_SCREEN.IGetScreenMockData) => {
    const { _id } = record

    await deleteScreenMock({ _id })
    .then(() => {
      return actionRef.current?.reloadAndRest?.()
    })
    .catch(() => {
      message.info("删除错误")
    })
  }, [])

  const handlEedit = useCallback((record?: API_SCREEN.IGetScreenMockData) => {
    formRef.current?.open(record)
  }, [])

  const handleConfrim = useCallback(async (value: API_SCREEN.IPostScreenMockDataParams & { _id?: string }) => {
    const method = value._id ? updateScreenMock : postScreenMock 
    return method(value as any)
    .then(() => {
      return true 
    })
    .then(() => {
      return actionRef.current?.reloadAndRest?.()
    })
    .catch(() => {
      message.info('操作错误')
      return false 
    })
  }, [])

  const columns: any[] = useMemo(() => {
    return [
      ...column ,
      {
        title: '操作',
        key: 'option',
        fixed: 'right',
        dataIndex: 'option',
        valueType: 'option',
        render: (_: any, record: API_SCREEN.IGetScreenMockData) => {
          return (
            <Space>
              <Popconfirm
                title="是否确定删除？"
                onConfirm={handleDelete.bind(null, record)}
              >
                <Button
                  style={{padding: 0}}
                  key='delete'
                  type="link"
                  danger
                >
                  删除
                </Button>
              </Popconfirm>
              <Button style={{padding: 0}} key='export' type="link" onClick={handlEedit.bind(null, record)}>编辑</Button>
            </Space>
          )
        }
      }
    ]
  
  }, [handleDelete, handlEedit])

  return (
    <PageHeaderWrapper>
      <ProTable
        scroll={{ x: 'max-content' }}
        headerTitle="大屏Mock数据列表"
        actionRef={actionRef}
        rowKey="_id"
        toolBarRender={() => {
          return [
            (
              <Button
                key='leadin'
                type='primary'
                onClick={() => handlEedit()}
              >
                新增
              </Button>
            )
          ]
        }}
        tableAlertRender={false}
        pagination={false}
        request={({ ...nextParams }) => {
          return getScreenMockList({
            ...nextParams as any 
          })
          .then((data) => {
            return { data: data.list, total: data.total }
          } )
          .catch(() => ({ data: [], total: 0 }))
        }}
        columns={columns}
        rowSelection={false}
      />
      <AddModal
        ref={formRef}
        onSubmit={handleConfrim}
      />
    </PageHeaderWrapper>
  )
})

export default ScreenMockManage