import React, { useRef, createRef, useCallback } from 'react'
import { Button, Dropdown, message, Menu, Space, Modal } from 'antd'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import ProTable, { ActionType } from '@ant-design/pro-table'
import { DownOutlined, PlusOutlined, EllipsisOutlined } from '@ant-design/icons'
import { connect } from 'umi'
import pickBy from 'lodash/pickBy'
import identity from 'lodash/identity'
import { history } from 'umi'
import { mapStateToProps, mapDispatchToProps } from './connect'
import column from './columns'
import { deleteMovie, getMovieList, putMovieStatus, deleteMovieStatus } from '@/services'

interface IProps {
  role: any
}

/**
 *  删除节点
 * @param selectedRows
 */

const handleRemove = async (selectedRows: API_DATA.IGetMovieData[]) => {

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

  const response = await Promise.all(selectedRows.map((row: API_DATA.IGetMovieData) => {
    const { _id } = row
    return deleteMovie({
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

}

const CardList: React.FC<IProps> = () => {

  const actionRef = useRef<ActionType>()

  const putStatus = useCallback(async (id: string, e) => {
    e?.preventDefault()
    await putMovieStatus({ _id: id })
    message.info('修改成功')
    actionRef.current?.reload()
  }, [])

  const deleteStatus = useCallback(async (id: string, e) => {
    e?.preventDefault()
    await deleteMovieStatus({ _id: id })
    message.info('删除成功')
    actionRef.current?.reload()
  }, [])

  const columns: any[] = [
    ...column ,
    {
      title: '操作',
      key: 'option',
      dataIndex: 'option',
      valueType: 'option',
      render: (_: any, record: API_DATA.IGetMovieData) => {
        return (
          <Space>
            <a
              onClick={() => handleModalVisible(record._id)}
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
                  <a style={{color: '#1890ff'}} onClick={() => history.push(`/data/main/${record._id}`)}>
                  详情
                  </a>
                </Menu.Item>
                {
                  (record.status === 'COMPLETE' || record.status === 'VERIFY') && (
                    <Menu.Item>
                      <a onClick={deleteStatus.bind(null, record._id)} style={{color: 'red'}}>
                        禁用
                      </a>
                    </Menu.Item>
                  )
                }
                {
                  (record.status === 'NOT_VERIFY' || record.status === 'VERIFY') && (
                    <Menu.Item>
                      <a style={{color: '#1890ff'}} onClick={putStatus.bind(null, record._id)}>
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

  const handleModalVisible = (id?: string) => {
    return history.push({
      pathname: '/data/main/edit',
      query: {
        id: id || ''
      }
    })
  }

  return (
    <PageHeaderWrapper>
      <ProTable
        headerTitle="数据列表"
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
          const { createdAt=[], current, ...nextParams } = params
          let newParams = {
            ...nextParams,
            start_date: createdAt[0],
            end_date: createdAt[1],
            currPage: current - 1
          }
          newParams = pickBy(newParams, identity)
          return getMovieList(newParams)
          .then(({ list, total }) => ({ data: list, total }) )
          .catch(_ => ({ data: [], total: 0 }))
        }}
        columns={columns}
        rowSelection={{}}
      />
  </PageHeaderWrapper>
  )

}

export default connect(mapStateToProps, mapDispatchToProps)(CardList)