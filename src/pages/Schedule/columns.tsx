import React from 'react'
import { Tag } from 'antd'
import { SCHEDULE_STATUS } from '@/utils'

export default [
  {
    title: 'name',
    dataIndex: 'name',
    hideInSearch: true 
  },
  {
    title: '执行时间',
    dataIndex: 'time',
    hideInSearch: true 
  },
  {
    title: '状态',
    dataIndex: 'status',
    render: (val: string) => {
      return <Tag color="yellow">{SCHEDULE_STATUS[val] || '-'}</Tag>
    },
    hideInSearch: true 
  },
  {
    title: '描述',
    dataIndex: 'description',
    hideInSearch: true 
  },
]