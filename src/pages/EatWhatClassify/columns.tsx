import React from 'react';
import { Tag } from 'antd';
import moment from 'moment';

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

export const FOOD_MAP = [
  {
    label: '荤菜',
    value: 'MEAT',
    color: 'error',
  },
  {
    label: '素菜',
    value: 'VEGETABLE',
    color: 'processing',
  },
  {
    label: '汤类',
    value: 'SOUP',
    color: 'success',
  },
  {
    label: '其他',
    value: 'OTHER',
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
    title: '餐别类型',
    dataIndex: 'menu_type',
    valueType: 'select',
    key: 'menu_type',
    valueEnum: MENU_MAP.reduce((acc, cur) => {
      return {
        ...acc,
        [cur.value]: {
          text: cur.label,
        },
      };
    }, {}),
    renderText: (val: string[]) => {
      return val.map((data) => {
        const target = MENU_MAP.find((item) => item.value === data);
        return (
          <Tag key={data} color={target?.color}>
            {target?.label}
          </Tag>
        );
      });
    },
  },
  {
    title: '菜单类型',
    dataIndex: 'food_type',
    valueType: 'select',
    key: 'food_type',
    valueEnum: FOOD_MAP.reduce((acc, cur) => {
      return {
        ...acc,
        [cur.value]: {
          text: cur.label,
        },
      };
    }, {}),
    renderText: (val: string[] = []) => {
      return val.map((data) => {
        const target = FOOD_MAP.find((item) => item.value === data);
        return (
          <Tag key={data} color={target?.color}>
            {target?.label}
          </Tag>
        );
      });
    },
  },
  {
    title: '内容',
    dataIndex: 'content',
    hideInTable: true,
    key: 'content',
    ellipsis: true,
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    hideInSearch: true,
    key: 'createdAt',
    renderText: (val: string) => moment(val).format('YYYY-MM-DD hh:mm:ss'),
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    hideInSearch: true,
    key: 'updatedAt',
    renderText: (val: string) => moment(val).format('YYYY-MM-DD hh:mm:ss'),
  },
];
