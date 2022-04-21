import React, { forwardRef, useCallback, useImperativeHandle, useState } from 'react'
import { Modal } from 'antd'

export type ImagePreviewRef = {
  open: (value: string) => void 
}

const ImagePreview = forwardRef<ImagePreviewRef, any>((props, ref) => {

  const [ visible, setVisible ] = useState<boolean>(false)
  const [ value, setValue ] = useState<string>('')

  const open = useCallback((value: string) => {
    setValue(value)
    setVisible(true)
  }, [])

  useImperativeHandle(ref, () => {
    return {
      open 
    }
  }, [])

  return (
    <Modal
      visible={visible}
      bodyStyle={{padding: 0}}
      footer={null}
      onCancel={() => setVisible(false)}
    >
      <img
        src={value}
        width='100%'
      />
    </Modal>
  )

})

export default ImagePreview