import React from 'react'
import { DatePicker, Tag } from 'antd'
import moment from 'moment'
import ImageView from '@/components/TableImageView'
import { FEEDBACK_STATUS } from '@/utils'
import { PreView } from '@/pages/Video'

const { RangePicker } = DatePicker

export default [
  {
    title: 'id',
    dataIndex: '_id',
  },
  {
    title: '状态',
    dataIndex: 'status',
    render: (val: string) => FEEDBACK_STATUS[val] || '-'
  },
  {
    title: '状态',
    dataIndex: 'status',
    render: (value: string) => {
      return <Tag color="yellow">{FEEDBACK_STATUS[value]}</Tag>
    }
  },
  {
    title: '文字内容',
    dataIndex: 'text',
    render: (_: any, record: API_USER.IGetFeedbackData) => {
      return record?.content?.text
    }
  },
  {
    title: '图片内容',
    dataIndex: 'image',
    render: (_: any, record: API_USER.IGetFeedbackData) => {
      return (
        <ImageView
          value={record?.content?.image}
        />
      )
    }
  },
  {
    title: '视频内容',
    dataIndex: 'video',
    render: (_: any, record: API_USER.IGetFeedbackData) => {
      if(!record?.content?.video?.length) return ("[视频]")
      return (
        <a onClick={(e) => {
          e.stopPropagation()
          return PreView(record?.content?.video)
        }} style={{color: '#1890ff'}}>(预览)</a>
      )
    }
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    renderFormItem: (_: any, { type, defaultRender, ...rest }: any, form: any) => {
      return <RangePicker {...rest} />
    },
    render: (val: string) => moment(val).format('YYYY-MM-DD hh:mm:ss')
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    render: (val: string) => moment(val).format('YYYY-MM-DD hh:mm:ss')
  },
]