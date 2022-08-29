import React, { useRef, useCallback, memo, useMemo } from 'react'
import { Button, message, Space, Popconfirm } from 'antd'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import ProTable from '@ant-design/pro-table'
import type { ActionType } from '@ant-design/pro-table'
import { getThirdList, deleteThirdData } from '@/services'
import AddModal from './components/AddModal'
import TestModal from './components/TestModal'
import type { AddModalRef } from './components/AddModal'
import type { TestModalRef } from './components/TestModal'
import column from './columns'

const ThirdPartyManage = memo(() => {

  const actionRef = useRef<ActionType>()
  const addModalRef = useRef<AddModalRef>(null)
  const testModalRef = useRef<TestModalRef>(null)

  const handleDelete = useCallback(async (record: API_THIRD.GetThirdListData) => {
    const { _id } = record

    await deleteThirdData({ _id })
    .then(() => {
      return actionRef.current?.reloadAndRest?.()
    })
    .catch(() => {
      message.info("删除错误")
    })
  }, [])

  const handleUpdate = useCallback(async (record: API_THIRD.GetThirdListData) => {
    addModalRef.current?.open(record)
  }, [])

  const handleAdd = useCallback(async () => {
    addModalRef.current?.open()
  }, []);

  const handleTest = useCallback((record: API_THIRD.GetThirdListData) => {
    testModalRef.current?.open(record)
  }, [])

  const columns: any[] = useMemo(() => {
    return [
      ...column ,
      {
        title: '操作',
        key: 'option',
        dataIndex: 'option',
        valueType: 'option',
        fixed: 'right',
        render: (_: any, record: API_THIRD.GetThirdListData) => {
          return (
            <Space>
              <Popconfirm
                title='是否确定删除？'
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
              <Button style={{padding: 0}} key='update' type="link" onClick={handleUpdate.bind(null, record)}>修改</Button>
              <Button style={{padding: 0}} key='test' type="link" onClick={handleTest.bind(null, record)}>测试</Button>
            </Space>
          )
        }
      }
    ]
  
  }, [handleDelete, handleUpdate, handleTest])

  return (
    <PageHeaderWrapper>
      <ProTable
        scroll={{ x: 'max-content' }}
        headerTitle="第三方接口列表"
        actionRef={actionRef}
        rowKey="_id"
        toolBarRender={() => {
          return [
            (
              <Button
                key='add'
                type='primary'
                onClick={handleAdd}
              >
                新增
              </Button>
            )
          ]
        }}
        tableAlertRender={false}
        pagination={{
          pageSize: 10
        }}
        request={({ current, createdAt, ...nextParams }) => {
          return getThirdList({
            currPage: (current || 1) - 1,
            ...nextParams
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
        ref={addModalRef}
        onConfrim={() => actionRef.current?.reloadAndRest?.()}
      />
      <TestModal
        ref={testModalRef}
      />
    </PageHeaderWrapper>
  )
})

export default ThirdPartyManage