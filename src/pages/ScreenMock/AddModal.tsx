import { Form, Input } from 'antd'
import type { FormInstance } from 'antd/lib/form'
import {
  ModalForm,
  ProFormTextArea,
  ProFormText,
  ProFormRadio,
  ProFormDigitRange,
  ProFormDigit
} from '@ant-design/pro-form'
import type { Store } from 'antd/lib/form/interface'
import React, { useCallback, useMemo, useRef, useState, forwardRef, useImperativeHandle } from 'react'
import { DATA_Name_MAP } from './columns'

type FormData = API_SCREEN.IPostScreenMockDataParams & { _id?: string }

interface IProps {
  onCancel?: () => any
  onSubmit?: (data: FormData) => Promise<boolean | void>
}

export interface IFormRef {
  open: (values?: API_SCREEN.IGetScreenMockData) => void
}

const ConfigMap = {
  text: (props: any) => {
    const { propsValue: value, onDataChange: onChange } = props
    const { max = 20, min = 1, language_type, text_type } = value || {}
    return (
      <>
        <ProFormDigitRange
          name='min_max'
          label="长度范围"
          initialValue={[1, 20]}
          fieldProps={{
            value: [min, max],
            onChange: (newValue) => {
              const [newMin, newMax] = newValue || []
              onChange?.({
                min: newMin,
                max: newMax
              })
            }
          }}
        />
        <ProFormRadio.Group
          initialValue='chinese'
          name="language_type"
          label="语言类型"
          options={[
            {
              value: 'chinese',
              label: '中文'
            },
            {
              value: 'english',
              label: '英文'
            }
          ]}
          fieldProps={{
            value: language_type,
            onChange: (e) => {
              onChange?.({
                language_type: e.target.value
              })
            }
          }}
        />
        <ProFormRadio.Group
          name="text_type"
          label="文字类型"
          initialValue='title'
          options={[
            {
              value: 'paragraph',
              label: '段落'
            },
            {
              value: 'sentence',
              label: '句子'
            },
            {
              value: 'title',
              label: '标题'
            },
            {
              value: 'word',
              label: '字词'
            }
          ]}
          fieldProps={{
            value: text_type,
            onChange: (e) => {
              onChange?.({
                text_type: e.target.value
              })
            }
          }}
        />
      </>
    )
  },
  date: (props: any) => {
    const { propsValue: value, onDataChange: onChange } = props
    const { format, date_type } = value || {}
    return (
      <>
        <ProFormText
          name='format'
          label="日期格式"
          initialValue='yyyy-MM-dd'
          fieldProps={{
            value: format,
            onChange: (e) => {
              onChange?.({
                format: e.target.value
              })
            }
          }}
        />
        <ProFormRadio.Group
          name="date_type"
          label="日期类型"
          initialValue='date'
          fieldProps={{
            value: date_type,
            onChange: (e) => {
              onChange?.({
                date_type: e.target.value
              })
            }
          }}
          options={[
            {
              value: 'date',
              label: '日期'
            },
            {
              value: 'time',
              label: '时间'
            },
            {
              value: 'datetime',
              label: '日期时间'
            }
          ]}
        />
      </>
    )
  },
  number: (props: any) => {
    const { propsValue: value, onDataChange: onChange } = props
    const { min, max, decimal, dmin, dmax } = value || {}
    return (
      <>
        <ProFormDigitRange
          name='min_max'
          label="大小范围"
          initialValue={[1, 20]}
          fieldProps={{
            value: [min, max],
            onChange: (newValue) => {
              const [newMin, newMax] = newValue || []
              onChange?.({
                min: newMin,
                max: newMax
              })
            }
          }}
        />
        <ProFormRadio.Group
          name="decimal"
          label="有无小数"
          initialValue='0'
          options={[
            {
              value: '1',
              label: '有'
            },
            {
              value: '0',
              label: '无'
            }
          ]}
          fieldProps={{
            value: decimal ? '1' : '0',
            onChange: (e) => {
              const newValue = e.target.value
              onChange?.({
                decimal: newValue == '1'
              })
            }
          }}
        />
        {
          !!decimal && (
            <ProFormDigitRange
              name='d_min_max'
              label="小数长度范围"
              initialValue={[1, 10]}
              fieldProps={{
                value: [dmin, dmax],
                onChange: (newValue) => {
                  const [newMin, newMax] = newValue || []
                  onChange?.({
                    dmin: newMin,
                    dmax: newMax
                  })
                }
              }}
            />
          )
        }
      </>
    )
  },
  address: (props: any) => {
    const { propsValue: value, onDataChange: onChange } = props
    const { address_type, prefix } = value || {}
    return (
      <>
        <ProFormRadio.Group
          name="address_type"
          label="地址类型"
          initialValue='contry'
          fieldProps={{
            value: address_type,
            onChange: (e) => {
              onChange?.({
                address_type: e.target.value
              })
            }
          }}
          options={[
            {
              value: 'country',
              label: '国家'
            },
            {
              value: 'province',
              label: '省'
            },
            {
              value: 'city',
              label: '市'
            },
            {
              value: '区',
              label: '有'
            }
          ]}
        />
        {
          (address_type === 'city' || address_type === 'county') && (
            <ProFormRadio.Group
              name="prefix"
              label="是否携带后缀"
              initialValue='1'
              fieldProps={{
                value: prefix ? '1' : '0',
                onChange: (e) => {
                  onChange?.({
                    prefix: e.target.value == '1'
                  })
                }
              }}
              options={[
                {
                  value: '0',
                  label: '不携带'
                },
                {
                  value: '1',
                  label: '携带'
                }
              ]}
            />
          )
        }
      </>
    )
  },
  name: (props: any) => {
    const { propsValue: value, onDataChange: onChange } = props
    const { language_type, name_type } = value || {}
    return (
      <>
        <ProFormRadio.Group
          name="language_type"
          label="语言类型"
          initialValue='chinese'
          options={[
            {
              value: 'chinese',
              label: '中文'
            },
            {
              value: 'english',
              label: '英文'
            }
          ]}
          fieldProps={{
            value: language_type,
            onChange: (e) => {
              onChange?.({
                language_type: e.target.value
              })
            }
          }}
        />
        <ProFormRadio.Group
          name="name_type"
          label="名字类型"
          initialValue='first-last'
          options={[
            {
              value: 'first',
              label: '姓'
            },
            {
              value: 'last',
              label: '名'
            },
            {
              value: 'first-last',
              label: '姓名'
            }
          ]}
          fieldProps={{
            value: name_type,
            onChange: (e) => {
              onChange?.({
                name_type: e.target.value
              })
            }
          }}
        />
      </>
    )
  },
  image: (props: any) => {
    const { propsValue: value, onDataChange: onChange } = props
    const { width, height, color, word, word_color } = value || {}
    return (
      <>
        <ProFormDigit
          name="width"
          label="宽度"
          initialValue={200}
          fieldProps={{
            value: width,
            onChange: (newValue) => {
              onChange?.({
                width: newValue
              })
            }
          }}
        />
        <ProFormDigit
          name="height"
          label="高度"
          initialValue={200}
          fieldProps={{
            value: height,
            onChange: (newValue) => {
              onChange?.({
                height: newValue
              })
            }
          }}
        />
        <ProFormText
          name='color'
          label="颜色"
          fieldProps={{
            value: color,
            onChange: (e) => {
              onChange?.({
                color: e.target.value
              })
            }
          }}
        />
        <ProFormTextArea
          name='word'
          label="文字"
          fieldProps={{
            value: word,
            onChange: (e) => {
              onChange?.({
                word: e.target.value
              })
            }
          }}
        />
        <ProFormText
          name='word_color'
          label="文字颜色"
          fieldProps={{
            value: word_color,
            onChange: (e) => {
              onChange?.({
                word_color: e.target.value
              })
            }
          }}
        />
      </>
    )
  },
}

