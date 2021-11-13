import { Table, Space, Button, Popconfirm, message } from 'antd'
import { history } from 'umi'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { unstable_batchedUpdates } from 'react-dom'
import { LightFilter, ProFormDatePicker } from '@ant-design/pro-form'
import commonColumns from './columns'
import { getMovieCommentList, deleteMovieCommentList, postMovieCommentList } from '@/services'
import { withTry } from '@/utils'
import AddModal from './components/AddModal'
import type { IFormRef } from './components/AddModal'
import { useRef } from 'react-router/node_modules/@types/react'

type IProps = {
  _id?: string 
}

export default memo((props: IProps) => {

  const [ data, setData ] = useState<API_DATA.IGetMovieCommentData[]>([])
  const [ total, setTotal ] = useState<number>(0)
  const [ loading, setLoading ] = useState<boolean>(true)
  const [ currPage, setCurrPage ] = useState<number>(1)

  const addRef = useRef<IFormRef>(null)

  const { _id } = props

  const fetchData = useCallback(async (params: Partial<API_DATA.IGetMovieCommentParams>={}) => {
    if(!_id) return 
    setLoading(true)
    const commentList = await getMovieCommentList({ _id, currPage: currPage - 1, pageSize: 10, ...params }) || {}
    unstable_batchedUpdates(() => {
      setData(commentList?.list || [])
      setTotal(commentList?.total || 0)
      setLoading(false)
    })
  }, [_id, currPage])

  const edit = useCallback((id: string) => {
    return history.push(`/member/${id}`)
  }, [])

  useEffect(() => {
    fetchData()
  }, [])

  const onPageChange = useCallback((page) => {
    setCurrPage(page)
    fetchData()
  }, [currPage])

  const init = useCallback(async (value) => {
    setCurrPage(1)
    await fetchData(value)
  }, [])

  const deleteComment = useCallback(async (id: string) => {
    const [err] = await withTry(deleteMovieCommentList)({
      _id: id 
    })
    if(err) {
      message.info("删除评论出错")
    }
    fetchData()
  }, [fetchData])

  const columns = useMemo(() => {
    return [
      ...commonColumns,
      {
        dataIndex: 'op',
        title: '操作',
        key: 'op',
        fixed: 'right',
        render: (_: any, record: API_DATA.IGetMovieCommentData) => {
          return (
            <Space>
              <Button key="detail" type="link" onClick={edit.bind(null, record["_id"])}>
                详情
              </Button>
              <Popconfirm
                title="是否确定删除？"
                onConfirm={deleteComment.bind(null, record["_id"])}
                okText="确定"
                cancelText="取消"
              >
                <Button danger type="link" key="delete">删除</Button>
              </Popconfirm>
          </Space>
          )
        }
      }
    ]

  }, [deleteComment, edit])

  const openAddModal = useCallback((id: string) => {
    addRef.current?.open(id)
  }, [])

  const postComment = useCallback(async (values: Omit<API_DATA.IPostMovieCommentParams, "source_type">) => {
    const [err] = await withTry(postMovieCommentList)({
      ...values,
      source_type: "movie",
    })
    if(err) {
      message.info("新增评论出错")
    }else {
      onPageChange(1)
    }
  }, [])

  const title = useMemo(() => {
    return function render() {
      return (
        <Space>
          <LightFilter
            collapse
            onFinish={init}
          >
            <ProFormDatePicker
              name="start_date"
              label="起始时间"
              fieldProps={{
                format: 'YYYY-MM-DD'
              }}
            />
            <ProFormDatePicker
              name="end_date"
              label="结束时间"
              fieldProps={{
                format: 'YYYY-MM-DD'
              }}
            />
          </LightFilter>
          <Button key="add" type="primary" onClick={openAddModal.bind(null, _id!)}>新增</Button>
        </Space>
      )
    }
  }, [openAddModal, init, _id])

  return (
    <>
      <Table
        title={title}
        columns={columns as any}
        bordered
        dataSource={data}
        loading={loading}
        pagination={{ total, pageSize: 10, current: currPage, onChange: onPageChange }}
        rowKey={record => record["_id"]}
        scroll={{x: 'max-content'}}
      />
      <AddModal 
        ref={addRef}  
        onSubmit={postComment}
      />
    </>
  )

})