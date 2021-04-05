import React from 'react'
import { Image, Tooltip } from 'antd'
import moment from 'moment'
import { IMAGE_FALLBACK } from '@/utils'

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
            src={value}
          />
          }
        >
          点击查看大图
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