const ConfigInitialValue = {
  text: {
    min: 1,
    max: 30,
    language_type: 'chinese',
    text_type: 'title'
  },
  date: {
    date_type: 'date',
    format: 'yyyy-MM-dd'
  },
  number: {
    min: 1,
    max: 100,
    decimal: false,
    dmin: 1,
    dmax: 10
  },
  address: {
    address_type: 'province',
    prefix: false,
  },
  name: {
    language_type: 'chinese',
    name_type: 'first-last'
  },
  image: {
    width: 200,
    height: 200,
  }
}

const CreateForm = forwardRef<IFormRef, IProps>((props, ref) => {

  const [visible, setVisible] = useState<boolean>(false)
  const [isPut, setIsPut] = useState<boolean>(false)
  const [configType, setConfigType] = useState<string>('text')
  const [ configValue, setConfigValue ] = useState<any>({...ConfigInitialValue})

  const { onCancel: propsCancel, onSubmit } = useMemo(() => {
    return props
  }, [props])

  const formRef = useRef<FormInstance | null>(null)

  const open = useCallback(async (values?: API_SCREEN.IGetScreenMockData) => {
    setIsPut(!!values)
    setVisible(true)
    if (!values) return

    const { _id, data_kind, description, config_type, config } = values

    formRef.current?.setFieldsValue({
      data_kind,
      description,
      _id,
      config_type,
    })
    setConfigValue((prev: any) => {
      return {
        ...prev,
        [config_type]: {
          ...prev[config_type],
          ...config[config_type] || {}
        }
      }
    })
    setConfigType(config_type)
  }, [])

  const Config = useMemo(() => {
    return ConfigMap[configType || '']
  }, [configType])

  const onCancel = useCallback(() => {
    setVisible(false)
    formRef.current?.resetFields()
    propsCancel?.()
  }, [formRef, propsCancel])

  const onVisibleChange = useCallback((nowVisible: boolean) => {
    if (!nowVisible) onCancel()
    if (nowVisible !== visible) setVisible(nowVisible)
  }, [onCancel, visible])

  const onFinish = useCallback(async (values: Store) => {
    const { data_kind, _id, description, config_type } = values
    const params = {
      data_kind,
      _id,
      description,
      config_type,
      config: {
        [config_type]: configValue[config_type] || {}
      }
    } as FormData
    const result = await (onSubmit?.(params))
    if (typeof result === 'boolean' && !result) return
    setVisible(false)
    formRef.current?.resetFields()
  }, [onSubmit, configValue])

  const hasConfig = useMemo(() => {
    return !!DATA_Name_MAP[configType] && !!ConfigMap[configType]
  }, [configType])

  useImperativeHandle(ref, () => ({
    open
  }))

  return (
    <ModalForm
      title={(isPut ? "修改" : "新增") + "Mock数据"}
      visible={visible}
      // @ts-ignore
      formRef={formRef}
      onFinish={onFinish}
      onVisibleChange={onVisibleChange}
    >
      <ProFormText
        name="data_kind"
        label="名称"
        rules={[
          {
            required: true,
            message: '请输入名称'
          }
        ]}
      />
      <ProFormTextArea
        name="description"
        label="描述"
        fieldProps={{
          autoSize: true
        }}
      />
      <ProFormRadio.Group
        name="config_type"
        label="数据类型"
        initialValue='text'
        rules={[
          {
            required: true,
            message: '请选择数据类型'
          }
        ]}
        fieldProps={{
          onChange: (value: any) => {
            setConfigType(value.target.value)
          }
        }}
        options={Object.entries(DATA_Name_MAP).map(item => ({ label: item[1], value: item[0] }))}
      />
      <Form.Item
        name={configType}
        style={{
          visibility: hasConfig ? 'visible' : 'hidden'
        }}
      >
        {
          hasConfig && (
            <Config propsValue={configValue[configType]} onDataChange={(value: any) => {
              setConfigValue((prev: any) => {
                return {
                  ...prev,
                  [configType]: {
                    ...prev[configType],
                    ...value 
                  } 
                }
              })
            }} />
          )
        }
      </Form.Item>
      <Form.Item
        name="_id"
      >
        <Input type="hidden" />
      </Form.Item>
    </ModalForm>
  )

})

export default CreateForm
