import { Form, message, Rate } from 'antd'
import { FormInstance } from 'antd/lib/form'
import ProForm, {
  DrawerForm,
  ProFormText,
  ProFormDatePicker,
  ProFormSelect,
  ProFormTextArea,
} from '@ant-design/pro-form'
import { Store } from 'antd/lib/form/interface'
import React, { Component, createRef } from 'react'
import SearchForm from './SearchSelect'
import InputAlias from './InputSearch'
import Upload from './Upload'

type FormData = API_DATA.IPutMovieParams | API_DATA.IPostMovieParams 

interface IProps {
  onCancel?: () => any
  onSubmit?: (data: FormData) => any
}

interface IState {
  visible: boolean
  loading: boolean
}

const objectIdReg = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i

const fileValidator = (length: number) => (_: any, value: Array<string>) => {
  const valid = Array.isArray(value) && value.length == length && value.every(val => objectIdReg.test(val))
  return valid ? Promise.resolve() : Promise.reject('请先上传或添加文件')
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

  private onCancel = () => {

    this.setState({ visible: false })
    this.props.onCancel && this.props.onCancel()
  }

  public render = () => {

    const { visible } = this.state

    return (
      <DrawerForm
        title="新建表单"
        visible={visible}
        onFinish={async (values: Store) => {
          console.log(values);
          message.success('提交成功！')

          this.props.onSubmit && this.props.onSubmit(values as FormData)
          return true
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
          name="name" 
          label="名称" 
          placeholder={"请输入电影名称"} 
          rules={[{
            required: true
          }]}
        />
        <ProFormTextArea 
          name="description" 
          label="描述" 
          rules={[{
            required: true
          }]}
        />
        <InputAlias 
          wrapper={{
            name: "alias",
            label: "别名" ,
            tooltip: "超出20个字符会自动截断",
            rules: [{
              required: true
            }]
          }}
        />
        <ProForm.Group>
          <SearchForm 
            wrapper={{  
              label: "演员",
              name: "actor",
              rules: [{
                required: true
              }]
            }}
            item={{
              fetchData: () => Promise.resolve([])
            }}
          />
        </ProForm.Group>
        <ProForm.Group>
          <SearchForm 
            wrapper={{  
              label: "导演",
              name: "director",
              rules: [{
                required: true
              }]
            }}
            item={{
              fetchData: () => Promise.resolve([])
            }}
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
            rules={[{
              required: true
            }]}
          />
        </ProForm.Group>
        <Upload 
          wrapper={{
            label: '视频',
            name: 'direcotr',
            rules: [
              {
                required: true,
                validator: fileValidator(1)
              }
            ]
          }}
          item={{
            maxFiles: 1,
            acceptedFileTypes: ['video/*'],
            allowMultiple: false
          }}
        />
        <Upload 
          wrapper={{
            label: '海报',
            name: 'poster',
            rules: [
              {
                required: true,
                validator: fileValidator(1)
              }
            ]
          }}
          item={{
            maxFiles: 1,
            acceptedFileTypes: ['image/*'],
            allowMultiple: false
          }}
        />
        <Upload 
          wrapper={{
            label: '截图',
            name: 'images',
            rules: [
              {
                required: true,
                validator: fileValidator(6)
              }
            ]
          }}
          item={{
            maxFiles: 6,
            acceptedFileTypes: [ 'image/*' ]
          }}
        />
        <ProFormTextArea 
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
            count={10}
          />
        </Form.Item>
      </DrawerForm>
    )

  }

}

export default CreateForm
