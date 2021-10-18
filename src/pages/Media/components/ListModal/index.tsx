import React, { useCallback, useState, useImperativeHandle, forwardRef } from 'react'
import { Button, Modal } from 'antd'
import styles from './index.less'

export type ListModalRef = {
  open: (value: API_MEDIA.IGetMediaValidRes) => void 
}

export function formatData(value: API_MEDIA.IGetMediaValidData) {
  const { complete, exists } = value 
  if(complete) {
    return {
      message: "当前资源已上传完成",
      color: "rgb(111, 206, 72)"
    }
  }
  if(exists) {
    return {
      message: "当前资源存在但未上传完成",
      color: "rgba(247, 157, 19)"
    }
  }
  return {
    message: "当前资源出错",
    color: "red"
  }
}

const ListModal = forwardRef<ListModalRef, {}>((props, ref) => {

  const [ visible, setVisible ] = useState<boolean>(false)
  const [ list, setList ] = useState<API_MEDIA.IGetMediaValidRes>([])

  const open = useCallback((value) => {
    setVisible(true)
    setList(value)
  }, [])

  useImperativeHandle(ref, () => {
    return {
      open 
    }
  }, [])

  return (
    <Modal
      visible={visible}
      title="检测结果列表"
      onCancel={setVisible.bind(null, false)}
      footer={[
        <Button type="primary" onClick={setVisible.bind(null, false)}>确定</Button>
      ]}
      bodyStyle={{
        maxHeight: "40vh",
        overflow: "scroll"
      }}
    >
      {
        list.map(item => {
          const { name } = item
          const { message, color } = formatData(item) 
          return (
            <div className={styles["media-valid-item"]} key={item["_id"]}>
              <p>{name}:</p>
              <p style={{color}}>{message}</p>
            </div>
          )
        })
      }
    </Modal>
  )

})

export default ListModal