import React from 'react'
import { DatePicker, Image, Tooltip, Tag } from 'antd'
import { history } from 'umi'
import dayjs from 'dayjs'
import { IMAGE_FALLBACK, SOURCE_TYPE, MESSAGE_MEDIA_TYPE } from '@/utils'
import { preview } from '@/components/VideoPreview'

const { RangePicker } = DatePicker

const MediaType = (type: keyof typeof MESSAGE_MEDIA_TYPE) => {
  let color 
  if(type === 'AUDIO') color = 'orange'
  if(type === 'IMAGE') color = 'green'
  if(type === 'TEXT') color = 'blue'
  if(type === 'VIDEO') color = 'gold'

  return (
    <Tag color={color}>{MESSAGE_MEDIA_TYPE[type]}</Tag>
  )
}

export default [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: '消息类型',
    dataIndex: 'message_type',
    hideInSearch: true,
    valueEnum: Object.keys(SOURCE_TYPE).reduce((acc: any, cur: string) => {
      acc[cur] = {
        text: SOURCE_TYPE[cur],
        origin_type: cur
      }
      return acc
    }, {}),
  },
  {
    title: '消息媒体类型',
    dataIndex: 'media_type',
    hideInSearch: true,
    // valueEnum: Object.keys(MESSAGE_MEDIA_TYPE).reduce((acc: any, cur: string) => {
    //   acc[cur] = {
    //     text: MESSAGE_MEDIA_TYPE[cur],
    //     origin_type: cur
    //   }
    //   return acc
    // }, {}),
    render: (value: string) => {
      return MediaType(value as keyof typeof MESSAGE_MEDIA_TYPE)
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
    renderText: (val: string) => dayjs(val).format('YYYY-MM-DD hh:mm:ss')
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
    renderText: (val: string) => dayjs(val).format('YYYY-MM-DD hh:mm:ss')
  },
  {
    title: '用户名',
    dataIndex: 'username',
    hideInSearch: true,
    render: (_: string, record: API_CHAT.IGetMessageResData) => <a onClick={() => { history.push(`/member/${record.user_info._id}`) }}>{record.user_info.username}</a>
  },
  {
    title: '头像',
    dataIndex: 'avatar',
    hideInSearch: true,
    render: (_: string, record: API_CHAT.IGetMessageResData) => <Image src={record.user_info.avatar} width={50} height={50} fallback={IMAGE_FALLBACK} />
  },
  {
    title: '用户成员id',
    dataIndex: 'member',
    hideInSearch: true,
  },
  {
    title: '@',
    dataIndex: 'point_to',
    hideInSearch: true,
  },
  {
    title: '已读数量',
    dataIndex: 'readed_count',
    hideInSearch: true
  },
  {
    title: '删除数量',
    dataIndex: 'deleted_count',
    hideInSearch: true
  },
  {
    title: '内容',
    dataIndex: 'content',
    hideInSearch: true,
    render: (value: API_CHAT.IGetMessageResData["content"]) => {
      if(value.text) {
        return (
          <Tooltip
            title={value.text}
          >
            <div style={{maxWidth: 200, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}>{value.text}</div>
          </Tooltip>
        )
      }
      if(value.audio) return (<div>暂时不支持音频</div>)
      if(value.image) {
        return (
          <Image src={value.image} width={80} height={80} fallback={IMAGE_FALLBACK} />
        )
      }
      if(value.video) {
        return (
          <a onClick={(e) => {
            e.stopPropagation()
            return preview([value.video || ""])
          }} style={{color: '#1890ff'}}>(预览)</a>
        )
      }
      return '-'
    }
  }
]