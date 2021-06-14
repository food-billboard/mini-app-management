import React from 'react'
import { history } from 'umi'
import { DatePicker, Image, Badge } from 'antd'
import moment from 'moment'
import { IMAGE_FALLBACK, CHAT_ROOM_TYPE } from '@/utils'

const { RangePicker } = DatePicker

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
    copyable: true 
  },
  {
    title: '聊天室名称',
    dataIndex: 'name',
    hideInSearch: true,
    render: (_: string, record: API_CHAT.IGetRoomListResData) => <div onClick={() => {}}>{record.info.name}</div>
  },
  {
    title: '海报',
    dataIndex: 'image',
    hideInSearch: true,
    render: (_: string, record: API_CHAT.IGetRoomListResData) => {
      return (
        <Image src={record.info.avatar} width={50} height={50} fallback={IMAGE_FALLBACK} />
      )
    }
  },
  {
    title: '聊天室描述',
    dataIndex: 'description',
    hideInSearch: true,
    render: (_: string, record: API_CHAT.IGetRoomListResData) => <div>{record.info.description}</div>
  },
  {
    title: '聊天室类型',
    dataIndex: 'type',
    hideInSearch: true,
    render: (value: string) => {
      return CHAT_ROOM_TYPE[value] || '-'
    }
  },
  {
    title: '是否为系统聊天室',
    dataIndex: 'origin',
    hideInSearch: true,
    render: (value: boolean) => {
      return (
        <Badge color={value ? 'red' : 'blue'} text={value ? '是' : '否'} />
      )
    }
  },
  {
    title: '删除人数',
    dataIndex: 'delete_users',
    hideInSearch: true
  },
  {
    title: '消息数量',
    dataIndex: 'message',
    hideInSearch: true,
    render: (value: number, record: API_CHAT.IGetRoomListResData) => {
      return (
        <a onClick={() => history.push(`/chat/message/${record._id}`)}>{value}</a>
      )
    },
  },
  {
    title: '成员数量',
    dataIndex: 'members',
    render: (value: number, record: API_CHAT.IGetRoomListResData) => {
      return (
        <a onClick={() => history.push(`/chat/member/${record._id}`)}>{value}</a>
      )
    },
    hideInSearch: true
  },
  {
    title: '在线成员数量',
    dataIndex: 'online_members',
    hideInSearch: true
  },
  {
    title: '是否被删除',
    dataIndex: 'is_delete',
    hideInSearch: true,
    render: (value: boolean) => {
      return !!value ? '是' : '否'
    }
  },
  {
    title: '房主名称',
    dataIndex: 'author',
    hideInSearch: true,
    renderText: (_: string, record: API_CHAT.IGetRoomListResData) => <a onClick={() => history.push(`/member/${record.create_user._id}`)}>{record.create_user.username}</a>
  },
  {
    title: '系统聊天室',
    dataIndex: 'origin',
    hideInTable: true,
    valueEnum: Object.entries({
      0: '否',
      1: '是'
    }).reduce((acc: any, cur: any) => {
      const [ key, value ] = cur 
      acc[key] = {
        text: value,
        origin_type: key
      }
      return acc
    }, {}),
  },
  {
    title: '聊天室类型',
    dataIndex: 'type',
    hideInTable: true,
    valueEnum: Object.keys(CHAT_ROOM_TYPE).reduce((acc: any, cur: string) => {
      acc[cur] = {
        text: CHAT_ROOM_TYPE[cur],
        origin_type: cur
      }
      return acc
    }, {}),
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
  // {
  //   title: '创建时间',
  //   dataIndex: 'createdAt',
  //   valueType: 'dateRange',
  //   hideInTable: true,
  //   search: {
  //     transform: (value: any) => {
  //       return {
  //         startTime: value[0],
  //         endTime: value[1],
  //       };
  //     },
  //   },
  // },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    sorter: true,
    hideInSearch: true,
    renderText: (val: string) => moment(val).format('YYYY-MM-DD hh:mm:ss')
  },
]