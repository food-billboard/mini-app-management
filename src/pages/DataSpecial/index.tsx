import React, { useRef, useCallback, memo, useMemo } from 'react'
import { Button, Dropdown, message, Menu, Space } from 'antd'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import ProTable from '@ant-design/pro-table'
import type { ActionType } from '@ant-design/pro-table'
import { DownOutlined, PlusOutlined, EllipsisOutlined } from '@ant-design/icons'
import { connect, history } from 'umi'
import pick from 'lodash/pick'
import Form from './components/form'
import type { IFormRef } from './components/form'
import { mapStateToProps, mapDispatchToProps } from './connect'
import column from './columns'
import { getInstanceSpecialList, deleteInstanceSpecial, postInstanceSpecial, putInstanceSpecial } from '@/services'
import { commonDeleteMethod } from '@/utils'

const InstanceManage: React.FC<any> = () => {

  const actionRef = useRef<ActionType>()

  const modalRef = useRef<IFormRef>(null)

  const handleAdd = useCallback(async (values: API_INSTANCE.IPostInstanceSpecialParams | API_INSTANCE.IPutInstanceSpecialParams) => {
    try {
      if((values as API_INSTANCE.IPutInstanceInfoParams)["_id"]) {
        await putInstanceSpecial(values as API_INSTANCE.IPutInstanceSpecialParams)
      }else {
        await postInstanceSpecial(values as API_INSTANCE.IPostInstanceSpecialParams)
      }
      message.success('操作成功')
      return true 
    }catch(err) {
      message.error('操作失败')
      return false 
    }
  }, [])

  const putInfo = useCallback(async (value: boolean, record: API_INSTANCE.IGetInstanceSpecialData) => {
    await handleAdd({
      ...pick(record, ['name', '_id', 'description', 'poster']),
      movie: record.movie.map(item => item["_id"]),
      valid: value
    })
    actionRef.current?.reload()
  }, [])

  const handleModalVisible = useCallback((values?: API_INSTANCE.IGetInstanceSpecialData) => {
    modalRef.current?.open(values)
  }, [modalRef])

  const handleRemove = useCallback(async (selectedRows: API_INSTANCE.IGetInstanceSpecialData[]) => {
    return commonDeleteMethod<API_INSTANCE.IGetInstanceSpecialData>(selectedRows, (row: API_INSTANCE.IGetInstanceSpecialData) => {
      const { _id } = row
      return deleteInstanceSpecial({
        _id
      })
    }, actionRef.current?.reloadAndRest)
  }, [])

  const tableAlertRender = useMemo(() => {
    return ({ selectedRowKeys }: { selectedRowKeys: React.ReactText[], selectedRows: any[] }) => (
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
    )
  }, [])

  const toolbarRender: any = useMemo(() => {
    return (action: any, { selectedRows }: { selectedRows: API_INSTANCE.IGetInstanceSpecialData[] }) => [
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
    ]
  }, [])

  const columns: any[] = useMemo(() => {
    return [
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
                    <a style={{color: '#1890ff'}} onClick={() => history.push(`/data/special/${record["_id"]}`)}>
                    详情
                    </a>
                  </Menu.Item>
                  {
                    (valid) && (
                      <Menu.Item>
                        <a onClick={putInfo.bind(null, false, record)} style={{color: 'red'}}>
                          禁用
                        </a>
                      </Menu.Item>
                    )
                  }
                  {
                    (!valid) && (
                      <Menu.Item>
                        <a style={{color: '#1890ff'}} onClick={putInfo.bind(null, true, record)}>
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
  }, [putInfo, handleRemove, handleModalVisible])

  const onSearchChange = useCallback(async (params: any) => {
    let realParams: any = {}
    const { valid, ...nextParams } = params
    realParams = nextParams
    if(valid !== undefined) realParams.valid = !Number(valid)
    return getInstanceSpecialList(realParams)
    .then(({ list, total }) => ({ data: list, total }) )
    .catch(() => ({ data: [], total: 0 }))
  }, [])

  return (
    <PageHeaderWrapper>
      <ProTable
        headerTitle="专题列表"
        scroll={{x: 'max-content'}}
        actionRef={actionRef}
        rowKey="_id"
        toolBarRender={toolbarRender}
        tableAlertRender={tableAlertRender}
        request={onSearchChange}
        columns={columns}
        rowSelection={{}}
        pagination={{defaultPageSize: 10}}
      />
      <Form
        onSubmit={async value => {
          const success = await handleAdd(value)
          if (success) {
            actionRef.current?.reload()
            return Promise.resolve()
          }
          return Promise.reject()
        }}
        ref={modalRef}
      />
  </PageHeaderWrapper>
  )

}

export default connect(mapStateToProps, mapDispatchToProps)(memo(InstanceManage))