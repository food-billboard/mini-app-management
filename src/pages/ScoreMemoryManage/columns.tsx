import { getScoreClassifyList } from '@/services'

export default [
  {
    title: '积分对象',
    dataIndex: 'target_user_name',
    hideInSearch: true 
  },
  {
    title: '积分人姓名',
    dataIndex: 'create_user_name',
    hideInSearch: true 
  },
  {
    title: '模糊查询',
    dataIndex: 'content',
    valueType: 'text',
    hideInTable: true,
  },
  {
    title: '分类',
    dataIndex: 'target_classify',
    renderText: (_: any, record: any) => record.target_classify_name,
    valueType: 'select',
    fieldProps: {
      showSearch: true,
      filterOption: false,
    },
    request: async ({ keyWords }: any) => {
      if(!keyWords) return []
      return getScoreClassifyList({ 
        content: keyWords,
        currPage: 0,
        pageSize: 999
      })
      .then(data => {
        return data.list.reduce((acc: any[], cur: any) => {
          const { primary_id, primary_content, content, _id } = cur 
          const index = acc.findIndex(item => item.key === primary_id)
          if(!!~index) {
            acc[index].options.push({
              label: content,
              value: _id 
            })
          }else {
            acc.push({
              label: primary_content,
              title: primary_content,
              key: primary_id,
              options: [
                {
                  label: content,
                  value: _id 
                }
              ]
            })
          }
          return acc 
        }, [])
      })
    }
  },
  {
    title: '积分分数',
    dataIndex: 'target_score',
    valueType: 'digit',
  },
  {
    title: '积分类型',
    dataIndex: 'score_type',
    valueType: 'select',
    valueEnum: {
      DONE: '完成',
      DEAL: '待完成 | 未评分',
      TODO: '待定'
    }
  },
  {
    title: '积分原因',
    dataIndex: 'create_content',
    hideInSearch: true 
  },
  {
    title: '积分描述',
    dataIndex: 'create_description',
    hideInSearch: true 
  },
  {
    title: '积分时间',
    dataIndex: 'createdAt',
    valueType: 'dateRange',
    hideInTable: true 
  },
  {
    title: '积分时间',
    dataIndex: 'createdAt',
    hideInSearch: true 
  },
  {
    title: '修改时间',
    dataIndex: 'updatedAt',
    hideInSearch: true 
  },
]