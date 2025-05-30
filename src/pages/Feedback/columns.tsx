import { DatePicker, Tag, Button } from 'antd'
import dayjs from 'dayjs'
import ImageView from '@/components/TableImageView'
import { preview } from '@/components/VideoPreview'
import { FEEDBACK_STATUS } from '@/utils'

const { RangePicker } = DatePicker

export const commentView = () => {
  return [
    {
      title: '文字内容',
      dataIndex: 'text',
      ellipsis: true,
      hideInSearch: true,
      renderText: (_: any, record: API_USER.IGetFeedbackData) => {
        return record.content.text
      }
    },
    {
      title: '图片内容',
      dataIndex: 'image',
      hideInSearch: true,
      render: (_: any, record: API_USER.IGetFeedbackData) => {
        return (
          <ImageView
            value={record.content.image}
          />
        )
      }
    },
    {
      title: '视频内容',
      dataIndex: 'video',
      hideInSearch: true,
      renderText: (_: any, record: API_USER.IGetFeedbackData) => {
        if(!record.content.video?.length) return ("[视频]")
        return (
          <Button
            type="link"
            onClick={() => {
              return preview(record.content.video)
            }}
          >
            (预览)
          </Button>
        )
      }
    },
  ]
}

export default [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: 'id',
    dataIndex: '_id',
    hideInSearch: true,
  },
  {
    title: '状态',
    dataIndex: 'status',
    hideInSearch: true,
    render: (val: string) => {
      return <Tag color="yellow">{FEEDBACK_STATUS[val] || '-'}</Tag>
    }
  },
  {
    title: '状态',
    dataIndex: 'status',
    hideInTable: true,
    valueEnum: Object.keys(FEEDBACK_STATUS).reduce((acc: any, cur: string) => {
      acc[cur] = {
        text: FEEDBACK_STATUS[cur],
        status: cur
      }
      return acc
    }, {}),
    initialValue: "DEALING"
  },
  ...commentView(),
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    sorter: true,
    valueType: 'date',
    hideInSearch: true,
    renderFormItem: (_: any, { type, defaultRender, ...rest }: any) => {
      return <RangePicker {...rest} />
    },
    renderText: (val: string) => dayjs(val).format('YYYY-MM-DD hh:mm:ss')
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    valueType: 'dateRange',
    hideInTable: true,
    search: {
      transform: (value: any) => {
        return {
          start_date: value[0],
          end_end: value[1],
        };
      },
    },
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    sorter: true,
    hideInSearch: true,
    renderText: (val: string) => dayjs(val).format('YYYY-MM-DD hh:mm:ss')
  },
]