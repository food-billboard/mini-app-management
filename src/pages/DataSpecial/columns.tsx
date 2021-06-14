import React from 'react'
import { Badge } from 'antd'
import moment from 'moment'

export default [
  {
    title: '名称',
    dataIndex: 'name',
    ellipsis: true,
  },
  {
    title: '描述',
    dataIndex: 'description',
    hideInSearch: true,
    ellipsis: true,
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    hideInSearch: true,
    renderText: (val: string) => moment(val).format('YYYY-MM-DD hh:mm:ss')
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    hideInSearch: true,
    renderText: (val: string) => moment(val).format('YYYY-MM-DD hh:mm:ss')
  },
  {
    title: '是否启用',
    dataIndex: 'valid',
    valueType: '',
    valueEnum: [
      {
        text: '启用',
        valid: true,
      },
      {
        text: '禁用',
        valid: false
      }
    ],
    renderText: (val: string) => {
      return <Badge status={val ? 'success' : 'error'} text={val ? '启用' : '禁用'} />
    }
  },
  {
    title: '访问次数',
    dataIndex: 'glance',
    hideInSearch: true,
  },
  {
    title: '数据数量',
    dataIndex: 'movie',
    hideInSearch: true,
    renderText: (value: any) => {
      return Array.isArray(value) ? value.length : 0
    }
  },
]