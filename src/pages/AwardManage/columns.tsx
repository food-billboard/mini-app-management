import { SCORE_AWARD_CYCLE_TYPE_ARRAY } from '@/utils'

export default [
  {
    title: '奖品名称',
    dataIndex: 'award_name',
    hideInSearch: true 
  },
  {
    title: '模糊查询',
    dataIndex: 'content',
    valueType: 'text',
    hideInTable: true,
  },
  {
    title: '描述',
    dataIndex: 'award_description',
    hideInSearch: true 
  },
  {
    title: '库存',
    dataIndex: 'inventory',
  },
  {
    title: '所需积分',
    dataIndex: 'exchange_score',
    hideInSearch: true,
  },
  {
    title: '兑换周期',
    dataIndex: 'award_cycle',
    valueEnum: SCORE_AWARD_CYCLE_TYPE_ARRAY.reduce((acc, cur) => {
      return {
        ...acc,
        [cur.value] : {
          text: cur.label
        }
      } 
    }, {}),
  },
  {
    title: '兑换周期次数',
    dataIndex: 'award_cycle_count',
    hideInSearch: true,
  },
  {
    title: '创建用户',
    dataIndex: 'create_user_name',
    hideInSearch: true,
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
]