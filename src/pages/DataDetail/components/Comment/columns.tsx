import React from 'react'
import { history } from 'umi'
import moment from 'moment'
import { Typography } from 'antd'

const { Text } = Typography

export default [
  {
    dataIndex: '_id',
    title: '评论id',  
    key: '_id',
  },
  {
    dataIndex: 'user_info',
    title: '用户名',  
    key: 'user_info',
    render: (value: { _id: string, username: string }) => {
      return <a onClick={() => history.push(`/member/${value["_id"]}`)}>{value?.username}</a>
    }
  },
  {
    dataIndex: 'like_person_count',
    title: '点赞数',  
    key: 'like_person_count',
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt'
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    render: (val: string) => moment(val).format('YYYY-MM-DD hh:mm:ss')
  },
  {
    title: '文字内容',
    dataIndex: 'content',
    key: 'content',
    render: (val: { text?: string, image?: string[], video?: string[] }) => {
      return (
        <Text ellipsis>{val.text || "该评论无文字内容"}</Text>
      )
    }
  },
]