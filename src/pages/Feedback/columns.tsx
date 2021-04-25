import React from 'react'
import { Carousel, DatePicker, Tooltip, Image } from 'antd'
import { history } from 'umi'
import moment from 'moment'
import { FEEDBACK_STATUS, IMAGE_FALLBACK } from '@/utils'

const { RangePicker } = DatePicker

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
    render: (val: string) => FEEDBACK_STATUS[val] || '-'
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
    }, {})
  },
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
      if(!record.content.image?.length) return ("[图片]")
      return (
        <Tooltip
          title={
            <Carousel
              autoplay
              style={{width: 200, height: 150}}
            >
              {
                record.content.image.map((item: string) => {
                  return (
                    <Image
                      key={item}
                      fallback={IMAGE_FALLBACK}
                      src={item}
                      width={200}
                      height={150}
                    />
                  )
                })
              }
            </Carousel>
          }
        >
          [图片]<a onClick={(e) => {
            e.stopPropagation()
            history.push({
              pathname: '/media/detail/image',
              query: {
                url: record.content.image
              }
            })
          }} style={{textIndent: '1em', color: '#1890ff'}}>(预览)</a>
        </Tooltip>
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
        <a onClick={(e) => {
          e.stopPropagation()
          history.push({
            pathname: '/media/detail/video',
            query: {
              url: record.content.video
            }
          })
        }} style={{color: '#1890ff'}}>(预览)</a>
      )
    }
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    sorter: true,
    valueType: 'date',
    hideInSearch: true,
    renderFormItem: (_: any, { type, defaultRender, ...rest }: any, form: any) => {
      return <RangePicker {...rest} />
    },
    renderText: (val: string) => moment(val).format('YYYY-MM-DD hh:mm:ss')
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
    renderText: (val: string) => moment(val).format('YYYY-MM-DD hh:mm:ss')
  },
]