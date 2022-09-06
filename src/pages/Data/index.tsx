import React, { useRef, useCallback } from 'react'
import { Button, Dropdown, message, Menu, Space } from 'antd'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import ProTable from '@ant-design/pro-table'
import type { ActionType } from '@ant-design/pro-table'
import { DownOutlined, EllipsisOutlined } from '@ant-design/icons'
import { connect } from 'umi'
import pickBy from 'lodash/pickBy'
import identity from 'lodash/identity'
import { history } from 'umi'
import { deleteMovie, getMovieList, putMovieStatus, deleteMovieStatus, updateMovieTag } from '@/services'
import { commonDeleteMethod } from '@/utils'
import { mapStateToProps, mapDispatchToProps } from './connect'
import AddModal from './component/AddModal'
import column from './columns'

interface IProps {
  role: any
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

  const handleModalVisible = (id?: string) => {

    return history.push({
      pathname: '/data/main/edit',
      query: {
        id: id || ''
      }
    })
  }

  const updateMovieTagMethod = (id: string) => {
    return updateMovieTag({
      _id: id
    })
    .then(() => {
      message.info("操作成功")
    })
    .catch(() => {
      message.info("操作失败")
    })
  }

  /**
   *  删除节点
   * @param selectedRows
   */

  const handleRemove = async (selectedRows: API_DATA.IGetMovieData[]) => {
    return commonDeleteMethod<API_DATA.IGetMovieData>(selectedRows, (row: API_DATA.IGetMovieData) => {
      const { _id } = row
      return deleteMovie({
        _id
      })
    }, actionRef.current?.reloadAndRest)
  }

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
            <Button
              onClick={() => handleModalVisible(record["_id"])}
              type='link'
              disabled={record.status === 'DRAFT'}
            >
              编辑
            </Button>
            <Button
              danger
              onClick={() => handleRemove([record])}
              type='link'
              disabled={record.status === 'DRAFT'}
            >
              删除
            </Button>
            <Dropdown overlay={
              <Menu>
                <Menu.Item>
                  <a style={{color: '#1890ff'}} onClick={() => history.push(`/data/main/${record["_id"]}`)}>
                  详情
                  </a>
                </Menu.Item>
                {
                  (record.status === 'COMPLETE' || record.status === 'VERIFY') && (
                    <Menu.Item>
                      <a onClick={deleteStatus.bind(null, record["_id"])} style={{color: 'red'}}>
                        禁用
                      </a>
                    </Menu.Item>
                  )
                }
                {
                  (record.status === 'NOT_VERIFY' || record.status === 'VERIFY') && (
                    <Menu.Item>
                      <a style={{color: '#1890ff'}} onClick={putStatus.bind(null, record["_id"])}>
                        启用
                      </a>
                    </Menu.Item>
                  )
                }
                <Menu.Item>
                  <a style={{color: '#1890ff'}} onClick={() => updateMovieTagMethod(record["_id"])}>
                  标签重置
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

  return (
    <PageHeaderWrapper>
      <ProTable
        headerTitle="数据列表"
        actionRef={actionRef}
        scroll={{x: 'max-content'}}
        pagination={{defaultPageSize: 10}}
        rowKey="_id"
        toolBarRender={(action, { selectedRows }) => [
          <AddModal
            key={'add'}
            onCancel={() => handleModalVisible()}
            onConfirm={(data) => {
              actionRef.current?.reloadAndRest?.()
              handleModalVisible(data)
            }}
          />,
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
          .catch(() => ({ data: [], total: 0 }))
        }}
        columns={columns}
        rowSelection={{}}
      />
  </PageHeaderWrapper>
  )

}

export default connect(mapStateToProps, mapDispatchToProps)(CardList)