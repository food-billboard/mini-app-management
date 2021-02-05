import React, { memo, Fragment, FC, forwardRef, useImperativeHandle, useCallback, useState } from 'react'
import { Modal as AntModal, Button } from 'antd'

interface IProps {
  onCancel?: () => void
  onOk?: () => void
  onUnOk?: () => void
}

export interface IModalRef {
  open: () => void
}

const Modal = forwardRef<IModalRef, IProps>((props, ref) => {

  const [ visible, setVisible ] = useState<boolean>()

  useImperativeHandle(ref, () => ({
    open
  }))

  const open = useCallback(() => {
    setVisible(true)
  }, [visible])

  const close = useCallback((callback: any) => {
    return function() {
      setVisible(false)
      callback && callback()
    }
  }, [])

  return (
    <AntModal
      footer={
        <Fragment>
          <Button type="default" onClick={close(props.onCancel)}>取消</Button>
          <Button type="default" onClick={close(props.onUnOk)}>否</Button>
          <Button type="default" onClick={close(props.onOk)}>是</Button>
        </Fragment>
      }
      title="提示"
    >
      是否同时复制图层属性
    </AntModal>
  )

})

export default memo(Modal)