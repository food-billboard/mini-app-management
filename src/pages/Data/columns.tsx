import React from 'react'
import { history } from 'umi'
import { DatePicker } from 'antd'
import moment from 'moment'
import { SOURCE_TYPE, MOVIE_STATUS } from '@/utils'

const { RangePicker } = DatePicker

export default [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: '电影名称',
    dataIndex: 'name',
    hideInSearch: true,
    render: (value: string, record: API_DATA.IGetMovieData) => <a onClick={() => history.push(`/data/main/${record._id}`)}>{value}</a>
  },
  {
    title: '作者名称',
    dataIndex: 'author',
    valueType: 'option',
    renderText: (value: {
      username: string
      _id: string
    }) => {
      if(value.username) return (<span>-</span>)
      return <a onClick={() => history.push(`/member/${value._id}`)}>{value.username}</a>
    }
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    sorter: true,
    valueType: 'date',
    hideInSearch: true,
    renderFormItem: (_: any, { type, defaultRender, ...rest }: any, form: any) => {
      return <RangePicker {...rest} />
    },
    renderText: (val: string) => moment(val).format('YYYY-MM-DD hh:mm:ss')
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    valueType: 'dateRange',
    hideInTable: true,
    search: {
      transform: (value: any) => {
        return {
          startTime: value[0],
          endTime: value[1],
        };
      },
    },
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    sorter: true,
    hideInSearch: true,
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