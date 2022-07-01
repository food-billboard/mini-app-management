import React from 'react'
import { Tag, DatePicker, Image } from 'antd'
import { history } from 'umi'
import moment from 'moment'
import { SOURCE_TYPE, MEDIA_AUTH_MAP, MEDIA_UPLOAD_STATUS, fileSize, IMAGE_FALLBACK } from '@/utils'

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
    copyable: true,
  },
  {
    title: '来源',
    dataIndex: 'origin',
    hideInSearch: true,
    renderText: (val: API_MEDIA.IGetMediaListData["origin"]) => {
      if(!val._id) return '-'
      return <a onClick={() => history.push(`/member/${val._id}`)}>{val.name}</a>
    }
  },
  {
    title: '文件地址',
    dataIndex: 'src',
    hideInSearch: true,
    copyable: true,
    ellipsis: true,
    width: 100,
  },
  {
    title: '文件名',
    dataIndex: 'name',
    hideInSearch: true,
    ellipsis: true,
    width: 50,
  },
  {
    title: '白名单数量',
    dataIndex: 'white_list_count',
    hideInSearch: true,
  },
  {
    title: '海报',
    dataIndex: 'poster',
    hideInSearch: true,
    render: (value: string) => {
      return (
        <Image src={value} width={50} height={50} fallback={IMAGE_FALLBACK} />
      )
    }
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    sorter: true,
    valueType: 'date',
    hideInSearch: true,
    renderFormItem: (_: any, { type, defaultRender, ...rest }: any) => {
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
    title: '内容',
    dataIndex: 'content',
    valueType: 'text',
    hideInTable: true,
    search: {

    },
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    sorter: true,
    hideInSearch: true,
    renderText: (val: string) => moment(val).format('YYYY-MM-DD hh:mm:ss')
  },
  {
    title: '来源类型',
    dataIndex: 'origin_type',
    hideInSearch: true,
    renderText: (val: string) => {
      return <Tag color={val === "ORIGIN" ? "blue" : "green"}>{SOURCE_TYPE[val]}</Tag>
    }
  },
  {
    title: '来源类型',
    dataIndex: 'origin_type',
    hideInTable: true,
    valueEnum: Object.keys(SOURCE_TYPE).reduce((acc: any, cur: string) => {
      acc[cur] = {
        text: SOURCE_TYPE[cur],
        origin_type: cur
      }
      return acc
    }, {}),
  },
  {
    title: '权限',
    dataIndex: 'auth',
    hideInSearch: true,
    renderText: (val: string) => {
      return (
        <Tag color={val === "PUBLIC" ? "cyan" : "red"}>{MEDIA_AUTH_MAP[val]}</Tag>
      )
    }
  },
  {
    title: '权限',
    dataIndex: 'auth',
    hideInTable: true,
    valueEnum: Object.keys(MEDIA_AUTH_MAP).reduce((acc: any, cur: string) => {
      acc[cur] = {
        text: MEDIA_AUTH_MAP[cur],
        source_type: cur
      }
      return acc
    }, {}),
  },
  {
    title: 'md5',
    dataIndex: 'md5',
    hideInSearch: true,
    render: (_: string, record: API_MEDIA.IGetMediaListData) => record.info.md5 || '-'
  },
  {
    title: '文件大小',
    dataIndex: 'size',
    hideInSearch: true,
    render: (_: string, record: API_MEDIA.IGetMediaListData) => {
      if(Number.isNaN(record.info.size)) return '-'
      return fileSize(record.info.size)
    }
  },
  {
    title: 'mime',
    dataIndex: 'mime',
    hideInSearch: true,
    render: (_: string, record: API_MEDIA.IGetMediaListData) => (record.info.mime || '-').toLowerCase()
  },
  {
    title: '状态',
    dataIndex: 'status',
    hideInSearch: true,
    render: (_: string, record: API_MEDIA.IGetMediaListData) => {
      let color = 'error'
      switch(record.info.status) {
        case 'COMPLETE': 
          color = 'cyan'
          break 
        case 'UPLOADING':
          color = 'gold'
          break 
        case 'ERROR': 
        default: color = 'error'
      }
      return (
        <Tag color={color}>{MEDIA_UPLOAD_STATUS[record.info.status] || '-'}</Tag>
      )
    }
  },
  {
    title: '状态',
    dataIndex: 'status',
    hideInTable: true,
    valueEnum: Object.keys(MEDIA_UPLOAD_STATUS).reduce((acc: any, cur: string) => {
      acc[cur] = {
        text: MEDIA_UPLOAD_STATUS[cur],
        status: cur
      }
      return acc
    }, {})
  },
  {
    title: '文件大小',
    dataIndex: 'size',
    hideInTable: true,
    tip: "设置此筛选条件将自动忽略最大和最小文件大小字段",
    valueType: "progress"
  },
  {
    title: '最小文件大小',
    dataIndex: 'minSize',
    hideInTable: true,
    valueType: "progress"
  },
  {
    title: '最大文件大小',
    dataIndex: 'maxSize',
    hideInTable: true,
    valueType: "progress"
  },
]