import moment from 'moment'
import React from 'react'
import { history } from 'umi'
import ImageView from '@/components/TableImageView'
import { COMMENT_SOURCE_TYPE } from '@/utils'
import { PreView } from '@/pages/Video'

export default [
  {
    dataIndex: '_id',
    title: '评论id',  
    key: '_id',
  },
  {
    dataIndex: 'user_info',
    title: '发布用户',  
    key: 'user_info',
    render: (value: API_USER.ICommentData["user_info"]) => {
      return value?.username
    }
  },
  {
    dataIndex: 'sub_comments',
    title: '总评论量',  
    key: 'sub_comments',
  },
  {
    dataIndex: 'total_like',
    title: '点赞数',  
    key: 'total_like',
  },
  {
    dataIndex: 'source_type',
    title: '来源类型',  
    key: 'source_type',
    render: (value: API_USER.TSourceType, record: API_USER.ICommentData) => {
      const children = COMMENT_SOURCE_TYPE[value]
      return value === 'comment' ? children : (
        <a onClick={() => history.push(`/data/main/${record.source}`)}>{children}</a>
      )
    }
  },
  {
    dataIndex: 'text',
    title: '文本内容',  
    key: 'text',
    render: (_: any, record: API_USER.ICommentData) => {
      return record?.content?.text || '-'
    }
  },
  {
    title: '图片内容',
    dataIndex: 'image',
    hideInSearch: true,
    render: (_: any, record: API_USER.ICommentData) => {
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
    hideInSearch: true,
    render: (_: any, record: API_USER.ICommentData) => {
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
    render: (val: string) => moment(val).format('YYYY-MM-DD hh:mm:ss')
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    render: (val: string) => moment(val).format('YYYY-MM-DD hh:mm:ss')
  },
]