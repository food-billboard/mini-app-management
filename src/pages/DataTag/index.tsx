import React, { useRef, useCallback, memo, useMemo } from 'react'
import { Button, Dropdown, message, Menu, Space } from 'antd'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import ProTable from '@ant-design/pro-table'
import type { ActionType } from '@ant-design/pro-table'
import { DownOutlined } from '@ant-design/icons'
import { connect } from 'umi'
import pickBy from 'lodash/pickBy'
import identity from 'lodash/identity'
import { mapStateToProps, mapDispatchToProps } from './connect'
import column from './columns'
import { getMovieTagList, putMovieTag, deleteMovieTag } from '@/services'
import { commonDeleteMethod } from '@/utils'

const TagManage = memo(() => {

  const actionRef = useRef<ActionType>()

  /**
   * 修改节点
   * @param fields
   */
  const handleAdd = useCallback(async (record: API_DATA.IGetMovieTagResData) => {
    const hide = message.loading('正在修改')

    try {
      await putMovieTag({ _id: record["_id"], valid: !record.valid })
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

  const handleRemove = useCallback(async (selectedRows: API_DATA.IGetMovieTagResData[]) => {
    return commonDeleteMethod<API_DATA.IGetMovieTagResData>(selectedRows, (row: API_DATA.IGetMovieTagResData) => {
      const { _id } = row
      return deleteMovieTag({
        _id
      })
    }, actionRef.current?.reloadAndRest)
  }, [])

  const columns: any[] = useMemo(() => {
    return [
      ...column ,
      {
        title: '操作',
        key: 'option',
        dataIndex: 'option',
        valueType: 'option',
        render: (_: any, record: API_DATA.IGetMovieTagResData) => {
          return (
            <Space>
              <a
                style={{color: record.valid ? 'red' : 'currentcolor'}}
                onClick={() => handleAdd(record)}
              >
                {record.valid ? '禁用' : '启用'}
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
  
  }, [])

  const fetchData = useCallback(async (params: any) => {
    const { current, valid, ...nextParams } = params
    let newParams = {
      ...nextParams,
      currPage: current - 1
    }
    if(valid !== undefined) {
      if(valid === 'true') {
        newParams.valid = true 
      }else {
        newParams.valid = false
      }
    }
    newParams = pickBy(newParams, identity)
    return getMovieTagList(newParams)
    .then(({ list, total }) => ({ data: list, total }) )
    .catch(() => ({ data: [], total: 0 }))
  }, [])

  return (
    <PageHeaderWrapper>
      <ProTable
        headerTitle="数据标签列表"
        actionRef={actionRef}
        scroll={{x: 'max-content'}}
        pagination={{defaultPageSize: 10}}
        rowKey="_id"
        toolBarRender={(action, { selectedRows }) => [
          selectedRows && selectedRows.length > 0 && (
            <Dropdown
              overlay={
                <Menu
                  onClick={async e => {
                    if (e.key === 'remove') {
                      await handleRemove(selectedRows)
                      actionRef.current?.reloadAndRest?.();
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
  </PageHeaderWrapper>
  )
})

export default connect(mapStateToProps, mapDispatchToProps)(TagManage)