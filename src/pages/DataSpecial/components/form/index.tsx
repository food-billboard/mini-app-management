import { Form, Input } from 'antd'
import { FormInstance } from 'antd/lib/form'
import ProForm, {
  ModalForm,
  ProFormTextArea,
  ProFormSwitch
} from '@ant-design/pro-form'
import { omit } from 'lodash'
import { Store } from 'antd/lib/form/interface'
import React, { useCallback, useMemo, useRef, useState, forwardRef, useImperativeHandle } from 'react'
import Upload from '@/components/Upload'
import MovieSelect, { ISelectItem } from '@/components/TransferSelect'
import { fileValidator, localFetchData4Array } from '../../../Data/component/utils'
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

  const { onCancel: propsCancel, onSubmit } = useMemo(() => {
    return props
  }, [props])

  const formRef = useRef<FormInstance | null>(null)

  const open = useCallback(async (values?: API_INSTANCE.IGetInstanceSpecialData) => {
    const isEdit = !!values

    const show = () => {
      setVisible(true)
    }

    if(isEdit) {
      //获取修改的数据
      formRef.current?.setFieldsValue({
        ...values,
        poster: Array.isArray(values?.poster) ? values?.poster : [ values?.poster ]
      })
      show()
    }

    show()
  }, [formRef])

  const onCancel = useCallback(() => {
    setVisible(false)
    formRef.current?.resetFields()
    propsCancel && propsCancel()
  }, [formRef])

  const onVisibleChange = useCallback((nowVisible: boolean) => {
    if(!nowVisible) onCancel()
    if(nowVisible != visible) setVisible(nowVisible)
  }, [onCancel, visible])

  const onFinish = useCallback(async (values: Store) => {
    const [ poster ] = values.poster
    onSubmit && onSubmit(({ ...omit(values, ['poster']), poster }) as FormData)
  }, [onSubmit])

  useImperativeHandle(ref, () => ({
    open
  }))

  return (
    <ModalForm
      title="新建表单"
      visible={visible}
      //@ts-ignore
      formRef={formRef}
      onFinish={onFinish}
      onVisibleChange={onVisibleChange}
    >
      <ProFormTextArea 
        name="name" 
        label="名称" 
        rules={[{
          required: true,
          message: '请输入名称'
        }]}
        width={"m"}
      />
      <ProFormTextArea 
        name="description" 
        label="描述" 
        rules={[{
          required: true,
          message: '请输入描述'
        }]}
        width={"m"}
      />
      <ProFormSwitch
        name="valid"
        label="是否启用"
      />
      <Upload 
        wrapper={{
          label: '海报',
          name: 'video',
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
                  return Array.isArray(value) && value.length > 3 ? Promise.resolve() : Promise.reject('请选择电影')
                }
              }
            ]
          }}
          item={{
            fetchData: () => localFetchData4Array<API_DATA.IGetMovieData, ISelectItem>(getMovieList)(['_id', 'key'], ['name', 'title'])
          }}
        />
      </ProForm.Group>
      <MovieSelect
        wrapper={{
          label: '电影',
          name: 'movie',
          rules: [
            {
              required: true,
              message: '请选择电影',
              validator: (_: any, value: string[]) => {
                return Array.isArray(value) && value.length > 3 ? Promise.resolve() : Promise.reject('请选择电影')
              }
            }
          ]
        }}
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
