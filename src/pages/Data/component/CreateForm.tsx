import { Form, Input, Modal, Button, message } from 'antd'
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
import { PlusOutlined } from '@ant-design/icons'
import React, { Component, createRef } from 'react'
import SearchForm from './SearchSelect'

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
        <ProFormText width="xl" name="name" label="名称" placeholder={"请输入电影名称"} />
        <ProFormTextArea width="xl" name="description" label="描述" />
        <ProFormDatePicker name="screen_time" label="上映时间" width="m" />
        <ProFormRate width="m" name="rate" label="评分" />
        {/* alias */}
          {/* actor director district language 
          classify  */}
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
          <ProFormUploadDragger width="xl" max={1} label="视频" name="video" />
          <ProFormTextArea width="xl" name="author_description" label="主观描述" />
          <ProFormRate width="m" name="author_rate" label="个人评分" />
          <SearchForm 
            fetchData={() => Promise.resolve([{
              title: '111',
              id: '111'
            }])} 
            label="演员选择"
            name="actor"
          />

        {/* <ProFormSelect
          name="select"
          label="Select"
          hasFeedback
          valueEnum={{
            china: 'China',
            usa: 'U.S.A',
          }}
          placeholder="Please select a country"
          rules={[{ required: true, message: 'Please select your country!' }]}
        />
        <ProFormSelect
          width="m"
          hasFeedback
          request={async () => [
            { label: '全部', value: 'all' },
            { label: '未解决', value: 'open' },
            { label: '已解决', value: 'closed' },
            { label: '解决中', value: 'processing' },
          ]}
          name="useMode"
          label="合同约定生效方式"
        />
        <ProFormSelect
          name="select-multiple"
          label="Select[multiple]"
          hasFeedback
          valueEnum={{
            red: 'Red',
            green: 'Green',
            blue: 'Blue',
          }}
          fieldProps={{
            mode: 'multiple',
          }}
          placeholder="Please select favorite colors"
          rules={[{ required: true, message: 'Please select your favorite colors!', type: 'array' }]}
        />
        <ProFormDigit label="InputNumber" name="input-number" min={1} max={10} />
        <ProFormSwitch name="switch" label="Switch" />
        <ProFormSlider
          name="slider"
          label="Slider"
          marks={{
            0: 'A',
            20: 'B',
            40: 'C',
            60: 'D',
            80: 'E',
            100: 'F',
          }}
        />
        <ProFormRadio.Group
          name="radio"
          label="Radio.Group"
          options={[
            {
              label: 'item 1',
              value: 'a',
            },
            {
              label: 'item 2',
              value: 'b',
            },
            {
              label: 'item 3',
              value: 'c',
            },
          ]}
        />
        <ProFormRadio.Group
          name="radio-button"
          label="Radio.Button"
          radioType="button"
          options={[
            {
              label: 'item 1',
              value: 'a',
            },
            {
              label: 'item 2',
              value: 'b',
            },
            {
              label: 'item 3',
              value: 'c',
            },
          ]}
        />
        <ProFormCheckbox.Group
          name="checkbox-group"
          label="Checkbox.Group"
          options={['A', 'B', 'C', 'D', 'E', 'F']}
        />
        <ProFormUploadButton
          name="upload"
          label="Upload"
          max={2}
          action="/upload.do"
          extra="longgggggggggggggggggggggggggggggggggg"
        />
        <ProForm.Group title="日期相关分组">
          <ProFormDatePicker name="date" label="日期" />
          <ProFormDatePicker.Week name="dateWeek" label="周" />
          <ProFormDatePicker.Month name="dateMonth" label="月" />
          <ProFormDatePicker.Quarter name="dateQuarter" label="季度" />
          <ProFormDatePicker.Year name="dateYear" label="年" />
          <ProFormDateTimePicker name="dateTime" label="日期时间" />
          <ProFormDateRangePicker name="dateRange" label="日期区间" />
          <ProFormDateTimeRangePicker name="dateTimeRange" label="日期时间区间" />
        </ProForm.Group> */}
      </DrawerForm>
    )

  }

}

export default CreateForm
