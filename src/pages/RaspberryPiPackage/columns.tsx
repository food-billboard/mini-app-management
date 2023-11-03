import React from 'react';
import { history } from 'umi';

export default [
  {
    title: 'id',
    dataIndex: '_id',
    copyable: true,
    hideInSearch: true,
  },
  {
    title: '仓库名称',
    dataIndex: 'name',
    hideInSearch: true,
  },
  {
    title: '描述',
    dataIndex: 'description',
    hideInSearch: true,
  },
  {
    title: 'github地址',
    dataIndex: 'url',
    hideInSearch: true,
  },
  {
    title: '本地模块路径',
    dataIndex: 'folder',
    hideInSearch: true,
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    hideInSearch: true,
  },
  {
    title: '修改时间',
    dataIndex: 'updatedAt',
    hideInSearch: true,
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
];
