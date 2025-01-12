import React from 'react'
import { history } from 'umi'
import { DatePicker, Image, Tag } from 'antd'
import dayjs from 'dayjs'
import { IMAGE_FALLBACK } from '@/utils'

const { RangePicker } = DatePicker

export default [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: '用户名',
    dataIndex: 'username',
    hideInSearch: true,
    render: (_: string, record: API_CHAT.IGetMemberListResData) => <a onClick={() => {
      if(record.user?.["_id"]) history.push(`/member/${record.user?.["_id"]}`)
    }}>{record.user?.username || `[临时游客]`}</a>
  },
  {
    title: '头像',
    dataIndex: 'avatar',
    hideInSearch: true,
    render: (_: string, record: API_CHAT.IGetMemberListResData) => {
      return (
        <Image src={record.user.avatar} width={50} height={50} fallback={IMAGE_FALLBACK} />
      )
    }
  },
  {
    title: '描述',
    dataIndex: 'description',
    hideInSearch: true,
    render: (_: string, record: API_CHAT.IGetMemberListResData) => <div>{record.user.description}</div>
  },
  {
    title: 'socket id',
    dataIndex: 'sid',
    hideInSearch: true,
  },
  {
    title: '游客id',
    dataIndex: 'temp_user_id',
    hideInSearch: true,
    render: (value: string, record: API_CHAT.IGetMemberListResData) => {
      return record.user ? (
        <Tag color="gold">会员</Tag>
      ) : (
        <div>{value || '-'}</div>
      )
    }
  },
  {
    title: '房间数',
    dataIndex: 'room',
    hideInSearch: true,
    render: (value: API_CHAT.IGetMemberListResData["room"]) => {
      return Array.isArray(value) ? value.length.toString() : "0"
    }
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    sorter: true,
    valueType: 'date',
    hideInSearch: true,
    renderFormItem: (_: any, { type, defaultRender, ...rest }: any) => {
      return <RangePicker {...rest} />
    },
    renderText: (val: string) => dayjs(val).format('YYYY-MM-DD hh:mm:ss')
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    sorter: true,
    hideInSearch: true,
    renderText: (val: string) => dayjs(val).format('YYYY-MM-DD hh:mm:ss')
  },
] as any