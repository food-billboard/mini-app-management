import { Form, Rate, message } from 'antd'
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
import SearchForm, { ISelectItem } from './SearchSelect'
import InputAlias from './InputSearch'
import Upload from '@/components/Upload'
import { getActorInfo, getDirectorInfo, getDistrictInfo, getLanguageInfo, getClassifyInfo, getMovieInfo } from '@/services'
import { fileValidator, localFetchData4Array } from './utils'

type FormData = API_DATA.IPutMovieParams | API_DATA.IPostMovieParams 

interface IProps {
  onCancel?: () => any
  onSubmit?: (data: FormData) => any
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
      return await getMovieInfo({
        _id: id
      })
      .then((data: API_DATA.IGetMovieInfoRes) => {
        const { poster, video } = data
        this.formRef.current?.setFieldsValue({
          ...data,
          poster: [poster],
          video: [video]
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
      <DrawerForm
        title="新建表单"
        visible={visible}
        formRef={this.formRef as any}
        onFinish={async (values: Store) => {
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
              fetchData: () => localFetchData4Array<API_DATA.IGetActorInfoRes, ISelectItem>(getActorInfo)(['_id', 'key'], ['name', 'title'])
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
              fetchData: () => localFetchData4Array<API_DATA.IGetDirectorInfoRes, ISelectItem>(getDirectorInfo)(['_id', 'key'], ['name', 'title'])
            }}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormSelect
            request={async () => await localFetchData4Array<API_DATA.IGetClassifyInfoRes>(getClassifyInfo)(['_id', 'value'], [ 'name', 'label' ])}
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
            request={() => localFetchData4Array<API_DATA.IGetLanguageInfoRes>(getLanguageInfo)(['_id', 'value'], [ 'name', 'label' ])}
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
            request={() => localFetchData4Array(getDistrictInfo)()}
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
        <Upload 
          wrapper={{
            label: '截图',
            name: 'images',
            rules: [
              {
                required: true,
                validator: fileValidator(6),
                validateTrigger: 'onBlur'
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
