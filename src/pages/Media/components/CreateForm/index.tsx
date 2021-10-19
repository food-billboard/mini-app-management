import { Form, Input } from 'antd'
import type { FormInstance } from 'antd/lib/form'
import {
  ModalForm,
  ProFormTextArea,
  ProFormSelect
} from '@ant-design/pro-form'
import type { Store } from 'antd/lib/form/interface'
import React, { useCallback, useMemo, useRef, useState, forwardRef, useImperativeHandle } from 'react'
import { MEDIA_AUTH_MAP, MEDIA_UPLOAD_STATUS } from '@/utils'

type FormData = API_MEDIA.IPutMediaParams

interface IProps {
  onCancel?: () => any
  onSubmit?: (data: FormData) => any
}

export interface IFormRef {
  open: (values: API_MEDIA.IGetMediaListData) => void
}

const CreateForm = forwardRef<IFormRef, IProps>((props, ref) => {

  const [ visible, setVisible ] = useState<boolean>(false)

  const { onCancel: propsCancel, onSubmit } = useMemo(() => {
    return props
  }, [props])

  const formRef = useRef<FormInstance | null>(null)

  const open = useCallback(async (values: API_MEDIA.IGetMediaListData) => {
    formRef.current?.setFieldsValue(values)
    setVisible(true)
  }, [formRef])

  const onCancel = useCallback(() => {
    setVisible(false)
    formRef.current?.resetFields()
    propsCancel?.()
  }, [formRef, propsCancel])

  const onVisibleChange = useCallback((nowVisible: boolean) => {
    if(!nowVisible) onCancel()
    if(nowVisible !== visible) setVisible(nowVisible)
  }, [onCancel, visible])

  const onFinish = useCallback(async (values: Store) => {
    await (onSubmit?.((values) as FormData))
    setVisible(false)
    formRef.current?.resetFields()
  }, [onSubmit])

  useImperativeHandle(ref, () => ({
    open
  }))

  const mediaAuth = useMemo(() => {
    return Object.entries(MEDIA_AUTH_MAP).reduce((acc, cur) => {
      const [ key, value ] = cur
      acc.push({
        label: value,
        value: key
      }) 
      return acc 
    }, [] as ({ label: string, value: string }[]))
  }, [])

  const mediaStatus = useMemo(() => {
    return Object.entries(MEDIA_UPLOAD_STATUS).reduce((acc, cur) => {
      const [ key, value ] = cur
      acc.push({
        label: value,
        value: key
      }) 
      return acc 
    }, [] as ({ label: string, value: string }[]))
  }, [])

  return (
    <ModalForm
      title="媒体资源修改"
      visible={visible}
      // @ts-ignore
      formRef={formRef}
      onFinish={onFinish}
      onVisibleChange={onVisibleChange}
    >
      <ProFormTextArea 
        name="name" 
        label="名称" 
        fieldProps={{
          autoSize: true
        }}
      />
      <ProFormSelect
        name="auth"
        label="权限"
        options={mediaAuth}
        rules={[{ required: true, message: '请选择权限类型' }]}
      />
      <ProFormSelect
        name="status"
        label="状态"
        options={mediaStatus}
        rules={[{ required: true, message: '请选择文件状态' }]}
      />
      <Form.Item
        name="_id"
      >
        <Input type="hidden" />
      </Form.Item>
    </ModalForm>
  )

})

export default CreateForm
