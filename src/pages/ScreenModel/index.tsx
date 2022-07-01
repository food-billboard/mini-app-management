import React, { useRef, useCallback, memo, useMemo } from 'react'
import { Button, message, Space, Popconfirm } from 'antd'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import ProTable from '@ant-design/pro-table'
import type { ActionType } from '@ant-design/pro-table'
import { getScreenModelList, deleteScreenModel } from '@/services'
import column from './columns'
import { exportData, LeadIn } from '../Screen/utils'

const ScreenManage = memo(() => {

  const actionRef = useRef<ActionType>()

  const handleDelete = useCallback(async (record: API_SCREEN.IGetScreenListData) => {
    const { _id } = record

    await deleteScreenModel({ _id })
    .then(() => {
      return actionRef.current?.reloadAndRest?.()
    })
    .catch(() => {
      message.info("删除错误")
    })
  }, [])

  const handleExport = useCallback(async (record: API_SCREEN.IGetScreenListData) => {
    const { _id } = record

    await exportData({ _id, type: 'model' })
    .catch(() => {
      message.info("导出失败")
    })
  }, [])

  const handleLeadIn = useCallback(async () => {
    LeadIn('model', () => {
      return actionRef.current?.reloadAndRest?.()
    });
  }, []);

  const columns: any[] = useMemo(() => {
    return [
      ...column ,
      {
        title: '操作',
        key: 'option',
        dataIndex: 'option',
        valueType: 'option',
        render: (_: any, record: API_SCREEN.IGetScreenListData) => {
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
              <Button style={{padding: 0}} key='export' type="link" onClick={handleExport.bind(null, record)}>导出</Button>
            </Space>
          )
        }
      }
    ]
  
  }, [handleDelete, handleExport])

  return (
    <PageHeaderWrapper>
      <ProTable
        scroll={{ x: 'max-content' }}
        headerTitle="模板列表"
        actionRef={actionRef}
        rowKey="_id"
        toolBarRender={() => {
          return [
            (
              <Button
                key='leadin'
                type='primary'
                onClick={handleLeadIn}
              >
                导入
              </Button>
            )
          ]
        }}
        tableAlertRender={false}
        pagination={{
          pageSize: 10
        }}
        request={({ current, ...nextParams }) => {
          return getScreenModelList({
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
    </PageHeaderWrapper>
  )
})

export default ScreenManage