import React, { useRef, useCallback } from 'react'
import { Button, Dropdown, message, Menu, Space, Modal } from 'antd'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import ProTable, { ActionType } from '@ant-design/pro-table'
import { DownOutlined, PlusOutlined } from '@ant-design/icons'
import { connect } from 'umi'
import pickBy from 'lodash/pickBy'
import identity from 'lodash/identity'
import Form, { IFormRef } from './components/CreateForm'
import { mapStateToProps, mapDispatchToProps } from './connect'
import column from './columns'
import { deleteRoom, getRoomList, putRoom, postRoom } from '@/services'
import { commonDeleteMethod } from '@/utils'

interface IProps {
  role: any
}

const CardList: React.FC<IProps> = (props: any) => {

  const actionRef = useRef<ActionType>()

  const formRef = useRef<IFormRef>(null)

  const columns: any[] = [
    ...column ,
    {
      title: '操作',
      key: 'option',
      dataIndex: 'option',
      valueType: 'option',
      render: (_: any, record: API_CHAT.IGetRoomListResData) => {
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
          </Space>
        )
      }
    }
  ]

  const handleRemove = async (selectedRows: API_CHAT.IGetRoomListResData[]) => {
    return commonDeleteMethod<API_CHAT.IGetRoomListResData>(selectedRows, (row: API_CHAT.IGetRoomListResData) => {
      const { _id } = row
      return deleteRoom({
        _id
      })
    }, actionRef.current?.reloadAndRest)  
  }

  const onSubmit = useCallback(async (value: API_CHAT.IPutRoomParams) => {
    try {
      if(value._id) { 
        await putRoom(value)
      }else {
        await postRoom(value as API_CHAT.IPostRoomParams)
      }
      message.info('操作成功')
      actionRef.current?.reloadAndRest?.()
      return Promise.resolve()
    }catch(err) {
      message.info('操作失败，请重试')
      return Promise.reject()
    }
  }, [])

  const handleModalVisible = (data?: API_CHAT.IGetRoomListResData) => {
    return formRef.current?.open(data)
  }

  return (
    <PageHeaderWrapper>
      <ProTable
        headerTitle="聊天室列表"
        actionRef={actionRef}
        scroll={{ x: 'max-content' }}
        pagination={{defaultPageSize: 10}}
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
          const { createdAt=[], current, ...nextParams } = params
          let newParams = {
            ...nextParams,
            currPage: current - 1
          }
          newParams = pickBy(newParams, identity)
          return getRoomList(newParams)
          .then(({ list, total }) => ({ data: list, total }) )
          .catch(_ => ({ data: [], total: 0 }))
        }}
        columns={columns}
        rowSelection={{}}
      />
      <Form
        ref={formRef}
        onSubmit={onSubmit}
      />
  </PageHeaderWrapper>
  )

}

export default connect(mapStateToProps, mapDispatchToProps)(CardList)