import React, { useRef, createRef } from 'react'
import { Button, Dropdown, message, Menu } from 'antd'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import ProTable, { ActionType } from '@ant-design/pro-table'
import { DownOutlined, PlusOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import pickBy from 'lodash/pickBy'
import identity from 'lodash/identity'
import { history } from 'umi'
import { mapStateToProps, mapDispatchToProps } from './connect'
import CreateForm from './component/CreateForm'
import column from './columns'
import { deleteMovie, getMovieList, postMovie, putMovie } from '@/services'

interface IProps {
  role: any
}

interface IState {}

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: any) => {
  const hide = message.loading('正在添加')
  const method = !!fields._id ? putMovie : postMovie

  try {
    await method(fields)
    hide()
    message.success('操作成功')
    return true
  } catch (error) {
    hide()
    message.error('操作失败请重试！')
    return false
  }
}

/**
 *  删除节点
 * @param selectedRows
 */

const handleRemove = async (selectedRows: API_DATA.IGetMovieData[]) => {
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

  const modalRef = createRef<CreateForm>()

  const columns: any[] = [
    ...column ,
    {
      title: '操作',
      key: 'option',
      dataIndex: 'option',
      valueType: 'option',
      render: (_: any, record: API_DATA.IGetMovieData) => {
        return (
          <>
            <a
              onClick={() => handleModalVisible(record._id)}
            >
              编辑
            </a>
            <a
              onClick={() => handleRemove([record])}
            >
              删除
            </a>
            <a
              onClick={() => history.push(`/data/${record._id}`)}
            >
              详情
            </a>
          </>
        )
      }
    }
  ]

  const handleModalVisible = (id?: string) => {
    modalRef.current?.open(id)
  }

  return (
    <PageHeaderWrapper>
      <ProTable
        headerTitle="数据列表"
        actionRef={actionRef}
        rowKey="key"
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
        request={(params: any) => {
          const { createdAt=[], current, ...nextParams } = params
          let newParams = {
            ...nextParams,
            start_date: createdAt[0],
            end_date: createdAt[1],
            currPage: current
          }
          newParams = pickBy(newParams, identity)
          return getMovieList(newParams)
          .then(({ list }) => ({ data: list }) )
          .catch(_ => ({ data: [] }))
        }}
        columns={columns}
        rowSelection={{}}
      />
      <CreateForm
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

export default connect(mapStateToProps, mapDispatchToProps)(CardList)