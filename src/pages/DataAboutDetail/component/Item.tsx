import React, { Fragment } from 'react'
import { Button, Card, List, Typography, Space, Input, Form } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { FormInstance } from 'antd/es/form'
import { ProFormText, ProFormSelect } from '@ant-design/pro-form'
import moment from 'moment'
import Upload from '@/components/Upload'
import { 
  getLanguageInfo, 
  getDistrictInfo, 
  getDirectorInfo, 
  getClassifyInfo, 
  getActorInfo,
  deleteActorInfo,
  deleteDirectorInfo,
  deleteLanguageInfo,
  deleteDistrictInfo,
  deleteClassifyInfo,
  putActorInfo,
  putDirectorInfo,
  putDistrictInfo,
  putLanguageInfo,
  putClassifyInfo,
  postActorInfo,
  postDirectorInfo,
  postDistrictInfo,
  postLanguageInfo,
  postClassifyInfo
} from '@/services'
import { SOURCE_TYPE } from '@/utils/constants'
import { formatUrl } from '@/utils'
import { localFetchData4Array } from '../../Data/component/utils'
import styles from '../style.less'

const { Text, Paragraph } = Typography

export type TPath = keyof typeof AboutInfo

export type TDeleteActionType = (id: string) => void
export type TEditActionType = TDeleteActionType
export type TAddActionType = () => void

const format = (date: string) => moment(date).format('YYY-MM-DD')

