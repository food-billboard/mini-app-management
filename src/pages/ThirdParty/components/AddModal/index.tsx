import React, { forwardRef, useImperativeHandle, useState, useRef, useCallback } from 'react'
import { Form, Input } from 'antd'
import {
  ModalForm,
  ProFormTextArea,
  ProFormSelect
} from '@ant-design/pro-form'
import { pick } from 'lodash'
import type { Store } from 'antd/lib/form/interface'
import type { FormInstance } from 'antd/lib/form'
import CodeEditor from '@/components/CodeEditor'
import { putThirdData, postThirdData } from '@/services'

export type AddModalRef = {
  open: (value?: API_THIRD.GetThirdListData) => void 
}

const AddModal = forwardRef<AddModalRef, {
  onConfrim?: () => void 
}>((props, ref) => {

  const [ visible, setVisible ] = useState<boolean>(false)

  const { onConfrim } = props 

  const formRef = useRef<FormInstance | null>(null)
  const isEdit = useRef<boolean>(true)

  const open = (value?: API_THIRD.GetThirdListData) => {

    isEdit.current = !!value

    if(isEdit.current) {
      const { params, ...nextValue } = value!
      // 获取修改的数据
      formRef.current?.setFieldsValue({
        ...pick(nextValue, ['name', 'description', 'url', 'method', 'getter', 'example', '_id', 'headers']),
        params: JSON.stringify(params || "[]")
      })
    }
    setVisible(true)
  }

  const onCancel = useCallback(() => {
    setVisible(false)
    formRef.current?.resetFields()
  }, [])

  const onVisibleChange = useCallback((nowVisible: boolean) => {
    if(!nowVisible) onCancel()
    if(nowVisible !== visible) setVisible(nowVisible)
  }, [onCancel, visible])

  const onFinish = useCallback(async (values: Store) => {
    const method = isEdit.current ? putThirdData : postThirdData
    await method({
      ...values,
      params: JSON.parse(values.params || "{}")
    } as any)
    setVisible(false)
    formRef.current?.resetFields()
    onConfrim?.()
  }, [onConfrim])

  useImperativeHandle(ref, () => {

    return {
      open
    }

  }, [])

  return (
    <ModalForm
      title="第三方接口设置"
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
        rules={[{
          required: true,
          message: '请输入名称'
        }]}
      />
      <ProFormTextArea 
        name="url" 
        label="请求地址" 
        fieldProps={{
          autoSize: true
        }}
        rules={[{
          required: true,
          message: '请输入请求地址'
        }]}
      />
      <ProFormSelect 
        name="method" 
        label="请求方法" 
        initialValue='post'
        fieldProps={{
          options: [
            {
              label: 'get',
              value: 'get'
            },
            {
              label: 'post',
              value: 'post'
            }
          ]
        }}
        rules={[{
          required: true,
          message: '请设置请求方法'
        }]}
      />
      <Form.Item
        name="params"
        label='请求参数'
        help={(
          <span>
            示例：
            <br />
            <pre>
              {
`
  [
    {
      "name": "obj",
      "description": "描述",
      // number, string, boolean, normal-array, object-array, object
      "data_type": "object", 
      // normal-array, object-array, object 需要传此值
      "children": [
        {
          "name": "name",
          "description": "描述",
          "data_type": "string", 
        }
      ],
      // 默认值
      "default_value": {
        "name": "daniel"
      }
    }
  ]
`
              }
            </pre>
          </span>
        )}
      >
        <CodeEditor 
          language="json" 
          width='100%'
          height={200}
        />
      </Form.Item>
      <Form.Item
        name="headers"
        label='请求头'
      >
        <CodeEditor 
          language="json" 
          width='100%'
          height={100}
        />
      </Form.Item>
      <ProFormTextArea 
        name="getter" 
        label="数据获取" 
        fieldProps={{
          autoSize: true
        }}
      />
      <ProFormTextArea 
        name="description" 
        label="描述" 
        rules={[{
          required: true,
          message: '请输入描述'
        }]}
        fieldProps={{
          autoSize: true
        }}
      />
      <Form.Item
        name="example"
        label='示例数据'
      >
        <CodeEditor 
          language="json" 
          width='100%'
          height={200}
        />
      </Form.Item>
      <Form.Item
        name="_id"
      >
        <Input type="hidden" />
      </Form.Item>
    </ModalForm>
  )

})

export default AddModal