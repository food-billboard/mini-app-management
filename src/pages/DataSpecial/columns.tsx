import React from 'react'
import { Typography, Badge } from 'antd'
import moment from 'moment'

const { Paragraph } = Typography

export default [
  {
    title: '名称',
    dataIndex: 'name',
    ellipsis: true,
  },
  {
    title: '描述',
    dataIndex: 'description',
    valueType: 'option',
    ellipsis: true,
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
    renderText: (val: string) => {
      return <Badge status={val ? 'success' : 'error'} text={val ? '启用' : '禁用'} />
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
    renderText: (value: any) => {
      return Array.isArray(value) ? value.length : 0
    }
  },
]