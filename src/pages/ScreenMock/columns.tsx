import React from 'react'
import { Tag } from 'antd'
import { history } from 'umi';

const DATA_MAP = {
  image: 'magenta',
  color: 'red',
  text: 'volcano',
  name: 'orange',
  number: 'gold',
  boolean: 'lime',
  address: 'green',
  date: 'cyan',
  web: 'blue'
}

export const DATA_Name_MAP = {
  image: '图片',
  color: '颜色',
  text: '文本',
  name: '姓名',
  number: '数字',
  boolean: '布尔',
  address: '地址',
  date: '日期',
  web: 'url'
}

export default [
  {
    title: 'id',
    dataIndex: '_id',
    hideInSearch: true 
  },
  {
    title: '名称',
    dataIndex: 'data_kind',
    hideInSearch: true 
  },
  {
    title: '内容',
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
    title: '数据类型',
    dataIndex: 'config_type',
    render: (val: string) => {
      if(!DATA_MAP[val]) return '-'
      return <Tag color={DATA_MAP[val]}>{DATA_Name_MAP[val]}</Tag>
    },
    hideInSearch: true 
  },
  {
    title: '数据类型',
    dataIndex: 'date_type',
    hideInTable: true,
    valueEnum: DATA_Name_MAP,
  },
]