import { Table, Modal } from 'antd'
import React, { memo, useCallback, useEffect, useMemo, useState, Fragment, useRef } from 'react'
import { unstable_batchedUpdates } from 'react-dom'
import { omit } from 'lodash'
import { message } from '@/components/Toast';
import FeedbackModal, { IFeedbackModalRef } from '../../../Feedback/components/FeedbackModal'
import MemberEdit from '../../../Member/components/CreateForm'
import { ACTIVE_KEY_MAP } from '../../constants'

type IProps = {
  value?: string
  activeKey: keyof typeof ACTIVE_KEY_MAP 
}

export type ListData = API_USER.IGetFeedbackData | API_USER.ICommentData | API_USER.IGetUserRateData | API_USER.IGetUserIssueData | API_USER.IGetUserListResData

export default memo((props: IProps) => {

  const [ data, setData ] = useState<ListData[]>([])
  const [ total, setTotal ] = useState<number>(0)
  const [ loading, setLoading ] = useState<boolean>(true)
  const [ currPage, setCurPage ] = useState<number>(1)

  const feedbackRef = useRef<IFeedbackModalRef>(null)
  const memberRef = useRef<MemberEdit>(null)

  const { value, activeKey } = useMemo(() => {
    return props 
  }, [props])

  const fetchData = useCallback(async (param: Partial<API_USER.IGetUserCommentListParams | API_USER.IGetFeedbackListParams | API_USER.IGetUserRateListParams | API_USER.IGetUserIssueListParams | API_USER.IGetUserAttentionsListParams | API_USER.IGetUserFansListParams>={}) => {
    setLoading(true)
    const data = await ACTIVE_KEY_MAP[activeKey].fetchData({
      ...param as any,
      _id: value,
      pageSize: 10,
      currPage: currPage - 1
    })

    unstable_batchedUpdates(() => {
      setData(data?.list || [])
      setTotal(data?.total || 0)
      setLoading(false)
    })
  }, [value, activeKey, currPage])

  const handleRemove = useCallback(async (id: string) => {
    const res = await new Promise((resolve) => {

      Modal.confirm({
        cancelText: '取消',
        centered: true,
        content: '是否确定删除',
        okText: '确定',
        title: '提示',
        onCancel: function(close) {
          close()
          resolve(false)
        },
        onOk: function(close) {
          close()
          resolve(true)
        }
      })
  
    })
  
    if(!res) return
  
    const hide = message.loading('正在删除')
    if (!id) return true
  
    const response = await ACTIVE_KEY_MAP[activeKey]?.deleteOp({ _id: id })
    .then(_ => {
      hide()
      message.success('删除成功，即将刷新')
      return true
    })
    .catch(_ => {
      hide()
      message.error('删除失败，请重试')
      return false
    })
  
    return response
  }, [value, activeKey])

  const reload = useCallback(async () => {
    let method = currPage == 1 ? fetchData : () => {}
    setCurPage(() => 1)
    await method()
  }, [currPage, activeKey])

  useEffect(() => {
    if(value) fetchData()
  }, [ currPage, value, activeKey ])

  const onTableChange = useCallback((pagination) => {
    setCurPage(pagination)
  }, [])

  const columns = useMemo(() => {
    return [
      ...ACTIVE_KEY_MAP[activeKey].columns,
      {
        dataIndex: 'op',
        title: '操作',
        key: 'op',
        fixed: 'right',
        render: (_: any, record: ListData) => {
          let ref  
          switch(activeKey) {
            case 'fans':
            case 'attentions':
              ref = memberRef
              break
            case 'feedback':
              ref = feedbackRef
              break
            default:
              ref = null 
          }
          return ACTIVE_KEY_MAP[activeKey].op(record as any, ref, handleRemove)
        }
      }
    ]

  }, [handleRemove, activeKey])

  return (
    <Fragment>
      <Table
        columns={columns as any}
        bordered
        dataSource={data}
        loading={loading}
        pagination={{ total, pageSize: 10, current: currPage }}
        rowKey={record => record._id}
        scroll={{x: 'max-content'}}
        onChange={onTableChange}
      />
      {
        activeKey === 'feedback' && (
          <FeedbackModal
            ref={feedbackRef}
            {...omit(ACTIVE_KEY_MAP[activeKey].editOp, ['onOk'])}
            onOk={ACTIVE_KEY_MAP[activeKey].editOp.onOk.bind(this, reload)}
          />
        )
      }
      {
        activeKey === 'fans' || activeKey === 'attentions' && (
          <MemberEdit
            ref={memberRef}
            {...omit(ACTIVE_KEY_MAP[activeKey].editOp, ['onOk'])}
            onSubmit={ACTIVE_KEY_MAP[activeKey].editOp.onOk.bind(this, reload)}
          />
        )
      }
    </Fragment>
  )

})