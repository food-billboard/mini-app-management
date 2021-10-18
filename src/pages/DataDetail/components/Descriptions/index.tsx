import React, { useMemo, memo, useCallback } from 'react'
import { Card, Button } from 'antd'
import { history } from 'umi'
import ProDescriptions from '@ant-design/pro-descriptions'
import { PreImage } from '../../../DataSpecialDetail/components/Descriptions/upload'

interface IProps {
  loading?: boolean
  value?: API_DATA.IGetMovieData
}

export default memo((props: IProps) => {

  const { loading, value } = useMemo(() => {
    return props 
  }, [props])

  const preview = useCallback((urlList: string | string[]) => {
    const url = Array.isArray(urlList) ? urlList : [urlList]
    return history.push({ 
      pathname: '/media/image',
      query: {
        url
      }
     })
  }, [])

  const columns = useMemo(() => {
    return [
      {
        title: 'id',
        dataIndex: '_id',
        valueType: 'text',
        key: '_id',
        span: 1,
        copyable: true,
      },
      {
        title: '名称',
        dataIndex: 'name',
        valueType: 'text',
        key: 'name',
        span: 2,
      },
      {
        title: '作者',
        dataIndex: 'author',
        valueType: 'text',
        key: 'author',
        span: 1,
        renderText: (author: API_DATA.IGetMovieData["author"]) => {
          const { username, _id } = author || {}
          return <Button type="link" onClick={() => history.push(`/member/${_id}`)}>{username}</Button>
        }
      },
      {
        title: '海报',
        dataIndex: 'poster',
        key: 'poster',
        valueType: 'text',
        span: 2,
        renderText: (poster: string) => {
          return <PreImage value={poster} onClick={preview.bind(null, poster)} />
        }
      },
      {
        title: '截图',
        dataIndex: 'images',
        key: 'images',
        valueType: 'text',
        span: 3,
        renderText: (images: string[]) => {
          return (
            <PreImage value={images[0]} onClick={preview.bind(null, images)} />
          )
        }
      },
      {
        title: '创建时间',
        key: 'createdAt',
        dataIndex: 'createdAt',
        valueType: 'date',
        span: 1,
      },
      {
        title: '更新时间',
        key: 'updatedAt',
        dataIndex: 'updatedAt',
        valueType: 'date',
        span: 1,
      },
      {
        title: '浏览量',
        dataIndex: 'glance',
        valueType: 'number',
        key: 'glance',
        span: 1,
      },
      {
        title: '人气',
        dataIndex: 'hot',
        valueType: 'number',
        key: 'hot',
        span: 1,
      },
      {
        title: '评分',
        dataIndex: 'rate',
        valueType: 'number',
        key: 'rate',
        span: 1,
        renderText: (rate_person: number, record: API_DATA.IGetMovieData) => {
          return `${record.total_rate}/${rate_person}人`
        }
      },
      {
        title: '来源类型',
        dataIndex: 'source_type',
        key: 'source_type',
        span: 1,
        valueType: 'select',
        valueEnum: {
          ORIGIN: {
            text: '系统',
            status: 'Success',
          },
          USER: {
            text: '用户',
            status: 'Default',
          },
        },
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        span: 1,
        valueType: 'select',
        valueEnum: {
          VERIFY: {
            text: '审核中',
            status: 'Default',
          },
          NOT_VERIFY: {
            text: '未通过',
            status: 'Error',
          },
          COMPLETE: {
            text: '通过',
            status: 'Default',
          },
        },
      },
      {
        title: '弹幕数量',
        dataIndex: 'barrage_count',
        valueType: 'number',
        key: 'barrage_count',
        span: 1,
      },
      {
        title: '评论数量',
        dataIndex: 'comment_count',
        valueType: 'number',
        key: 'comment_count',
        span: 1,
      },
      {
        title: '标签数量',
        dataIndex: 'tag_count',
        valueType: 'number',
        key: 'tag_count',
        span: 1,
      },
    ]
  }, [])

  return (
    <Card>
      <ProDescriptions 
        dataSource={value}
        column={{
          xs: 1,
          md: 3,
        }}
        style={{
          backgroundColor: 'white'
        }}
        loading={loading}
        bordered
        columns={columns}
      >
      </ProDescriptions>
    </Card>
  )

})