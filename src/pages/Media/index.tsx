import React, { useRef, useCallback, memo, useMemo, useState } from 'react'
import { Button, Dropdown, message, Menu, Space, Modal } from 'antd'
import { PageContainer } from '@ant-design/pro-layout'
import ProTable, { ActionType } from '@ant-design/pro-table'
import { DownOutlined, EllipsisOutlined } from '@ant-design/icons'
import { connect, history } from 'umi'
import { mapStateToProps, mapDispatchToProps } from './connect'
import CreateForm, { IFormRef } from './components/CreateForm'
import column from './columns'
import { MEDIA_TYPE_MAP, sleep } from '@/utils'
import { getMediaList, updateMedia, deleteMedia, getMediaValid } from '@/services'

const MediaManage = memo(() => {

  const actionRef = useRef<ActionType>()

  const modalRef = useRef<IFormRef>(null)

  const [ activeKey, setActiveKey ] = useState<keyof typeof MEDIA_TYPE_MAP>('image')

  const handleAdd = useCallback(async (fields: any) => {
    const hide = message.loading('正在修改')

    let params = {
      ...fields,
      type: MEDIA_TYPE_MAP[activeKey]
    }

    try {
      await updateMedia(params)
      hide()
      message.success('操作成功')
      return true
    } catch (error) {
      hide()
      message.error('操作失败请重试！')
      return false
    }
  }, [activeKey])

  const getDetail = useCallback((src: string | string[]) => {
    const urls = Array.isArray(src) ? src : [src]
    return history.push({
      pathname: `/media/${activeKey}`,
      query: {
        url: urls
      }
    })
  }, [activeKey])

  const handleRemove = useCallback(async (selectedRows: API_MEDIA.IGetMediaListData[]) => {

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

    const response = await Promise.all(selectedRows.map((row: API_MEDIA.IGetMediaListData) => {
      const { _id } = row
      return deleteMedia({
        _id,
        type: MEDIA_TYPE_MAP[activeKey] as any
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

  }, [activeKey])

  const getProcess = useCallback(async (id: string) => {
    const hide = message.loading('正在检查')
    return new Promise<boolean>((resolve) => {
      Modal.confirm({
        okText: '是',
        cancelText: '否',
        title: '提示',
        content: '如果该资源未完成，是否自动删除??',
        onCancel: (close) => {
          close()
          resolve(false)
        },
        onOk: (close) => {
          close()
          resolve(true)
        }
      })
    })
    .then((isDelete: boolean) => {
      return getMediaValid({
        isdelete: isDelete,
        type: MEDIA_TYPE_MAP[activeKey] as any,
        _id: id
      })
    })
    .then(data => {
      const { complete, error, exists } = data
      if(complete) {
        message.info('当前资源已上传完成')
      }else if(exists) {
        message.info('当前资源存在但未上传完成')
      }else {
        message.info('当前资源出错')
      }
      hide()
    })
    .catch(err => {
      hide()
      message.info('操作失败，请重试')
    })
  }, [activeKey])

  const columns: any[] = useMemo(() => {
    return [
      ...column ,
      {
        title: '操作',
        key: 'option',
        dataIndex: 'option',
        valueType: 'option',
        render: (_: any, record: API_MEDIA.IGetMediaListData) => {
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
                    <a style={{color: '#1890ff'}} onClick={getDetail.bind(this, record.src)}>
                    详情
                    </a>
                  </Menu.Item>
                  <Menu.Item>
                    <a style={{color: '#1890ff'}} onClick={getProcess.bind(this, record._id)}>
                      完成度检测
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
  
  }, [getDetail, handleRemove, getProcess])

  const handleModalVisible = (value: API_MEDIA.IGetMediaListData) => {
    modalRef.current?.open(value)
  }

  const onSubmit = useCallback(async value => {
    const success = await handleAdd(value)
    if (success) {
      actionRef.current?.reload()
    }
  }, [activeKey])

  const fetchData = useCallback(async (params: any) => {
    const { current, size, minSize, maxSize, ...nextParams } = params
    let newParams = {
      ...nextParams,
      type: MEDIA_TYPE_MAP[activeKey] as any,
      currPage: current - 1,
    }
    if(typeof size === 'number' || typeof minSize === 'number' || typeof maxSize === 'number') params.size = size ? size : `${minSize},${maxSize}`
    return getMediaList(newParams)
    .then(({ list, total }) => ({ data: list, total }) )
    .catch(_ => ({ data: [], total: 0 }))
  }, [activeKey])

  const onTabChange = useCallback(async (activeKey: string) => {
    setActiveKey(activeKey as keyof typeof MEDIA_TYPE_MAP)
    await sleep(100)
    actionRef.current?.reload()
  }, [actionRef])

  return (
    <PageContainer
      tabList={[
        {
          tab: '图片资源',
          key: 'image',
          closable: false,
        },
        {
          tab: '视频资源',
          key: 'video',
          closable: false,
        },
      ]}
      tabProps={{
        onChange: onTabChange,
        activeKey
      }}
    >
      <ProTable
        scroll={{ x: 'max-content' }}
        headerTitle="媒体资源列表"
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
  </PageContainer>
  )
})

export default connect(mapStateToProps, mapDispatchToProps)(MediaManage)