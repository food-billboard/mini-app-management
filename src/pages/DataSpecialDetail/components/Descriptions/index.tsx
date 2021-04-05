import React, { useMemo, memo, useCallback, useRef } from 'react'
import ProDescriptions from '@ant-design/pro-descriptions'
import { Upload } from '@/components/Upload'
import { fileValidator } from '../../../Data/component/utils'

interface IProps {
  loading?: boolean
  onChange: (value: API_INSTANCE.IPutInstanceSpecialParams) => Promise<void>
}

export default memo((props: IProps) => {

  const actionRef = useRef()

  const { loading, onChange } = useMemo(() => {
    return props 
  }, [props])

  const columns = useMemo(() => {
    return [
      {
        title: '名称',
        dataIndex: 'name',
        valueType: 'text',
        span: 2,

      },
      {
        title: '是否启用',
        dataIndex: 'valid',
        valueType: 'switch',
        span: 1,
      },
      {
        title: '描述',
        dataIndex: 'description',
        valueType: 'textarea',
        span: 3,
      },
      {
        title: '海报',
        dataIndex: 'poster',
        valueType: 'avatar',
        span: 3,
        renderFormItem: (...args) => {
          console.log(args)
          return (
            <Upload 
              maxFiles={1}
              acceptedFileTypes={['video/*']}
              allowMultiple={false}
          />
          )
        }
      }
    ]
  }, [])

  const onBaseInfoValueChange = useCallback((changeValues, values) => {
    console.log(changeValues, values)
    // onChange
  }, [])

  return (
    <ProDescriptions 
      actionRef={actionRef}
      column={{
        xs: 1,
        md: 3,
      }}
      title="基础信息" 
      loading={loading}
      bordered
      editable={{}}
      formProps={{
        onValuesChange: onBaseInfoValueChange
      }}
      columns={columns}
    >
    </ProDescriptions>
  )

})