import React, { useRef, useCallback, memo } from 'react'
import { Button, Dropdown, message, Menu, Space } from 'antd'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import ProTable from '@ant-design/pro-table'
import type { ActionType } from '@ant-design/pro-table'
import { DownOutlined, PlusOutlined } from '@ant-design/icons'
import { connect } from 'umi'
import pick from 'lodash/pick'
import Form from './components/form'
import type { IFormRef } from './components/form'
import { mapStateToProps, mapDispatchToProps } from './connect'
import column from './columns'
import { getInstanceInfoList, deleteInstanceInfo, postInstanceInfo, putInstanceInfo } from '@/services'
import { commonDeleteMethod, withTry } from '@/utils'

const InstanceManage: React.FC<any> = () => {

  const actionRef = useRef<ActionType>()

  const modalRef = useRef<IFormRef>(null)

  const handleAdd = useCallback(async (values: API_INSTANCE.IPostInstanceInfoParams | API_INSTANCE.IPutInstanceInfoParams) => {
    try {
      if((values as API_INSTANCE.IPutInstanceInfoParams)["_id"]) {
        await putInstanceInfo(values as API_INSTANCE.IPutInstanceInfoParams)
      }else {
        await postInstanceInfo(values as API_INSTANCE.IPostInstanceInfoParams)
      }
      message.success('操作成功')
      return Promise.resolve() 
    }catch(err) {
      message.error('操作失败')
      return Promise.reject(new Error("false")) 
    }
  }, [])

  const putInfo = useCallback(async (value: boolean, record: API_INSTANCE.IGetInstanceInfoData) => {
    await handleAdd({
      ...pick(record, ['info', 'notice', '_id']),
      valid: value
    })
    actionRef.current?.reloadAndRest?.()
  }, [actionRef, handleAdd])

  const handleModalVisible = useCallback((values?: API_INSTANCE.IGetInstanceInfoData) => {
    modalRef.current?.open(values)
  }, [modalRef])

  const handleRemove = useCallback(async (selectedRows: API_INSTANCE.IGetInstanceInfoData[]) => {
    return commonDeleteMethod<API_INSTANCE.IGetInstanceInfoData>(selectedRows, (row: API_INSTANCE.IGetInstanceInfoData) => {
      const { _id } = row
      return deleteInstanceInfo({
        _id
      })
    }, actionRef.current?.reloadAndRest)
  }, [])

  const columns: any[] = [
    ...column,
    {
      title: '操作',
      key: 'opera',
      dataIndex: 'opera',
      valueType: 'option',
      fixed: 'right',
      render: (_: any, record: API_INSTANCE.IGetInstanceInfoData) => {
        const { valid } = record
        return (
          <Space>
            <a
              onClick={() => handleModalVisible(record)}
            >
              编辑
            </a>
            <a
              style={{color: 'red'}}
              onClick={() => handleRemove([record])}
            >
              删除
            </a>
            {
              (valid) && (
                <a onClick={putInfo.bind(null, false, record)} style={{color: 'red'}}>
                  禁用
                </a>
              )
            }
            {
              (!valid) && (
                <a style={{color: '#1890ff'}} onClick={putInfo.bind(null, true, record)}>
                  启用
                </a>
              )
            }
          </Space>
        )
      }
    }
  ]

  return (
    <PageHeaderWrapper>
      <ProTable
        search={false}
        headerTitle="实例列表"
        actionRef={actionRef}
        pagination={{defaultPageSize: 10}}
        rowKey="_id"
        scroll={{x: "max-content"}}
        toolBarRender={(action, { selectedRows }) => [
          <Button key={'add'} icon={<PlusOutlined />} type="primary" onClick={() => handleModalVisible()}>
            新建
          </Button>,
          selectedRows && selectedRows.length > 0 && (
            <Dropdown
              overlay={
                <Menu
                  onClick={async e => {
                    if (e.key === 'remove') {
                      await handleRemove(selectedRows)
                    }
                  }}
                  selectedKeys={[]}
                >
                  <Menu.Item key="remove">批量删除</Menu.Item>
                </Menu>
              }
            >
              <Button key="many">
                批量操作 <DownOutlined />
              </Button>
            </Dropdown>
          ),
        ]}
        tableAlertRender={({ selectedRowKeys }: { selectedRowKeys: React.ReactText[], selectedRows: any[] }) => (
          <div>
            已选择{' '}
            <a
              style={{
                fontWeight: 600,
              }}
            >
              {selectedRowKeys.length}
            </a>{' '}
            项&nbsp;&nbsp;
            <span>
              {/* 服务调用次数总计 {selectedRows.reduce((pre, item) => pre + item.callNo, 0)} 万 */}
            </span>
          </div>
        )}
        request={async () => {
          return getInstanceInfoList()
          .then(({ list, total }) => ({ data: list, total }) )
          .catch(() => ({ data: [], total: 0 }))
        }}
        columns={columns}
        rowSelection={{}}
      />
      <Form
        onSubmit={async value => {
          await withTry(handleAdd)(value)
          actionRef.current?.reload()
        }}
        ref={modalRef}
      />
  </PageHeaderWrapper>
  )

}

export default connect(mapStateToProps, mapDispatchToProps)(memo(InstanceManage))