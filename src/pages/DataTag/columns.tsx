import React, {  } from 'react'
import { Tag, DatePicker } from 'antd'
import { history } from 'umi'
import moment from 'moment'

const { RangePicker } = DatePicker

const TAG_WEIGHT_MAP = {
  0: '#f50',
  1: '#108ee9',
  2: '#2db7f5',
  3: '#87d068'
}

const TAG_DEFAULT = '#87d068'

export default [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: 'id',
    dataIndex: '_id',
    hideInSearch: true,
  },
  {
    title: '内容',
    dataIndex: 'text',
    hideInSearch: true,
    renderText: (value: string, record: API_DATA.IGetMovieTagResData) => {
      return (
        <Tag color={TAG_WEIGHT_MAP[record.weight] || TAG_DEFAULT}>{value}</Tag>
      )
    }
  },
  {
    title: '权重',
    dataIndex: 'weight',
    hideInSearch: true,
  },
  {
    title: '来源电影',
    dataIndex: 'source',
    hideInSearch: true,
    render: (source: API_DATA.IGetMovieTagResData["source"]) => {
      return (
        <a onClick={() => history.push(`/data/main/${source._id}`)}>{source.name}</a>
      )
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
          start_date: value[0],
          end_end: value[1],
        };
      },
    },
  },
  {
    title: '内容',
    dataIndex: 'content',
    valueType: 'text',
    hideInTable: true,
    search: {

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
    title: '是否启用',
    dataIndex: 'valid',
    hideInSearch: true,
    renderText: (value: boolean) => {
      return (
        <Tag color={!!value ? 'green' : 'red'}>{!!value ? '启用' : '禁用'}</Tag>
      )
    }
  },
  {
    title: '是否启用',
    dataIndex: 'valid',
    hideInTable: true,
    valueEnum: {
      'true': {
        text: '启用',
        status: 'Success',
      },
      'false': {
        text: '禁用',
        status: 'Error',
      },
    },
  },
  {
    title: '权重',
    dataIndex: 'status',
    hideInTable: true,
    valueType: 'progress'
  }
]