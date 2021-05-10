import React, { useRef, useCallback, memo, useMemo } from 'react'
import { Button, Dropdown, message, Menu, Space, Modal } from 'antd'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import ProTable, { ActionType } from '@ant-design/pro-table'
import { DownOutlined } from '@ant-design/icons'
import { connect } from 'umi'
import merge from 'lodash/merge'
import pickBy from 'lodash/pickBy'
import pick from 'lodash/pick'
import identity from 'lodash/identity'
import FeedbackModal, { IFeedbackModalRef, TFeedbackEditData } from './components/FeedbackModal'
import { mapStateToProps, mapDispatchToProps } from './connect'
import column from './columns'
import { getUserFeedbackList, putUserFeedback, deleteUserFeedback } from '@/services'

const FeedbackManage = memo(() => {

  const actionRef = useRef<ActionType>()
  const feedbackRef = useRef<IFeedbackModalRef>(null)

  /**
   * 添加节点
   * @param fields
   */
  const handleAdd = useCallback(async (fields: TFeedbackEditData) => {

    const hide = message.loading('正在修改')
    const params = pick(fields, ['_id', 'status', 'description']) as API_USER.IPutFeedbackParams

    return putUserFeedback(params)
    .then(_ => {
      message.success('操作成功')
      hide()
      actionRef.current?.reload()
    })
    .catch(err => {
      message.success('操作失败，请重试')
      hide()
    })

  }, [])

  /**
   *  删除节点
   * @param selectedRows
   */

  const handleRemove = useCallback(async (selectedRows: API_USER.IGetFeedbackData[]) => {

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

    const response = await Promise.all(selectedRows.map((row: API_USER.IGetFeedbackData) => {
      const { _id } = row
      return deleteUserFeedback({
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

  const columns: any[] = useMemo(() => {
    return [
      ...column ,
      {
        title: '操作',
        key: 'option',
        dataIndex: 'option',
        valueType: 'option',
        render: (_: any, record: API_USER.IGetFeedbackData) => {
          return (
            <Space>
              {
                record.status === 'DEALING' && (
                  <a
                    onClick={edit.bind(this, record)}
                  >
                    完成处理
                  </a>
                )
              }
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
    const { current, ...nextParams } = params
    let newParams = {
      ...nextParams,
      currPage: current - 1
    }
    newParams = pickBy(newParams, identity)
    return getUserFeedbackList(newParams)
    .then(({ list, total }) => ({ data: list, total }) )
    .catch(_ => ({ data: [], total: 0 }))
  }, [])

  const edit = useCallback((data: API_USER.IGetFeedbackData) => {
    feedbackRef.current?.open(merge({}, data, { description: '' }))
  }, [])

  const onInputOk = useCallback((value: TFeedbackEditData) => {
    return handleAdd(value)
    .then(_ => true)
  }, [handleAdd])

  return (
    <PageHeaderWrapper>
      <ProTable
        scroll={{ x: 'max-content' }}
        headerTitle="用户反馈列表"
        actionRef={actionRef}
        rowKey="_id"
        toolBarRender={(action, { selectedRows }) => [
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
        request={fetchData}
        columns={columns}
        rowSelection={{}}
      />
      <FeedbackModal
        ref={feedbackRef}
        onOk={onInputOk}
      />
  </PageHeaderWrapper>
  )
})

export default connect(mapStateToProps, mapDispatchToProps)(FeedbackManage)