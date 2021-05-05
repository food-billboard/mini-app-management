import { Table, Space } from 'antd'
import { history } from 'umi'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { unstable_batchedUpdates } from 'react-dom'
import { LightFilter, ProFormDatePicker, ProFormSelect } from '@ant-design/pro-form'
import commonColumns from './columns'
import { getGlanceUserList } from '@/services'
import { USER_STATUS } from '@/utils'

type IProps = {
  _id?: string 
}

export default memo((props: IProps) => {

  const [ data, setData ] = useState<API_DATA.IGetGlanceUserListData[]>([])
  const [ total, setTotal ] = useState<number>(0)
  const [ loading, setLoading ] = useState<boolean>(true)
  const [ currPage, setCurrPage ] = useState<number>(1)
  const { _id } = useMemo(() => {
    return props 
  }, [props])

  const fetchData = useCallback(async (params: Partial<API_DATA.IGetGlanceUserListParams>={}) => {
    if(!_id) return 
    setLoading(true)
    const data = await getGlanceUserList({ _id, currPage, pageSize: 10, ...params }) || {}
    unstable_batchedUpdates(() => {
      setData(data?.list || [])
      setTotal(data?.total || 0)
      setLoading(false)
    })
  }, [_id, currPage])

  const edit = useCallback((id: string) => {
    return history.push(`/member/${id}`)
  }, [])

  useEffect(() => {
    fetchData()
  }, [])

  const onPageChange = useCallback((page) => {
    setCurrPage(page)
    fetchData()
  }, [currPage])

  const init = useCallback(async (value) => {
    setCurrPage(1)
    await fetchData(value)
  }, [])

  const columns = useMemo(() => {
    return [
      ...commonColumns,
      {
        dataIndex: 'op',
        title: '操作',
        key: 'op',
        fixed: 'right',
        render: (_: any, record: API_DATA.IGetGlanceUserListData) => {
          return (
            <Space>
              <a style={{color: '#1890ff'}} onClick={edit.bind(this, record._id)}>
                详情
              </a>
          </Space>
          )
        }
      }
    ]

  }, [])

  const title = useMemo(() => {
    return function() {
      return (
        <LightFilter
          collapse
          onFinish={init}
        >
          <ProFormSelect
            name="status"
            label="用户状态"
            options={Object.entries(USER_STATUS).reduce((acc, cur) => {
              const [ key, value ] = cur
              acc.push({
                label: value,
                value: key
              }) 
              return acc 
            }, [] as ({ label: string, value: string }[]))}
          />
          <ProFormDatePicker
            name="start_date"
            label="起始时间"
            fieldProps={{
              format: 'YYYY-MM-DD'
            }}
          />
          <ProFormDatePicker
            name="end_date"
            label="结束时间"
            fieldProps={{
              format: 'YYYY-MM-DD'
            }}
          />
        </LightFilter>
      )
    }
  }, [])

  return (
    <Table
      title={title}
      columns={columns as any}
      bordered
      dataSource={data}
      loading={loading}
      pagination={{ total, pageSize: 10, current: currPage, onChange: onPageChange }}
      rowKey={record => record._id}
      scroll={{x: 'max-content'}}
    />
  )

})