import React from 'react'
import { Typography, Badge } from 'antd'
import moment from 'moment'

const { Paragraph } = Typography

export default [
  {
    title: '名称',
    dataIndex: 'name',
    render: (value: string, record: API_INSTANCE.IGetInstanceInfoRes) => {
      return (
        <Paragraph ellipsis>
          {value}
        </Paragraph>
      )
    }
  },
  {
    title: '描述',
    dataIndex: 'description',
    valueType: 'option',
    render: (value: {
      username: string
      _id: string
    }) => {
      return (
        <Paragraph ellipsis>
          {value}
        </Paragraph>
      )
    }
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    valueType: 'option',
    renderText: (val: string) => moment(val).format('YYYY-MM-DD hh:mm:ss')
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    valueType: 'option',
    renderText: (val: string) => moment(val).format('YYYY-MM-DD hh:mm:ss')
  },
  {
    title: '是否启用',
    dataIndex: 'valid',
    render: (val: string) => {
      <Badge status={val ? 'success' : 'error'} text={val ? '启用' : '禁用'} />
    }
  },
  {
    title: '访问次数',
    dataIndex: 'glance',
    valueType: 'option',
  },
  {
    title: '数据数量',
    dataIndex: 'movie',
    valueType: 'option',
    render: (value: any) => {
      return Array.isArray(value) ? value.length : 0
    }
  },
]