import React from 'react'
import { history } from 'umi'
import moment from 'moment'
import { commentView } from '../../../Feedback/columns'

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
    dataIndex: 'total_like',
    title: '点赞数',  
    key: 'like_person_count',
  },
  {
    dataIndex: 'comment_users',
    title: '总评论用户',  
    key: 'comment_users',
  },
  {
    dataIndex: 'comment_count',
    title: '总评论量',  
    key: 'comment_count',
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
  ...commentView()
]