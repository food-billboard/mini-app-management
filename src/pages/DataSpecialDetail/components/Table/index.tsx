import { Table, Space, Dropdown, Menu } from 'antd'
import { EllipsisOutlined } from '@ant-design/icons'
import { history } from 'umi'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { unstable_batchedUpdates } from 'react-dom'
import commonColumns from './columns'
import { getMovieList } from '@/services'

type IProps = {
  value: string[]
  onChange: (params: Partial<API_INSTANCE.IPutInstanceSpecialParams>) => Promise<void>
}

export default memo((props: IProps) => {

  const [ data, setData ] = useState<API_DATA.IGetMovieData[]>([])
  const [ total, setTotal ] = useState<number>(0)
  const [ loading, setLoading ] = useState<boolean>(true)
  const { value, onChange } = useMemo(() => {
    return props 
  }, [props])

  const fetchData = useCallback(async () => {
    setLoading(true)
    const ids = value.join(',')
    const data = await getMovieList({ _id: ids }) || {}
    unstable_batchedUpdates(() => {
      setData(data?.list || [])
      setTotal(data?.total || 0)
      setLoading(false)
    })
  }, [value])

  const onTableChange = useCallback((pagination) => {

  }, [])

  const edit = useCallback((id: string) => {
    return history.push(`/data/main/${id}`)
  }, [])

  const handleRemove = useCallback((id: string) => {
    onChange({
      movie: value.filter(item => item !== id)
    })
  }, [value])

  useEffect(() => {
    fetchData()
  }, [])

  const columns = useMemo(() => {
    return [
      ...commonColumns,
      {
        dataIndex: 'op',
        title: '操作',
        key: 'op',
        fixed: 'right',
        render: (_: any, record: API_DATA.IGetMovieData) => {
          return (
            <Space>
            <a
              onClick={edit.bind(this, record._id)}
            >
              编辑
            </a>
            <a
              style={{color: 'red'}}
              onClick={handleRemove.bind(this, record._id)}
            >
              删除
            </a>
            <Dropdown overlay={
              <Menu>
                <Menu.Item>
                  <a style={{color: '#1890ff'}} onClick={edit.bind(this, record._id)}>
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

  return (
    <Table
      columns={columns as any}
      bordered
      dataSource={data}
      loading={loading}
      pagination={{ total, pageSize: 10 }}
      rowKey={record => record._id}
      onChange={onTableChange}
      scroll={{x: 'max-content'}}
    />
  )

})