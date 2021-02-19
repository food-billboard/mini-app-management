import React, { memo, forwardRef, useImperativeHandle, useCallback, useState, useRef } from 'react'
import { message } from 'antd'
import {
  ModalForm,
} from '@ant-design/pro-form'
import { FormInstance } from 'antd/lib/form'

interface IProps {
  onCancel?: () => void
  onOk?: (...args: any[]) => void
}

export interface IModalRef {
  open: () => void
}

const Modal = forwardRef<IModalRef, IProps>((props, ref) => {

  const [ visible, setVisible ] = useState<boolean>()

  const modalRef = useRef<FormInstance>()

  useImperativeHandle(ref, () => ({
    open
  }))

  const open = useCallback(() => {
    setVisible(true)
  }, [visible])

  const close = useCallback(() => {
    setVisible(false)
    props.onCancel && props.onCancel()
  }, [])

  const finish = useCallback(async (values) => {
    console.log(values)
    message.success('提交成功')
    props.onOk && props.onOk(values)
    setVisible(false)
    return true
  }, [])

  return (
    <ModalForm
      title="请选择保存类型"
      formRef={modalRef}
      modalProps={{
        onCancel: close
      }}
      onFinish={finish}
      visible={visible}
    >
      
    </ModalForm>
  )

})

export default memo(Modal)