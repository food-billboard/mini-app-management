
export default [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
    fixed: "left",
  },
  {
    title: '用户名',
    dataIndex: 'username',
    hideInSearch: true,
    fixed: "left",
    width: 100,
    ellipsis: true,
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    hideInSearch: true,
    copyable: true,
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    sorter: true,
    valueType: 'date',
    hideInSearch: true,
  },
  {
    title: '内容',
    dataIndex: 'content',
    valueType: 'text',
    hideInTable: true,
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    sorter: true,
    hideInSearch: true,
  },
]