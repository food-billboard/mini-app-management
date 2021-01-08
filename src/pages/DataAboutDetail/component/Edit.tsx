import React, { memo, forwardRef, useImperativeHandle, useState, useRef, useEffect, useCallback } from 'react'
import { unstable_batchedUpdates } from 'react-dom'
import { message } from 'antd'
import { ModalProps } from 'antd/es/modal'
import { FormInstance } from 'antd/es/form'
import { ModalForm } from '@ant-design/pro-form'
import { Store } from 'antd/lib/form/interface'

interface IProps extends ModalProps {
  onConfirm?: (values: Store) => Promise<any>
  renderForm: (form: FormInstance) => React.ReactNode
  fetchData?(): Promise<any>
}

export interface IEditRef {
  open(values?: { id?: string }): void
}

const EditModal = forwardRef<IEditRef, IProps>((props, ref) => {

  const { renderForm, onConfirm, fetchData, ...nextProps } = props

  const [ visible, setVisible ] = useState<boolean>(false)
  const [ id, setId ] = useState<string | boolean>()

  const formRef = useRef<FormInstance>()

  useImperativeHandle(ref, () => ({
    open: (values: {
      id?: string
    }={}) => {
      const { id } = values
      unstable_batchedUpdates(() => {
        setVisible(true)
        setId(id)
      })
    }
  })) 

  const internalFetchData = useCallback(async () => {
    if(!id) return 
    if(fetchData) {
      const data = await fetchData()
      formRef.current?.setFieldsValue(data)
    }
  }, [id])

  const onFinish = useCallback(async (values: Store) => {
    console.log(values)
    message.success('提交成功')
    onConfirm && await onConfirm(values)
    return true
  }, [id])

  const onCancel = useCallback((e) => {
    setVisible(false)
    nextProps.onCancel && nextProps.onCancel(e)
  }, [])

  useEffect(() => {
    if(!id) return 
    internalFetchData()
  }, [id])

  useEffect(() => {
    if(visible) return 
    formRef.current?.resetFields()
  }, [visible])

  return (
    <ModalForm
      title={`${id ? '编辑' : '新增'}信息`}
      visible={visible}
      formRef={formRef}
      onFinish={onFinish}
      modalProps={{
        ...nextProps,
        onCancel
      }}
    >
      {
        renderForm(formRef.current!)
      }
    </ModalForm>
  )

})

export const Edit = memo(EditModal)