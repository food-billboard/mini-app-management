import { Form, Input } from 'antd'
import type { FormInstance } from 'antd/lib/form'
import ProForm, {
  ModalForm,
  ProFormTextArea,
  ProFormSwitch
} from '@ant-design/pro-form'
import { omit } from 'lodash'
import type { Store } from 'antd/lib/form/interface'
import React, { useCallback, useRef, useState, forwardRef, useImperativeHandle } from 'react'
import Upload from '@/components/Upload'
import MovieSelect from '@/components/TransferSelect'
import { fileValidator } from '../../../DataEdit/utils'
import { getMovieList } from '@/services'

type FormData = API_INSTANCE.IPutInstanceSpecialParams | API_INSTANCE.IPostInstanceSpecialParams 

interface IProps {
  onCancel?: () => any
  onSubmit?: (data: FormData) => any
}

export interface IFormRef {
  open: (values?: API_INSTANCE.IGetInstanceSpecialData) => void
}

const CreateForm = forwardRef<IFormRef, IProps>((props, ref) => {

  const [ visible, setVisible ] = useState<boolean>(false)

  const { onCancel: propsCancel, onSubmit } = props

  const formRef = useRef<FormInstance | null>(null)

  const open = useCallback(async (values?: API_INSTANCE.IGetInstanceSpecialData) => {
    const isEdit = !!values

    const show = () => {
      setVisible(true)
    }
    if(isEdit) {
      const { poster, movie, ...nextValues } = values!
      // 获取修改的数据
      formRef.current?.setFieldsValue({
        ...nextValues,
        poster: Array.isArray(poster) ? poster : [ poster ],
        movie: movie.map(item => item["_id"])
      })
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
    const [ poster ] = values.poster || []
    await (onSubmit && onSubmit(({ ...omit(values, ['poster']), poster }) as FormData))
    setVisible(false)
    formRef.current?.resetFields()
  }, [onSubmit])

  useImperativeHandle(ref, () => ({
    open
  }))

  return (
    <ModalForm
      title="新增专题"
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
      <ProFormSwitch
        name="valid"
        label="是否启用"
      />
      <Upload 
        wrapper={{
          label: '海报',
          name: 'poster',
          rules: [
            {
              required: true,
              validator: fileValidator(1),
              validateTrigger: 'onBlur'
            }
          ]
        }}
        item={{
          maxFiles: 1,
          acceptedFileTypes: ['image/*'],
          allowMultiple: false
        }}
      />
      <ProForm.Group>
        <MovieSelect 
          wrapper={{
            label: '电影',
            name: 'movie',
            rules: [
              {
                required: true,
                message: '请选择电影',
                validator: (_: any, value: string[]) => {
                  return Array.isArray(value) && value.length >= 3 ? Promise.resolve() : Promise.reject(new Error("请选择电影"))
                }
              }
            ]
          }}
          item={{
            fetchData: async () => {
              const data = await getMovieList()
              return data.list?.map((item: any) => {
                const { _id, name } = item
                return {
                  key: _id,
                  title: name 
                } 
              }) || []
            }
          }}
        />
      </ProForm.Group>
      <Form.Item
        name="_id"
      >
        <Input type="hidden" />
      </Form.Item>
    </ModalForm>
  )

})

export default CreateForm
