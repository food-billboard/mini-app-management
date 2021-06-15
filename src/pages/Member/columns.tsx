import React, {  } from 'react'
import { Tag, DatePicker, Avatar, Badge } from 'antd'
import { history } from 'umi'
import moment from 'moment'
import { ROLES_MAP, USER_STATUS } from '@/utils'

const { RangePicker } = DatePicker

const UserStatus = (status: keyof typeof USER_STATUS) => {
  if(status === 'FREEZE') return <Badge status="default" text={USER_STATUS[status]} />
  if(status === 'SIGNIN') return <Badge status="success" text={USER_STATUS[status]} />
  if(status === 'SIGNOUT') return <Badge status="warning" text={USER_STATUS[status]} />
}

export default [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
    fixed: "left",
  },
  {
    title: '用户名',
    dataIndex: 'username',
    hideInSearch: true,
    fixed: "left",
    render: (value: string, record: API_USER.IGetUserListResData) => <a onClick={() => history.push(`/member/${record._id}`)}>{value}</a>
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
    hideInSearch: true,
    copyable: true,
    render: (value: string) => {
      return (
        <Tag color="cyan">{value}</Tag>
      )
    }
  },
  {
    title: '头像',
    dataIndex: 'avatar',
    hideInSearch: true,
    render: (value: string, record: API_USER.IGetUserListResData) => {
      return (
        <Avatar src={value} size={40} >{record.username}</Avatar>
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
    title: '邮箱',
    dataIndex: 'email',
    hideInSearch: true,
    copyable: true,
  },
  {
    title: '权限',
    dataIndex: 'roles',
    hideInSearch: true,
    renderText: (val: string) => {
      const list = Array.isArray(val) ? val : [val]
      return list.map((item: string) => ROLES_MAP[item] || '-').join(',')
    }
  },
  {
    title: '权限',
    dataIndex: 'roles',
    hideInTable: true,
    valueEnum: Object.keys(ROLES_MAP).reduce((acc: any, cur: string) => {
      acc[cur] = {
        text: ROLES_MAP[cur],
        source_type: cur
      }
      return acc
    }, {}),
  },
  {
    title: '状态',
    dataIndex: 'status',
    hideInSearch: true,
    render: (val: string) => UserStatus(val as keyof typeof USER_STATUS)
  },
  {
    title: '状态',
    dataIndex: 'status',
    hideInTable: true,
    valueEnum: Object.keys(USER_STATUS).reduce((acc: any, cur: string) => {
      acc[cur] = {
        text: USER_STATUS[cur],
        status: cur
      }
      return acc
    }, {})
  },
  {
    title: '人气',
    dataIndex: 'hot',
    hideInSearch: true,
  },
  {
    title: '粉丝数',
    dataIndex: 'fans_count',
    hideInSearch: true,
  },
  {
    title: '上传数',
    dataIndex: 'issue_count',
    hideInSearch: true,
  },
  {
    title: '评论数',
    dataIndex: 'comment_count',
    hideInSearch: true,
  },
  {
    title: '收藏数',
    dataIndex: 'store_count',
    hideInSearch: true,
  },
  {
    title: '关注数',
    dataIndex: 'attentions_count',
    hideInSearch: true,
  },
]