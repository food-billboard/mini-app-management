import React from 'react'
import { Typography, Badge } from 'antd'
import moment from 'moment'

const { Paragraph } = Typography

export default [
  {
    title: '实例信息',
    dataIndex: 'info',
    valueType: 'option',
    render: (value: string, record: API_INSTANCE.IGetInstanceInfoRes) => {
      return (
        <Paragraph ellipsis>
          {value}
        </Paragraph>
      )
    }
  },
  {
    title: '跑马灯信息',
    dataIndex: 'notice',
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
    valueType: 'option',
    render: (val: string) => {
      <Badge status={val ? 'success' : 'error'} text={val ? '启用' : '禁用'} />
    }
  },
  {
    title: '访问次数',
    dataIndex: 'visit_count',
    valueType: 'option',
  },
]