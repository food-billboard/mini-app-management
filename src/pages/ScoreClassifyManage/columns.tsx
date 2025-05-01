
export default [
  {
    title: '内容',
    dataIndex: 'content',
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
    dataIndex: 'create_user_name',
    hideInSearch: true,
  },
]