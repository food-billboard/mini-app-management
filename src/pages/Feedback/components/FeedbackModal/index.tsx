import React, { memo, forwardRef, useImperativeHandle, useState, useCallback, useMemo } from 'react'
import { unstable_batchedUpdates } from 'react-dom'
import { Modal, Input } from 'antd'
import { merge } from 'lodash'

export type TFeedbackEditData = API_USER.IGetFeedbackData & { description?: string }

export interface IFeedbackModalRef {
  open: (data?: TFeedbackEditData) => void
}

export interface IFeedbackModalProps {
  onOk?: (data: TFeedbackEditData) => Promise<boolean>
  onCancel?: () => Promise<boolean>
}

export default memo(forwardRef<IFeedbackModalRef, IFeedbackModalProps>((props, ref) => {

  const [ visible, setVisible ] = useState<boolean>(false)
  const [ data, setData ] = useState<TFeedbackEditData>()

  useImperativeHandle(ref, () => ({
    open: openModal
  }), [])

  const openModal = useCallback((data?: TFeedbackEditData) => {
    unstable_batchedUpdates(() => {
      data && setData(() => {
        const { status, ...nextData } = data
        return merge({}, nextData, {
          status: status === 'DEALING' ? 'DEAL' : 'DEALING' as API_USER.TFeedbackStatus
        })
      })
      setVisible(true)
    })
  }, [])

  const { onOk, onCancel } = useMemo(() => {
    return props
  }, [props])

  const onInputOk = useCallback(async () => {
    let res = true 
    if(onOk) {
      res = await onOk(data!)
    }
    if(res) {
      setVisible(false)
    }
  }, [onOk, data])

  const onInputCancel = useCallback(async () => {
    let res = true 
    if(onCancel) {
      res = await onCancel()
    }
    if(res) {
      setVisible(false)
    }
  }, [onCancel])

  return (
    <Modal
      visible={visible}
      okText="确定"
      cancelText="取消"
      title='提示'
      onOk={onInputOk}
      onCancel={onInputCancel}
    >
      <Input.TextArea
        autoSize
        defaultValue="输入对此次处理的描述"
        maxLength={100}
        showCount
        value={data?.description}
        onChange={(e) => setData(prevData => merge({}, prevData, { description: e.target.value }))}
      />
    </Modal>
  )

}))