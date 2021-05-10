import { Form, message, Input } from 'antd'
import { FormInstance } from 'antd/lib/form'
import {
  ModalForm,
  ProFormText,
  ProFormSelect,
  ProFormTextArea,
} from '@ant-design/pro-form'
import { Store } from 'antd/lib/form/interface'
import React, { Component, createRef } from 'react'
import Upload from '@/components/Upload'
import { getUserDetail } from '@/services'
import { fileValidator } from '../../../DataEdit/utils'
import { ROLES_MAP } from '@/utils'

export type FormData = API_DATA.IPutMovieParams | API_DATA.IPostMovieParams 

const _ROLES_MAP = Object.keys(ROLES_MAP).map(item => ({
  value: item,
  label: ROLES_MAP[item]
}))

interface IProps {
  onCancel?: () => any
  onSubmit?: (data: FormData) => Promise<any> | any
}

interface IState {
  visible: boolean
  loading: boolean
  editable: boolean
}

class CreateForm extends Component<IProps, IState> {

  public state: IState = {
    visible: false,
    loading: false,
    editable: false
  }

  private formRef = createRef<FormInstance>()

  public open = async (id?: string) => {
    const isEdit = !!id

    const show = () => {
      this.setState({
        visible: true,
        loading: isEdit,
        editable: isEdit
      })
    }

    if(id) {
      //获取修改的数据
      return await getUserDetail({
        _id: id
      })
      .then((data: API_USER.IGetUserDetailRes) => {
        const { avatar } = data
        this.formRef.current?.setFieldsValue({
          ...data,
          poster: Array.isArray(avatar) ? avatar : [avatar],
          _id: id
        })
        show()
      })
      .catch(err => {
        console.log(err)
        message.info('数据获取错误，请重试')
      })
    }

    show()

  }

  private onCancel = () => {
    this.setState({ visible: false })
    this.formRef.current?.resetFields()
    this.props.onCancel && this.props.onCancel()
  }

  public render = () => {

    const { visible } = this.state

    return (
      <ModalForm
        title="新建表单"
        visible={visible}
        //@ts-ignore
        formRef={this.formRef as any}
        onFinish={async (values: Store) => {
          this.props.onSubmit && this.props.onSubmit(values as FormData)
          this.setState({ visible: false })
          this.formRef.current?.resetFields()
        }}
        onVisibleChange={(visible: boolean) => {
          if(!visible) this.onCancel()
          this.setState(prev => {
            if(prev.visible === visible) return null
            return { visible }
          })
        }}
      >
        <ProFormText 
          name="mobile" 
          label="手机号" 
          placeholder={"请输入手机号"} 
          rules={[{
            required: true
          }]}
        />
        <ProFormText 
          name="password" 
          label="密码" 
          placeholder={"请输入密码"} 
        />
        <ProFormText 
          name="email" 
          label="邮箱" 
          placeholder={"请输入邮箱"} 
          rules={[{
            required: true
          }]}
        />
        <ProFormText 
          name="username" 
          label="用户名" 
          placeholder={"请输入用户名"} 
          rules={[{
            required: true
          }]}
        />
        <ProFormTextArea 
          name="description" 
          label="描述" 
          fieldProps={{
            autoSize: true
          }}
          rules={[{
            required: true
          }]}
        />
        <ProFormSelect
          options={_ROLES_MAP}
          name="roles"
          label="权限"
          hasFeedback
          placeholder="请选择权限"
          showSearch
          mode="multiple"
          rules={[{
            required: true
          }]}
        />
        <Upload 
          wrapper={{
            label: '头像',
            name: 'avatar',
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
        <Form.Item
          name="_id" 
        >
          <Input
            type="hidden"
          />
        </Form.Item>
      </ModalForm>
    )

  }

}

export default CreateForm
