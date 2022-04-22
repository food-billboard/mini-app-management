import React, { useRef, createRef, useCallback, memo, useMemo } from 'react'
import { Button, Dropdown, message, Menu, Space } from 'antd'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import ProTable from '@ant-design/pro-table'
import type { ActionType } from '@ant-design/pro-table'
import { DownOutlined, PlusOutlined, EllipsisOutlined } from '@ant-design/icons'
import { connect } from 'umi'
import pickBy from 'lodash/pickBy'
import identity from 'lodash/identity'
import omit from 'lodash/omit'
import { history } from 'umi'
import { mapStateToProps, mapDispatchToProps } from './connect'
import CreateForm from './components/CreateForm'
import column from './columns'
import { getUserList, putUser, deleteUser, postUser } from '@/services'
import { commonDeleteMethod } from '@/utils'

const MemberManage = memo(() => {

  const actionRef = useRef<ActionType>()

  const modalRef = createRef<CreateForm>()

  /**
   * 添加节点
   * @param fields
   */
  const handleAdd = useCallback(async (fields: any) => {
    const hide = message.loading('正在添加')
    const method = fields["_id"] ? putUser : postUser

    const { avatar, roles, ...nextFields } = fields

    const params = {
      ...nextFields,
      avatar: Array.isArray(avatar) ? avatar[0] : avatar,
      roles: (Array.isArray(roles) ? roles : [roles]).join(',')
    }

    try {
      await method(params)
      hide()
      message.success('操作成功')
      return true
    } catch (error) {
      hide()
      message.error('操作失败请重试！')
      return false
    }
  }, [])

  /**
   *  删除节点
   * @param selectedRows
   */

  const handleRemove = useCallback(async (selectedRows: API_USER.IGetUserListResData[]) => {
    return commonDeleteMethod<API_USER.IGetUserListResData>(selectedRows, (row: API_USER.IGetUserListResData) => {
      const { _id } = row
      return deleteUser({
        _id
      })
    }, actionRef.current?.reloadAndRest)
  }, [actionRef])

  const handleModalVisible = (id?: string) => {
    modalRef.current?.open(id)
  }

  const columns: any[] = useMemo(() => {
    return [
      ...column ,
      {
        title: '操作',
        key: 'option',
        dataIndex: 'option',
        valueType: 'option',
        fixed: 'right',
        render: (_: any, record: API_USER.IGetUserListResData) => {
          return (
            <Space>
              <a
                onClick={() => handleModalVisible(record["_id"])}
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
                  <Menu.Item key="detail">
                    <a style={{color: '#1890ff'}} onClick={() => history.push(`/member/${record["_id"]}`)}>
                    详情
                    </a>
                  </Menu.Item>
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
  
  }, [])

  const onSubmit = useCallback(async value => {
    const { avatar } = value
    const newParams = omit(value, ['avatar'])
    if(Array.isArray(avatar) && avatar.length) [newParams.avatar] = avatar
    if(typeof avatar === 'string') newParams.avatar = avatar
    const success = await handleAdd(newParams)

    if (success) {
      actionRef.current?.reload()
      return Promise.resolve()
    }
    return Promise.reject()
  }, [])

  const fetchData = useCallback(async (params: any) => {
    const { current, ...nextParams } = params
    let newParams = {
      ...nextParams,
      currPage: current - 1
    }
    newParams = pickBy(newParams, identity)
    return getUserList(newParams)
    .then(({ list, total }) => ({ data: list, total }) )
    .catch(() => ({ data: [], total: 0 }))
  }, [])

  return (
    <PageHeaderWrapper>
      <ProTable
        scroll={{ x: 'max-content' }}
        headerTitle="用户列表"
        actionRef={actionRef}
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
        request={fetchData}
        columns={columns}
        rowSelection={{}}
      />
      <CreateForm
        onSubmit={onSubmit}
        ref={modalRef}
      />
  </PageHeaderWrapper>
  )
})

export default connect(mapStateToProps, mapDispatchToProps)(MemberManage)