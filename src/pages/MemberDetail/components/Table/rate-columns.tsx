import React from 'react'
import { history } from 'umi'
import dayjs from 'dayjs'
import { SOURCE_TYPE } from '@/utils'

export default [
  {
    title: '电影名称',
    dataIndex: 'name',
    render: (value: string, record: API_DATA.IGetMovieData) => <a onClick={() => history.push(`/data/main/${record?._id}`)}>{value}</a>
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
    title: '作者评分',
    dataIndex: 'author_rate',
    key: 'author_rate'
  },
  {
    title: '评分人数',
    dataIndex: 'rate_person',
    key: 'rate_person'
  },
  {
    title: '总评分',
    dataIndex: 'total_rate',
    key: 'total_rate'
  },
  {
    title: '来源',
    dataIndex: 'source_type',
    key: 'source_type',
    render: (val: string) => SOURCE_TYPE[val] || '-'
  },
]