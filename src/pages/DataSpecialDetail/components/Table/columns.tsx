import React from 'react'
import { Image, Tooltip } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import moment from 'moment'
import { IMAGE_FALLBACK, formatUrl } from '@/utils'

export default [
  {
    dataIndex: '_id',
    title: '电影id',  
    key: '_id',
  },
  {
    dataIndex: 'name',
    title: '名称',  
    key: 'name',
  },
  {
    dataIndex: 'description',
    title: '描述',  
    key: 'description',
    width: 100,
    ellipsis: true,
  },
  {
    dataIndex: 'poster',
    title: '海报',
    key: "poster",
    render: (value: string) => {
      return (
        <Tooltip
          title={
            <Image
            alt="海报"
            fallback={IMAGE_FALLBACK}
            placeholder
            preview
            src={formatUrl(value)}
          />
          }
        >
          <EyeOutlined style={{cursor: 'pointer'}} />
        </Tooltip>
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