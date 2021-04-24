import React from 'react'
import { Tag } from 'antd'
import moment from 'moment'

export default [
  {
    dataIndex: '_id',
    title: '用户',  
    key: '_id',
  },
  {
    dataIndex: 'username',
    title: '用户名',  
    key: 'username',
  },
  {
    dataIndex: 'mobile',
    title: '手机号',  
    key: 'mobile',
    width: 100,
    render: (value: string) => {
      return <Tag color="cyan">{value}</Tag>
    }
  },
  {
    dataIndex: 'email',
    title: '邮箱',  
    key: 'email',
    width: 100,
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt'
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    render: (val: string) => moment(val).format('YYYY-MM-DD hh:mm:ss')
  },
  {
    title: '浏览时间',
    dataIndex: 'glance_date',
    key: 'glance_date',
    render: (val: string) => moment(val).format('YYYY-MM-DD hh:mm:ss')
  },
]