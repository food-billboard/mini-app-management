import React from 'react';
import { Tag } from 'antd';
import dayjs from 'dayjs';

export const MENU_MAP = [
  {
    label: '早餐',
    value: 'BREAKFAST',
    color: 'success',
  },
  {
    label: '午餐',
    value: 'LUNCH',
    color: 'processing',
  },
  {
    label: '晚餐',
    value: 'DINNER',
    color: 'error',
  },
  {
    label: '夜宵',
    value: 'NIGHT_SNACK',
    color: 'warning',
  },
];

export default [
  {
    title: '标题',
    dataIndex: 'title',
    hideInSearch: true,
    key: 'title',
    ellipsis: true,
  },
  {
    title: '描述',
    dataIndex: 'description',
    hideInSearch: true,
    key: 'description',
    ellipsis: true,
  },
  {
    title: '分类描述',
    dataIndex: 'classify_description',
    hideInSearch: true,
    key: 'classify_description',
    ellipsis: true,
  },
  {
    title: '餐别类型',
    dataIndex: 'menu_type',
    valueType: 'option',
    key: 'menu_type',
    renderText: (val: string) => {
      const target = MENU_MAP.find((item) => item.value === val);
      return <Tag color={target?.color}>{target?.label}</Tag>;
    },
  },
  // {
  //   title: '内容',
  //   dataIndex: 'content',
  //   hideInTable: true,
  //   key: 'content',
  //   ellipsis: true,
  // },
  {
    title: '时间',
    dataIndex: 'date',
    key: 'date',
    render: (val: string) => {
      return dayjs(val).format('YYYY-MM-DD');
    },
    valueType: 'dateRange',
    initialValue: [dayjs(), dayjs()],
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    hideInSearch: true,
    key: 'createdAt',
    renderText: (val: string) => dayjs(val).format('YYYY-MM-DD hh:mm:ss'),
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    hideInSearch: true,
    key: 'updatedAt',
    renderText: (val: string) => dayjs(val).format('YYYY-MM-DD hh:mm:ss'),
  },
];
