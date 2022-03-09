import React, { useState, useCallback } from 'react'
import { Button, message, Popconfirm, Modal, Input } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { getDoubanMovieData } from '@/services'

const AddModal = (props: {
  onConfirm?: (id: string) => void 
  onCancel?: () => void 
}) => {

  const { onCancel: propsOnCancel, onConfirm } = props 

  const [ addLoading, setAddLoading ] = useState<boolean>(false)
  const [ stateValue, setStateValue ] = useState<string>('')
  const [ visible, setVisible ] = useState<boolean>(false)

  const handleConfirm = async () => {
    setAddLoading(true)
    setVisible(true)
  }

  const onCancel = useCallback(() => {
    setAddLoading(false)
    setStateValue('')
    setVisible(false)
  }, [])

  const onOk = useCallback(() => {
    if(!stateValue) {
      message.info('请输入电影的id')
      return 
    }

    getDoubanMovieData({ _id: stateValue })
    .then((data) => {
      setStateValue('')
      setAddLoading(false)
      setVisible(false)
      onConfirm?.(data as string)
    })
    .catch(() => {
      message.info('网络错误，请重试')
    })
  }, [stateValue, onConfirm])

  return (
    <>
      <Popconfirm
        title='是否使用豆瓣数据自动生成'
        key={'add'}
        onCancel={propsOnCancel}
        onConfirm={handleConfirm}
        okText='是'
        cancelText='否'
      >
        <Button loading={addLoading} icon={<PlusOutlined />} type="primary">
          新建
        </Button>
      </Popconfirm>
      <Modal
        title='豆瓣电影id'
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
      >
        <Input
          value={stateValue}
          onChange={(e) => {
            setStateValue(e.target.value)
          }}
        />
        <p>只是自己使用，不商用</p>
      </Modal>
    </>
  )

}

export default AddModal