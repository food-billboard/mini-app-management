import React from 'react'
import { Tag, Image } from 'antd'
import { history } from 'umi';
import { IMAGE_FALLBACK } from '@/utils'

export default [
  {
    title: 'id',
    dataIndex: '_id',
    copyable: true,
    hideInSearch: true 
  },
  {
    title: '大屏名称',
    dataIndex: 'name',
    hideInSearch: true 
  },
  {
    title: '名称',
    dataIndex: 'content',
    valueType: 'text',
    hideInTable: true,
  },
  {
    title: '描述',
    dataIndex: 'description',
    hideInSearch: true 
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    valueType: 'dateRange',
    hideInTable: true 
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    hideInSearch: true 
  },
  {
    title: '修改时间',
    dataIndex: 'updatedAt',
    hideInSearch: true 
  },
  {
    title: '创建用户',
    dataIndex: 'user',
    hideInSearch: true,
    renderText: (value: { username: string; _id: string }) => {
      if (!value.username) return <span>-</span>;
      return <a onClick={() => history.push(`/member/${value['_id']}`)}>{value.username}</a>;
    },
  },
  {
    title: '状态',
    dataIndex: 'enable',
    render: (val: boolean) => {
      if(val) {
        return (
          <Tag color="green">启用</Tag>
        )
      }
      return <Tag color="red">禁用</Tag>
    },
    hideInSearch: true 
  },
  {
    title: '状态',
    dataIndex: 'enable',
    hideInTable: true,
    valueEnum: {
      enable: { 
        text: '启用',
        status: 'Success',
      },
      disable: {
        text: '禁用',
        status: 'Error',
      }
    },
    search: {
      transform: (value: any) => {
        return {
          enable: value === 'enable' ? '1' : '0'
        }
      }
    }
  },
  {
    title: '海报',
    dataIndex: 'poster',
    hideInSearch: true,
    render: (value: string) => {
      return (
        <Image src={value} width={50} height={50} fallback={IMAGE_FALLBACK} />
      )
    }
  },
  {
    title: '版本',
    dataIndex: 'version',
    hideInSearch: true 
  },
]