import React, { useMemo, memo, useCallback, useRef, useContext } from 'react'
import { Card, Tag } from 'antd'
import { pick } from 'lodash' 
import ProDescriptions from '@ant-design/pro-descriptions'
import ProProvider from '@ant-design/pro-provider'
import Upload, { PreImage } from './upload'

interface IProps {
  loading?: boolean
  onChange: (value: Partial<API_INSTANCE.IPutInstanceSpecialParams>) => Promise<void>
  value?: API_INSTANCE.IGetInstanceSpecialData
}

export default memo((props: IProps) => {

  const values = useContext(ProProvider)

  const actionRef = useRef()

  const { loading, onChange, value } = useMemo(() => {
    return props 
  }, [props])

  const columns = useMemo(() => {
    return [
      {
        title: '名称',
        dataIndex: 'name',
        valueType: 'text',
        key: 'name',
        span: 2,
      },
      {
        title: '是否启用',
        dataIndex: 'valid',
        valueType: 'switch',
        key: 'valid',
        span: 1,
        render: (value: any) => {
          return (
            <Tag color={!!value ? 'lime' : 'red'}>{!!value ? '启用' : '禁用'}</Tag>
          )
        }
      },
      {
        title: '描述',
        dataIndex: 'description',
        valueType: 'textarea',
        key: 'description',
        span: 3,
      },
      {
        title: '海报',
        dataIndex: 'poster',
        key: 'poster',
        valueType: 'poster',
        span: 3
      }
    ]
  }, [])

  const onBaseInfoValueChange = useCallback(async (key: any, record: API_INSTANCE.IGetInstanceSpecialData) => {
    onChange(pick(record, [key]))
  }, [onChange])

  return (
    <ProProvider.Provider
      value={{
        ...values,
        valueTypeMap: {
          poster: {
            render: PreImage,
            renderFormItem: (value: any, props: any) => {
              return (
                <div
                  style={{
                    width: 400,
                    height: 285,
                    overflow: 'auto',
                  }}
                >
                  <Upload
                    value={value}
                    props={props}
                  />
                </div>
              )
            },
          }
        },
      }}
    >
      <Card>
        <ProDescriptions 
          actionRef={actionRef}
          dataSource={value}
          column={{
            xs: 1,
            md: 3,
          }}
          style={{
            backgroundColor: 'white'
          }}
          loading={loading}
          bordered
          editable={{
            onSave: onBaseInfoValueChange
          }}
          columns={columns}
        >
        </ProDescriptions>
      </Card>
    </ProProvider.Provider>
  )

})