import React from 'react'
import { Badge } from 'antd'
import moment from 'moment'


export default [
  {
    title: '实例信息',
    dataIndex: 'info',
    hideInSearch: true,
    key: 'info',
    ellipsis: true,
  },
  {
    title: '跑马灯信息',
    dataIndex: 'notice',
    hideInSearch: true,
    key: 'notice',
    ellipsis: true
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    hideInSearch: true,
    key: 'createdAt',
    renderText: (val: string) => moment(val).format('YYYY-MM-DD hh:mm:ss')
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    hideInSearch: true,
    key: 'updatedAt',
    renderText: (val: string) => moment(val).format('YYYY-MM-DD hh:mm:ss')
  },
  {
    title: '是否启用',
    dataIndex: 'valid',
    valueType: 'option',
    key: 'valid',
    renderText: (val: string) => {
      return (
        <Badge status={val ? 'success' : 'error'} text={val ? '启用' : '禁用'} />
      )
    }
  },
  {
    title: '访问次数',
    dataIndex: 'visit_count',
    hideInSearch: true,
    key: 'visit_count',
  },
]