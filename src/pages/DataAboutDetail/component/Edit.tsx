import React, { memo, forwardRef, useImperativeHandle, useState, useRef, useEffect, useCallback } from 'react'
import { unstable_batchedUpdates } from 'react-dom'
import { message } from '@/components/Toast';
import type { ModalProps } from 'antd/es/modal'
import type { FormInstance } from 'antd/es/form'
import { ModalForm } from '@ant-design/pro-components'
import type { Store } from 'antd/lib/form/interface'

interface IProps extends ModalProps {
  onConfirm?: (values: Store) => Promise<any>
  renderForm: (form: FormInstance) => React.ReactNode
  fetchData?: (...args: any[]) => Promise<any>
}

export interface IEditRef {
  open: (values?: { id?: string }) => void
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
      const { id: dataId } = values
      unstable_batchedUpdates(() => {
        setVisible(true)
        setId(dataId)
      })
    }
  })) 

  const internalFetchData = useCallback(async () => {
    if(!id) return 
    if(fetchData) {
      const data = await fetchData({
        _id: id
      })
      let form 
      if(Array.isArray(data)) {
        [ form ] = data
      }else {
        form = data
      }
      formRef.current?.setFieldsValue(form)
    }
  }, [id])

  const onFinish = useCallback(async (values: Store) => {
    await onConfirm?.(values)
    message.success('提交成功')
    formRef.current?.resetFields()
    setVisible(false)
  }, [id])

  const onCancel = useCallback((e: any) => {
    setVisible(false)
    nextProps.onCancel?.(e)
  }, [nextProps])

  const visibleChange = useCallback((visibleState: boolean) => {
    if(!visibleState) {
      onCancel(null)
      setId(false)
      formRef.current?.resetFields()
    }
  }, [onCancel, formRef])

  useEffect(() => {
    if(!id) return 
    if(visible) internalFetchData()
  }, [id, visible])

  return (
    <ModalForm
      title={`${id ? '编辑' : '新增'}信息`}
      open={visible}
      // @ts-ignore
      formRef={formRef}
      onFinish={onFinish}
      onOpenChange={visibleChange}
      modalProps={{
        ...nextProps,
        onCancel,
      }}
    >
      {
        renderForm(formRef.current!)
      }
    </ModalForm>
  )

})

export const Edit = memo(EditModal)