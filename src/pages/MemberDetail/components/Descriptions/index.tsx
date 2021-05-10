import React, { useMemo, memo, useCallback, useRef, useContext } from 'react'
import { Card } from 'antd'
import { pick } from 'lodash' 
import ProDescriptions from '@ant-design/pro-descriptions'
import ProProvider from '@ant-design/pro-provider'
import Upload, { PreImage } from '../../../DataSpecialDetail/components/Descriptions/upload'
import { USER_STATUS, ROLES_MAP } from '@/utils'

interface IProps {
  loading?: boolean
  onChange: (value: Partial<API_USER.IPutUserParams>) => Promise<any>
  value?: API_USER.IGetUserDetailRes
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
        title: 'id',
        dataIndex: '_id',
        valueType: 'text',
        key: '_id',
        span: 1,
        editable: false,
      },
      {
        title: '用户名',
        dataIndex: 'username',
        valueType: 'text',
        key: 'username',
        span: 1,
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
        valueType: 'text',
        key: 'mobile',
        span: 1,
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        valueType: 'text',
        key: 'email',
        span: 1,
      },
      {
        title: '密码',
        dataIndex: 'password',
        valueType: 'password',
        key: 'password',
        span: 1,
        render: () => '---'
      },
      {
        title: '描述',
        dataIndex: 'description',
        valueType: 'textarea',
        key: 'description',
        span: 1,
      },
      {
        title: '头像',
        dataIndex: 'avatar',
        key: 'avatar',
        valueType: 'poster',
        span: 1
      },
      {
        title: '角色',
        dataIndex: 'roles',
        valueType: 'select',
        valueEnum: Object.entries(ROLES_MAP).reduce((acc, cur) => {
          const [ key, title ] = cur
          acc[key] = {
            text: title
          } 
          return acc 
        }, {}),
        fieldProps: {
          mode: "multiple"
        },
        key: 'roles',
        span: 1,
      },
      {
        title: '创建时间',
        dataIndex: 'createdAt',
        valueType: 'date',
        key: 'createdAt',
        span: 1,
        editable: false
      },
      {
        title: '更新时间',
        dataIndex: 'updatedAt',
        valueType: 'date',
        key: 'updatedAt',
        span: 1,
        editable: false
      },
      {
        title: '账号状态',
        dataIndex: 'status',
        valueType: 'string',
        key: 'status',
        span: 1,
        editable: false,
        render: (value: string) => USER_STATUS[value]
      },
      {
        title: '粉丝数量',
        dataIndex: 'fans_count',
        valueType: 'number',
        key: 'fans_count',
        span: 1,
        editable: false,
      },
      {
        title: '评论数量',
        dataIndex: 'comment_count',
        valueType: 'number',
        key: 'comment_count',
        span: 1,
        editable: false,
      },
      {
        title: '上传数量',
        dataIndex: 'issue_count',
        valueType: 'number',
        key: 'issue_count',
        span: 1,
        editable: false,
      },
      {
        title: '收藏数量',
        dataIndex: 'store_count',
        valueType: 'number',
        key: 'store_count',
        span: 1,
        editable: false,
      },
      {
        title: '关注数量',
        dataIndex: 'attentions_count',
        valueType: 'number',
        key: 'attentions_count',
        span: 1,
        editable: false,
      },
    ]
  }, [])

  const onBaseInfoValueChange = useCallback(async (key: any, record: API_USER.IGetUserDetailRes) => {
    onChange(pick(record, [key]))
  }, [onChange])

  return (
    <ProProvider.Provider
      value={{
        ...values,
        valueTypeMap: {
          poster: {
            render: (value: string) => {
              const image = Array.isArray(value) ? value[0] : value 
              return <PreImage value={image} />
            },
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
          },
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
          //@ts-ignore
          columns={columns}
        >
        </ProDescriptions>
      </Card>
    </ProProvider.Provider>
  )

})