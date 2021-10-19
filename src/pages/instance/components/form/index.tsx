import { Form, Input } from 'antd'
import type { FormInstance } from 'antd/lib/form'
import {
  ModalForm,
  ProFormTextArea,
  ProFormSwitch
} from '@ant-design/pro-form'
import type { Store } from 'antd/lib/form/interface'
import React, { useCallback, useMemo, useRef, useState, forwardRef, useImperativeHandle } from 'react'

type FormData = API_INSTANCE.IPutInstanceInfoParams | API_INSTANCE.IPostInstanceInfoParams 

interface IProps {
  onCancel?: () => any
  onSubmit?: (data: FormData) => any
}

export interface IFormRef {
  open: (values?: API_INSTANCE.IGetInstanceInfoData) => void
}

const CreateForm = forwardRef<IFormRef, IProps>((props, ref) => {

  const [ visible, setVisible ] = useState<boolean>(false)

  const { onCancel: propsCancel, onSubmit } = useMemo(() => {
    return props
  }, [props])

  const formRef = useRef<FormInstance | null>(null)

  const open = useCallback(async (values?: API_INSTANCE.IGetInstanceInfoData) => {
    const isEdit = !!values

    const show = () => {
      setVisible(true)
    }

    if(isEdit) {
      // 获取修改的数据
      formRef.current?.setFieldsValue(values)
      show()
    }

    show()
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
    await onSubmit?.(values as FormData)
    setVisible(false)
    formRef.current?.resetFields()
  }, [onSubmit])

  useImperativeHandle(ref, () => ({
    open
  }))

  return (
    <ModalForm
      title="新增实例"
      visible={visible}
      // @ts-ignore
      formRef={formRef}
      onFinish={onFinish}
      onVisibleChange={onVisibleChange}
    >
      <ProFormTextArea 
        name="info" 
        label="信息" 
        rules={[{
          required: true,
          message: '请输入信息'
        }]}
        fieldProps={{
          autoSize: true
        }}
      />
      <ProFormTextArea 
        name="notice" 
        label="跑马灯" 
        rules={[{
          required: true,
          message: '请输入跑马灯内容'
        }]}
        fieldProps={{
          autoSize: true
        }}
      />
      <ProFormSwitch
        name="valid"
        label="是否启用"
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
