import React from 'react'
import { history } from 'umi'
import { Tag } from 'antd'
import dayjs from 'dayjs'
import { SOURCE_TYPE, MOVIE_STATUS } from '@/utils'

export default [
  {
    title: '电影名称',
    dataIndex: 'name',
    render: (value: string, record: API_USER.IGetUserIssueData) => <a onClick={() => history.push(`/data/main/${record._id}`)}>{value}</a>
  },
  {
    title: '作者名称',
    dataIndex: 'author',
    render: (value: {
      username: string
      _id: string
    }) => {
      return value?.username
    }
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (val: string) => dayjs(val).format('YYYY-MM-DD hh:mm:ss')
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    render: (val: string) => dayjs(val).format('YYYY-MM-DD hh:mm:ss')
  },
  {
    title: '人气',
    dataIndex: 'hot',
    key: 'hot'
  },
  {
    title: '评分数',
    dataIndex: 'rate_person',
    key: 'rate_person'
  },
  {
    title: '标签数',
    dataIndex: 'tag_count',
    key: 'tag_count'
  },
  {
    title: '弹幕数',
    dataIndex: 'barrage_count',
    key: 'barrage_count'
  },
  {
    title: '来源',
    dataIndex: 'source_type',
    key: 'source_type',
    render: (val: string) => SOURCE_TYPE[val] || '-'
  },
  {
    title: '状态',
    dataIndex: 'status',
    render: (value: string) => {
      return (
        <Tag color="lime">{MOVIE_STATUS[value]}</Tag>
      )
    }
  },
]