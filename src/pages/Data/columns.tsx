import React from 'react'
import { history } from 'umi'
import { Input, DatePicker } from 'antd'
import moment from 'moment'
import { SOURCE_TYPE, MOVIE_STATUS } from '@/utils'

const { RangePicker } = DatePicker

export default [
  {
    title: '电影名称',
    dataIndex: 'name',
    valueType: 'option'
  },
  {
    title: '作者名称',
    dataIndex: 'author',
    valueType: 'option',
    renderText: (value: {
      username: string
      _id: string
    }) => <a onClick={() => history.push(`/member/${value._id}`)}>{value.username}</a>
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    sorter: true,
    valueType: 'date',
    renderFormItem: (_: any, { type, defaultRender, ...rest }: any, form: any) => {
      return <RangePicker {...rest} />
    },
    renderText: (val: string) => moment(val).format('YYYY-MM-DD hh:mm:ss')
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    sorter: true,
    valueType: 'option',
    renderText: (val: string) => moment(val).format('YYYY-MM-DD hh:mm:ss')
  },
  {
    title: '来源',
    dataIndex: 'source_type',
    valueEnum: Object.keys(SOURCE_TYPE).reduce((acc: any, cur: string) => {
      
      acc[cur] = {
        text: SOURCE_TYPE[cur],
        source_type: cur
      }

      return acc
    }, {}),
    renderText: (val: string) => SOURCE_TYPE[val] || '-'
  },
  {
    title: '状态',
    dataIndex: 'status',
    valueEnum: Object.keys(MOVIE_STATUS).reduce((acc: any, cur: string) => {

      acc[cur] = {
        text: MOVIE_STATUS[cur],
        status: cur
      }
      return acc
    }, {})
  },
  // {
  //   hideInTable: false,
  //   dataIndex: 'content',
  //   title: '名字',
  //   renderFormItem: (_: any, { type, defaultRender, ...rest }: any, form: any) => {
  //     return <Input {...rest} />
  //   }
  // },
]