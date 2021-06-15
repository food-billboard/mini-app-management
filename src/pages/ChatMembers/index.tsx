import React, { useRef, useCallback, useState, useEffect } from 'react'
import { Button, Dropdown, message, Menu, Space, Modal } from 'antd'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import ProTable, { ActionType } from '@ant-design/pro-table'
import { DownOutlined, PlusOutlined } from '@ant-design/icons'
import { connect, history } from 'umi'
import pickBy from 'lodash/pickBy'
import identity from 'lodash/identity'
import Form, { IFormRef } from './components/CreateForm'
import { mapStateToProps, mapDispatchToProps } from './connect'
import column from './columns'
import { deleteMember, getMemberList, postMember } from '@/services'
import { commonDeleteMethod } from '@/utils'

interface IProps {
  role: any
}

const CardList: React.FC<IProps> = (props: any) => {

  const [ roomId, setRoomId ] = useState<string>('')

  const actionRef = useRef<ActionType>()

  const formRef = useRef<IFormRef>(null)

  const columns: any[] = [
    ...column ,
    {
      title: '操作',
      key: 'option',
      dataIndex: 'option',
      valueType: 'option',
      render: (_: any, record: API_CHAT.IGetMemberListResData) => {
        return (
          <Space>
            {/* <a
              onClick={() => handleModalVisible(record)}
            >
              编辑
            </a> */}
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

  const handleRemove = async (selectedRows: API_CHAT.IGetMemberListResData[]) => {
    return commonDeleteMethod<API_CHAT.IGetMemberListResData>(selectedRows, (row: API_CHAT.IGetMemberListResData) => {
      const { _id } = row
      return deleteMember({
        _id,
        room: roomId
      })
    }, actionRef.current?.reloadAndRest)

  }

  const onSubmit = useCallback(async (value: API_CHAT.IPostMemberParams) => {
    try {
      await postMember(value as API_CHAT.IPostMemberParams)
      message.info('操作成功')
      actionRef.current?.reloadAndRest?.()
    }catch(err) {
      message.info('操作失败，请重试')
    }
  }, [])

  const handleModalVisible = (data?: API_CHAT.IGetMemberListResData) => {
    return formRef.current?.open(roomId)
  }

  useEffect(() => {
    const { location: { pathname } } = history
    const [roomId] = pathname.split('/').slice(-1) || []
    setRoomId(roomId)
  }, [])

  useEffect(() => {
    if(!!roomId) actionRef.current?.reloadAndRest?.()
  }, [roomId])

  return (
    <PageHeaderWrapper>
      <ProTable
        search={false}
        headerTitle="成员列表"
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
          if(!roomId) return {
            data: [],
            total: 0
          }
          const { createdAt=[], current, ...nextParams } = params
          let newParams = {
            ...nextParams,
            currPage: current - 1,
            room: roomId
          }
          newParams = pickBy(newParams, identity)
          return getMemberList(newParams)
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