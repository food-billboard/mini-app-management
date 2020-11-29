import { Form, Input, Modal, Button, message, Rate } from 'antd'
import { FormInstance } from 'antd/lib/form'
import ProForm, {
  ModalForm,
  DrawerForm,
  ProFormText,
  ProFormDateRangePicker,
  ProFormDatePicker,
  ProFormSelect,
  ProFormRadio,
  ProFormCheckbox,
  ProFormUploadDragger,
  ProFormRate,
  ProFormTextArea,
  ProFromFieldSet,
  ProFormUploadButton
} from '@ant-design/pro-form'
import { PlusOutlined, InfoCircleOutlined } from '@ant-design/icons'
import React, { Component, createRef } from 'react'
import SearchForm from './SearchSelect'
import InputAlias from './InputSearch'

interface IProps {
  onCancel?: () => any
  onSubmit?: (data: API_DATA.IPutMovieParams | API_DATA.IPostMovieParams) => any
}

interface IState {
  visible: boolean
  loading: boolean
}

class CreateForm extends Component<IProps, IState> {

  public state: IState = {
    visible: false,
    loading: false
  }

  private formRef = createRef<FormInstance>()

  public open = async (id?: string) => {
    const isEdit = !!id
    this.setState({
      visible: true,
      loading: isEdit
    })

    if(isEdit) {
      //获取修改的数据
      Promise.resolve()
      .then(data => {
        this.formRef.current?.setFieldsValue(data)
      })
    }

  }

  private onOk = () => {
    this.formRef.current?.validateFields([])
    .then((data: any) => {
      console.log(data)
      this.formRef.current?.resetFields()
      this.setState({ visible: false })
      this.props.onSubmit && this.props.onSubmit(data)
    })
    .catch(_ => {})
  }

  private onCancel = () => {

    this.setState({ visible: false })
    this.props.onCancel && this.props.onCancel()
  }

  public render = () => {

    const { visible } = this.state

    return (
      <DrawerForm
        title="新建表单"
        trigger={
          <Button type="primary">
            <PlusOutlined />
            新建数据
          </Button>
        }
        onFinish={async (values) => {
          console.log(values);
          message.success('提交成功！');
          return true;
        }}
      >
        <ProFormText 
          // width="xl" 
          name="name" 
          label="名称" 
          placeholder={"请输入电影名称"} 
          rules={[{
            required: true
          }]}
        />
        <ProFormTextArea 
          // width="xl" 
          name="description" 
          label="描述" 
          rules={[{
            required: true
          }]}
        />
        <InputAlias 
          name="alias" 
          label="别名" 
          tooltip={"超出20个字符会自动截断"} 
          rules={[{
            required: true
          }]}
        />
        <ProForm.Group>
          <SearchForm 
            fetchData={() => Promise.resolve([])} 
            label="演员"
            name="actor"
            rules={[{
              required: true
            }]}
          />
        </ProForm.Group>
        <ProForm.Group>
          <SearchForm 
            fetchData={() => Promise.resolve([])} 
            label="导演"
            name="director"
            rules={[{
              required: true
            }]}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormSelect
            request={() => Promise.resolve([])}
            name="classify"
            label="分类"
            hasFeedback
            placeholder="请选择分类"
            showSearch
            rules={[{
              required: true
            }]}
          />
          <ProFormSelect
            request={() => Promise.resolve([])}
            name="language"
            label="语言"
            hasFeedback
            showSearch
            placeholder="请选择语言"
            rules={[{
              required: true
            }]}
          />
          <ProFormSelect
            request={() => Promise.resolve([])}
            name="district"
            label="地区"
            hasFeedback
            showSearch
            placeholder="请选择地区"
            rules={[{
              required: true
            }]}
          />
          <ProFormDatePicker 
            name="screen_time" 
            label="上映时间" 
            // width="m" 
            rules={[{
              required: true
            }]}
          />
        </ProForm.Group>
        <ProFormUploadButton
          name="poster"
          label="海报上传"
          max={1}
          action="/upload.do"
        />
        <ProFormUploadButton
          name="poster"
          label="截图上传"
          max={6}
          action="/upload.do"
        />
        <ProFormUploadDragger 
          width="xl" 
          max={1} 
          label="视频" 
          name="video" 
        />
        <ProFormTextArea 
          // width="xl" 
          name="author_description" 
          label="主观描述" 
          rules={[{
            required: true
          }]}
        />
        <Form.Item
          name="author_rate" 
          label="个人评分" 
          rules={[{
            required: true
          }]}
        >
          <Rate
            // width="m" 
            count={10}
          />
        </Form.Item>
      </DrawerForm>
    )

  }

}

export default CreateForm
