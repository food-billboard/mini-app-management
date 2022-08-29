import React from 'react'
import { Tag } from 'antd'
import { history } from 'umi';
import CodeViewer from '@/components/JsonViewer'

export default [
  {
    title: 'id',
    dataIndex: '_id',
    copyable: true,
    hideInSearch: true 
  },
  {
    title: '接口名称',
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
    title: '请求方法',
    dataIndex: 'method',
    render: (val: string) => {
      if(val.toLowerCase() === 'post') return (
        <Tag color="gold">{val}</Tag>
      )
      return <Tag color="lime">{val}</Tag>
    },
    hideInSearch: true 
  },
  {
    title: '请求地址',
    dataIndex: 'url',
    hideInSearch: true 
  },
  {
    title: '请求参数',
    dataIndex: 'params',
    hideInSearch: true,
    render: (value: any) => {
      return (
        <CodeViewer
          value={value || []}
        />
      )
    } 
  },
  {
    title: '示例数据',
    dataIndex: 'example',
    hideInSearch: true,
    render: (value: any) => {
      const realValue = !value || value == '-' ? "[]" : value 
      return (
        <CodeViewer
          value={JSON.parse(realValue)}
        />
      )
    } 
  },
  {
    title: '请求头',
    dataIndex: 'headers',
    hideInSearch: true,
    render: (value: any) => {
      const realValue = !value || value == '-' ? "{}" : value 
      return (
        <CodeViewer
          value={JSON.parse(realValue)}
        />
      )
    } 
  },
  {
    title: '数据getter',
    dataIndex: 'getter',
    hideInSearch: true 
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
  }
]