export const AboutInfo = {
  actor: {
    fetchData: async (values: API_DATA.IGetActorInfoParams) => {
      const data = await getActorInfo(values)
      if(!values || !values._id) return data
      const form: API_DATA.IGetActorInfoRes = Array.isArray(data) ? data[0] : data
      if(!form) return {}
      const { country, another_name, avatar, ...nextForm } = form
      return {
        ...nextForm,
        alias: another_name,
        avatar: Array.isArray(avatar) ? avatar : [avatar],
        country: country?._id
      }
    },
    delete: deleteActorInfo,
    edit: (values: API_DATA.IPutActorInfoParams) => {
      const { avatar, ...nextValues } = values
      return putActorInfo({
        ...nextValues,
        avatar: Array.isArray(avatar) ? avatar[0] : avatar
      })

    },
    add: (values: API_DATA.IPostActorInfoParams) => {
      const { avatar, ...nextValues } = values
      return postActorInfo({
        ...nextValues,
        avatar: Array.isArray(avatar) ? avatar[0] : avatar
      })
    },
    renderItem(operation: {
      deleteItem: TDeleteActionType
      editItem: TEditActionType
      addItem: TAddActionType
    }) {

      const { deleteItem, editItem, addItem } = operation

      return function<T>(item: API_DATA.IGetActorInfoRes): React.ReactNode  {
        const { _id, another_name, name, createdAt, updatedAt, avatar, source_type } = item
        if (_id) {
          return (
            <List.Item key={_id}>
              <Card
                hoverable
                className={styles.card}
                actions={[<a onClick={() => deleteItem(_id)} key="option1">删除</a>, <a onClick={() => editItem(_id)} key="option2">编辑</a>]}
              >
                <Card.Meta
                  avatar={<img alt="" className={styles.cardAvatar} src={formatUrl(avatar)} />}
                  title={<a>{name}</a>}
                  description={
                    <Paragraph
                      className={styles.item}
                      ellipsis={{
                        rows: 3,
                      }}
                    >
                      <Space direction="vertical">
                        <div>
                          别名: {' '}
                          <Text>{another_name}</Text>
                        </div>
                        <div>
                          来源类型: {' '}
                          <Text strong>{SOURCE_TYPE[source_type]}</Text>
                        </div>
                        <div>
                          创建时间: {' '}
                          <Text code>{createdAt}</Text>
                        </div>
                      </Space>
                    </Paragraph>
                  }
                />
              </Card>
            </List.Item>
          )
        }
      
        return (
          <List.Item>
            <Button onClick={() => addItem()} type="dashed" className={styles.newButton}>
              <PlusOutlined /> 新增演员信息
            </Button>
          </List.Item>
        )
      }
    },
    renderForm(form: FormInstance) {
      return (
        <Fragment>
          <ProFormText 
            name="name" 
            label="名称" 
            rules={[
              {
                required: true
              }
            ]}
          />
          <ProFormText name="alias" label="别名" />
          <Upload
            wrapper={{
              name: "avatar",
              label: '海报'
            }}
          />
          <ProFormSelect
            request={() => localFetchData4Array<API_DATA.IGetDistrictInfoRes>(getDistrictInfo)(['_id', 'value'], ['name', 'label'])}
            name="country"
            label="地区"
            hasFeedback
            showSearch
            placeholder="请选择地区"
            rules={[{
              required: true
            }]}
          />
          <Form.Item
            name="_id"
          >
            <Input
              type="hidden"
            />
          </Form.Item>
        </Fragment>
      )
    }
  },
  director: {
    fetchData: async (values: API_DATA.IGetDirectorInfoRes) => {
      const data = await getDirectorInfo(values)
      if(!values || !values._id) return data
      const form: API_DATA.IGetDirectorInfoRes = Array.isArray(data) ? data[0] : data
      if(!form) return {}
      const { country, another_name, avatar, ...nextForm } = form
      return {
        ...nextForm,
        alias: another_name,
        avatar: Array.isArray(avatar) ? avatar : [avatar],
        country: country?._id
      }
    },
    delete: deleteDirectorInfo,
    edit: (values: API_DATA.IPutDirectorInfoParams) => {
      const { avatar, ...nextValues } = values
      return putDirectorInfo({
        ...nextValues,
        avatar: Array.isArray(avatar) ? avatar[0] : avatar
      })

    },
    add: (values: API_DATA.IPostDirectorInfoParams) => {
      const { avatar, ...nextValues } = values
      return postDirectorInfo({
        ...nextValues,
        avatar: Array.isArray(avatar) ? avatar[0] : avatar
      })
    },
    renderItem(operation: {
      deleteItem: TDeleteActionType
      editItem: TEditActionType
      addItem: TAddActionType
    }) {

      const { deleteItem, editItem, addItem } = operation

      return function(item: API_DATA.IGetDirectorInfoRes): React.ReactNode  {
        const { _id, another_name, name, createdAt, updatedAt, avatar, source_type } = item
        if (_id) {
          return (
            <List.Item key={_id}>
              <Card
                hoverable
                className={styles.card}
                actions={[<a onClick={() => deleteItem(_id)} key="option1">删除</a>, <a onClick={() => editItem( _id)} key="option2">编辑</a>]}
              >
                <Card.Meta
                  avatar={<img alt="" className={styles.cardAvatar} src={formatUrl(avatar)} />}
                  title={<a>{name}</a>}
                  description={
                    <Paragraph
                      className={styles.item}
                      ellipsis={{
                        rows: 3,
                      }}
                    >
                      <Space direction="vertical">
                        <div>
                          别名: {' '}
                          <Text>{another_name}</Text>
                        </div>
                        <div>
                          来源类型: {' '}
                          <Text strong>{SOURCE_TYPE[source_type]}</Text>
                        </div>
                        <div>
                          创建时间: {' '}
                          <Text code>{format(createdAt)}</Text>
                        </div>
                      </Space>
                    </Paragraph>
                  }
                />
              </Card>
            </List.Item>
          )
        }
      
        return (
          <List.Item>
            <Button onClick={() => addItem()} type="dashed" className={styles.newButton}>
              <PlusOutlined /> 新增导演信息
            </Button>
          </List.Item>
        )
      }
    },
    renderForm(form: FormInstance) {
      return (
        <Fragment>
          <ProFormText 
            name="name" 
            label="名称" 
            rules={[
              {
                required: true
              }
            ]}
          />
          <ProFormText name="alias" label="别名" />
          <Upload
            wrapper={{
              name: "avatar",
              label: '海报'
            }}
          />
          <ProFormSelect
            request={() => localFetchData4Array<API_DATA.IGetDistrictInfoRes>(getDistrictInfo)(['_id', 'value'], ['name', 'label'])}
            name="country"
            label="地区"
            hasFeedback
            showSearch
            placeholder="请选择地区"
            rules={[{
              required: true
            }]}
          />
          <Form.Item
            name="_id"
          >
            <Input
              type="hidden"
            />
          </Form.Item>
        </Fragment>
      )
    }
  },
  classify: {
    fetchData: getClassifyInfo,
    delete: deleteClassifyInfo,
    edit: (values: API_DATA.IPutClassifyInfoParams) => {
      const { icon, ...nextValues } = values
      return putClassifyInfo({
        ...nextValues,
        icon: Array.isArray(icon) ? icon[0] : icon
      })

    },
    add: (values: API_DATA.IPostClassifyInfoParams) => {
      const { icon, ...nextValues } = values
      return postClassifyInfo({
        ...nextValues,
        icon: Array.isArray(icon) ? icon[0] : icon
      })
    },
    renderItem(operation: {
      deleteItem: TDeleteActionType
      editItem: TEditActionType
      addItem: TAddActionType
    }) {

      const { deleteItem, editItem, addItem } = operation

      return function(item: API_DATA.IGetClassifyInfoRes): React.ReactNode  {
        const { _id, name, createdAt, updatedAt, glance, icon, source_type } = item
        if (_id) {
          return (
            <List.Item key={_id}>
              <Card
                hoverable
                className={styles.card}
                actions={[<a onClick={() => deleteItem(_id)} key="option1">删除</a>, <a onClick={() => editItem(_id)} key="option2">编辑</a>]}
              >
                <Card.Meta
                  avatar={<img alt="" className={styles.cardAvatar} src={formatUrl(icon)} />}
                  title={<a>{name}</a>}
                  description={
                    <Paragraph
                      className={styles.item}
                      ellipsis={{
                        rows: 3,
                      }}
                    >
                      <Space direction="vertical">
                        <div>
                          浏览人数: {' '}
                          <Text>{glance || 0}</Text>
                        </div>
                        <div>
                          来源类型: {' '}
                          <Text strong>{SOURCE_TYPE[source_type]}</Text>
                        </div>
                        <div>
                          创建时间: {' '}
                          <Text code>{format(createdAt)}</Text>
                        </div>
                      </Space>
                    </Paragraph>
                  } 
                />
              </Card>
            </List.Item>
          )
        }
      
        return (
          <List.Item>
            <Button onClick={() => addItem()} type="dashed" className={styles.newButton}>
              <PlusOutlined /> 新增分类信息
            </Button>
          </List.Item>
        )
      }
    },
    renderForm(form: FormInstance) {
      return (
        <Fragment>
          <ProFormText 
            name="name" 
            label="名称" 
            rules={[
              {
                required: true
              }
            ]}
          />
          <Upload
            wrapper={{
              name: "icon",
              label: '图标'
            }}
          />
          <Form.Item
            name="_id"
          >
            <Input
              type="hidden"
            />
          </Form.Item>
        </Fragment>
      )
    }
  },
  language: {
    fetchData: getLanguageInfo,
    delete: deleteLanguageInfo,
    edit: putLanguageInfo,
    add: postLanguageInfo,
    renderItem(operation: {
      deleteItem: TDeleteActionType
      editItem: TEditActionType
      addItem: TAddActionType
    }) {

      const { deleteItem, editItem, addItem } = operation

      return function(item: API_DATA.IGetLanguageInfoRes): React.ReactNode  {
        const { _id, name, createdAt, updatedAt, source_type } = item
        if (_id) {
          return (
            <List.Item key={_id}>
              <Card
                hoverable
                className={styles.card}
                actions={[<a onClick={() => deleteItem(_id)} key="option1">删除</a>, <a onClick={() => editItem(_id)} key="option2">编辑</a>]}
              >
                <Card.Meta
                  title={<a>{name}</a>}
                  description={
                    <Paragraph
                      className={styles.item}
                      ellipsis={{
                        rows: 3,
                      }}
                    >
                      <Space direction="vertical">
                        <div>
                          来源类型: {' '}
                          <Text strong>{SOURCE_TYPE[source_type]}</Text>
                        </div>
                        <div>
                          创建时间: {' '}
                          <Text code>{format(createdAt)}</Text>
                        </div>
                      </Space>
                    </Paragraph>
                  }
                />
              </Card>
            </List.Item>
          )
        }
      
        return (
          <List.Item>
            <Button onClick={() => addItem()} type="dashed" className={styles.newButton}>
              <PlusOutlined /> 新增语言信息
            </Button>
          </List.Item>
        )
      }
    },
    renderForm(form: FormInstance) {
      return (
        <Fragment>
          <ProFormText 
            name="name" 
            label="名称" 
            rules={[
              {
                required: true
              }
            ]}
          />
          <Form.Item
            name="_id"
          >
            <Input
              type="hidden"
            />
          </Form.Item>
        </Fragment>
      )
    }
  },
  district: {
    fetchData: getDistrictInfo,
    delete: deleteDistrictInfo,
    edit: putDistrictInfo,
    add: postDistrictInfo,
    renderItem(operation: {
      deleteItem: TDeleteActionType
      editItem: TEditActionType
      addItem: TAddActionType
    }) {

      const { deleteItem, editItem, addItem } = operation

      return function(item: API_DATA.IGetDistrictInfoRes): React.ReactNode {
        const { _id, name, createdAt, updatedAt, source_type } = item
        if (_id) {
          return (
            <List.Item key={_id}>
              <Card
                hoverable
                className={styles.card}
                actions={[<a onClick={() => deleteItem(_id)} key="option1">删除</a>, <a onClick={() => editItem(_id)} key="option2">编辑</a>]}
              >
                <Card.Meta
                  title={<a>{name}</a>}
                  description={
                      <Paragraph
                        className={styles.item}
                        ellipsis={{
                          rows: 3,
                        }}
                      >
                        <Space
                          direction="vertical"
                        >
                          <div>
                            来源类型: {' '}
                            <Text strong>{SOURCE_TYPE[source_type]}</Text>
                          </div>   
                          <div>
                            创建时间: {' '}
                            <Text code>{format(createdAt)}</Text>
                          </div>                     
                        </Space>
                      </Paragraph>
                  }
                />
              </Card>
            </List.Item>
          )
        }
      
        return (
          <List.Item>
            <Button onClick={() => addItem()} type="dashed" className={styles.newButton}>
              <PlusOutlined /> 新增地区信息
            </Button>
          </List.Item>
        )
      }
    },
    renderForm(form: FormInstance) {
      return (
        <Fragment>
          <ProFormText 
            name="name" 
            label="名称" 
            rules={[
              {
                required: true
              }
            ]}
          />
          <Form.Item
            name="_id"
          >
            <Input
              type="hidden"
            />
          </Form.Item>
        </Fragment>
      )
    }
  }
}