const columns = [
  {
    title: '排名',
    key: 'index'
  },
  {
    title: '搜索关键词',
    key: 'key_word',
    render: (value) => {
      return (
        <a href="javascript:;">{value}</a>
      )
    }
  },
  {
    title: '用户数量',
    key: 'count',
    sorter: (a, b) => a.count - b.count,
  }
]
.map(item => ({ ...item, dataIndex: item.key, align: 'center' }))

export default columns