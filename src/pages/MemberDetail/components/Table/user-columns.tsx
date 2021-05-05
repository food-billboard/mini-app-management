import React from 'react'
import { Tag, Avatar } from 'antd'
import { history } from 'umi'
import moment from 'moment'
import { ROLES_MAP, USER_STATUS } from '@/utils'

export default [
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username',
    render: (value: string, record: API_USER.IGetUserListResData) => <a onClick={() => history.push(`/member/${record._id}`)}>{value}</a>
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
    key: 'mobile',
    render: (value: string) => {
      return (
        <Tag color="cyan">{value}</Tag>
      )
    }
  },
  {
    title: '头像',
    dataIndex: 'avatar',
    key: "avatar",
    render: (value: string, record: API_USER.IGetUserListResData) => {
      return (
        <Avatar src={value} size={40} >{record.username}</Avatar>
      )
    }
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (val: string) => moment(val).format('YYYY-MM-DD hh:mm:ss')
  },
  {
    title: '内容',
    dataIndex: 'content',
    key: 'content',
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    key: "updatedAt",
    render: (val: string) => moment(val).format('YYYY-MM-DD hh:mm:ss')
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: "email",
  },
  {
    title: '权限',
    dataIndex: 'roles',
    key: "roles",
    render: (val: string) => {
      const list = Array.isArray(val) ? val : [val]
      return list.map((item: string) => ROLES_MAP[item] || '-').join(',')
    }
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: "status",
    render: (val: string) => USER_STATUS[val] || '-'
  },
  {
    title: '人气',
    dataIndex: 'hot',
    key: "hot",
  },
  {
    title: '粉丝数',
    dataIndex: 'fans_count',
    key: "fans_count",
  },
  {
    title: '上传数',
    dataIndex: 'issue_count',
    key: "issue_count",
  },
  {
    title: '评论数',
    dataIndex: 'comment_count',
    key: "comment_count",
  },
  {
    title: '收藏数',
    dataIndex: 'store_count',
    key: "store_count",
  },
  {
    title: '关注数',
    dataIndex: 'attentions_count',
    key: "attentions_count",
  },
]