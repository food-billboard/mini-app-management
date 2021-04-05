import React, { useRef, useCallback, memo } from 'react'
import { Button, Dropdown, message, Menu, Space, Modal } from 'antd'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import ProTable, { ActionType } from '@ant-design/pro-table'
import { DownOutlined, PlusOutlined, EllipsisOutlined } from '@ant-design/icons'
import { connect, history } from 'umi'
import pick from 'lodash/pick'
import Form, { IFormRef } from './components/form'
import { mapStateToProps, mapDispatchToProps } from './connect'
import column from './columns'
import { getInstanceSpecialList, deleteInstanceSpecial, postInstanceSpecial, putInstanceSpecial } from '@/services'

const InstanceManage: React.FC<any> = () => {

  const actionRef = useRef<ActionType>()

  const modalRef = useRef<IFormRef>(null)

  const handleAdd = useCallback(async (values: API_INSTANCE.IPostInstanceSpecialParams | API_INSTANCE.IPutInstanceSpecialParams) => {
    try {
      if((values as API_INSTANCE.IPutInstanceInfoParams)._id) {
        await putInstanceSpecial(values as API_INSTANCE.IPutInstanceSpecialParams)
      }else {
        await postInstanceSpecial(values as API_INSTANCE.IPostInstanceSpecialParams)
      }
      message.success('操作成功')
      return true 
    }catch(err) {
      console.error(err)
      message.error('操作失败')
      return false 
    }
  }, [])

  const putInfo = useCallback(async (value: boolean, record: API_INSTANCE.IGetInstanceSpecialData) => {
    await handleAdd({
      ...pick(record, ['name', '_id', 'description', 'poster']),
      movie: record.movie.map(item => item._id),
      valid: value
    })
  }, [])

  const handleModalVisible = useCallback((values?: API_INSTANCE.IGetInstanceSpecialData) => {
    modalRef.current?.open(values)
  }, [modalRef])

  const handleRemove = useCallback(async (selectedRows: API_INSTANCE.IGetInstanceSpecialData[]) => {

    const res = await new Promise((resolve) => {
  
      Modal.confirm({
        cancelText: '取消',
        centered: true,
        content: '是否确定删除',
        okText: '确定',
        title: '提示',
        onCancel: function(close) {
          close()
          resolve(false)
        },
        onOk: function(close) {
          close()
          resolve(true)
        }
      })
  
    })
  
    if(!res) return
  
    const hide = message.loading('正在删除')
    if (!selectedRows) return true
  
    const response = await Promise.all(selectedRows.map((row: API_INSTANCE.IGetInstanceSpecialData) => {
      const { _id } = row
      return deleteInstanceSpecial({
        _id
      })
    }))
    .then(_ => {
      hide()
      message.success('删除成功，即将刷新')
      return true
    })
    .catch(err => {
      hide()
      message.error('删除失败，请重试')
      return false
    })
  
    return response
  
  }, [])

  const columns: any[] = [
    ...column,
    {
      title: '操作',
      key: 'option',
      dataIndex: 'option',
      valueType: 'option',
      render: (_: any, record: API_INSTANCE.IGetInstanceSpecialData) => {
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
            <Dropdown overlay={
              <Menu>
                <Menu.Item>
                  <a style={{color: '#1890ff'}} onClick={() => history.push(`/data/special/${record._id}`)}>
                  详情
                  </a>
                </Menu.Item>
                {
                  (valid) && (
                    <Menu.Item>
                      <a onClick={putInfo.bind(this, false, record)} style={{color: 'red'}}>
                        禁用
                      </a>
                    </Menu.Item>
                  )
                }
                {
                  (!valid) && (
                    <Menu.Item>
                      <a style={{color: '#1890ff'}} onClick={putInfo.bind(this, true, record)}>
                        启用
                      </a>
                    </Menu.Item>
                  )
                }
              </Menu>
            }>
              <a onClick={e => e.preventDefault()}>
                <EllipsisOutlined />
              </a>
            </Dropdown>
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
        rowKey="_id"
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
                      action?.reload()
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
        tableAlertRender={({ selectedRowKeys, selectedRows } : { selectedRowKeys: React.ReactText[], selectedRows: any[] }) => (
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
        request={async (params: any) => {
          return getInstanceSpecialList(params)
          .then(({ list }) => ({ data: list }) )
          .catch(_ => ({ data: [] }))
        }}
        columns={columns}
        rowSelection={{}}
      />
      <Form
        onSubmit={async value => {
          const success = await handleAdd(value)
          if (success) {
            actionRef.current?.reload()
          }
        }}
        ref={modalRef}
      />
  </PageHeaderWrapper>
  )

}

export default connect(mapStateToProps, mapDispatchToProps)(memo(InstanceManage))