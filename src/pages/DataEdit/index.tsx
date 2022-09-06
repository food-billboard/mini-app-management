import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import { Form, Rate, message, Input, Card, Button } from 'antd'
import type { FormInstance } from 'antd/lib/form'
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout'
import ProForm, {
  ProFormText,
  ProFormDatePicker,
  ProFormSelect,
  ProFormTextArea,
} from '@ant-design/pro-form'
import { history } from 'umi'
import moment from 'moment'
import type { Store } from 'antd/lib/form/interface'
import SearchForm from '@/components/TransferSelect'
import type { ISelectItem } from '@/components/TransferSelect'
import InputAlias from './components/InputSearch'
import Upload from '@/components/Upload'
import { isObjectId } from '@/components/Upload/util'
import VideoUpload from '@/components/VideoUpload'
import { getDoubanMovieDataDetail, getActorInfo, getDirectorInfo, getDistrictInfo, getLanguageInfo, getClassifyInfo, getMovieInfo, putMovie, postMovie } from '@/services'
import { fileValidator, localFetchData4Array } from './utils'
import { withTry } from '@/utils'

const CreateForm = memo(() => {

  const [ loading, setLoading ] = useState<boolean>(false)

  const formRef = useRef<FormInstance>()

  const fetchData = async () => {
    const { location: { query } } = history
    const { id } = query as { id: string | undefined }

    if(id) {
      const method = isObjectId(id) ? getMovieInfo : getDoubanMovieDataDetail
      // 获取修改的数据
      return await method({
        _id: id
      })
      .then((data: API_DATA.IGetMovieInfoRes) => {
        const { poster, video } = data
        formRef.current?.setFieldsValue({
          ...data,
          poster: [poster],
          video: [video],
          _id: isObjectId(id) ? id : undefined 
        })
      })
      .catch(err => {
        message.info('数据获取错误，请重试')
      })
    }

    return Promise.resolve()

  }

  const handleAdd = useCallback(async (fields: any) => {
    const hide = message.loading('正在添加')
    const method = fields["_id"] ? putMovie : postMovie
  
    const { video, poster, district, classify, language, ...nextFields } = fields
  
    const params = {
      ...nextFields,
      classify: Array.isArray(classify) ? classify : [classify],
      district: Array.isArray(district) ? district : [district],
      language: Array.isArray(language) ? language : [language],
      video: Array.isArray(video) ? video[0] : video,
      poster: Array.isArray(poster) ? poster[0] : poster
    }
  
    try {
      await method(params)
      hide()
      message.success('操作成功')
      return true
    } catch (error) {
      hide()
      message.error('操作失败请重试！')
      return false
    }
  }, [])

  const onFinish = useCallback(async (values: Store) => {
    const [ , success ] = await withTry(handleAdd)(values)
    if(success) {
      formRef.current?.resetFields()
      history.go(-1)
    }
  }, [formRef, handleAdd])

  const handleSaveDraft = useCallback(async () => {
    return formRef.current?.validateFields()
    .then(value => {
      return onFinish(value)
    })
    .catch(err => {

    })
  }, [onFinish])

  useEffect(() => {
    fetchData()
    .then(() => setLoading(false))
  }, [])

  return (
    <PageContainer
      title="新建表单"
    >
     <Card
      bordered
      loading={loading}
     >
      <ProForm
        formRef={formRef}
        onFinish={onFinish}
        submitter={{
          render: (_, dom) => {
            return (
              <FooterToolbar
                extra={
                  <Button type='primary' onClick={handleSaveDraft}>保存草稿</Button>
                }
              >{dom}</FooterToolbar>
            )
          },
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
          fieldProps={{
            autoSize: true
          }}
          rules={[{
            required: true
          }]}
        />
        <InputAlias 
          wrapper={{
            name: "alias",
            label: "别名" ,
            tooltip: "超出20个字符会自动截断"
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
              fetchData: () => localFetchData4Array<API_DATA.IGetActorInfoResData, API_DATA.IGetActorInfoRes, ISelectItem>(getActorInfo, { all: 1 })(['_id', 'key'], ['name', 'title'], (data) => data.list)
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
              fetchData: () => localFetchData4Array<API_DATA.IGetDirectorInfoResData, API_DATA.IGetDirectorInfoRes, ISelectItem>(getDirectorInfo, { all: 1 })(['_id', 'key'], ['name', 'title'], data => data.list)
            }}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormSelect
            request={async () => await localFetchData4Array<API_DATA.IGetClassifyInfoResData, API_DATA.IGetClassifyInfoRes>(getClassifyInfo, { all: 1 })(['_id', 'value'], [ 'name', 'label' ], data => data.list)}
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
            request={() => localFetchData4Array<API_DATA.IGetLanguageInfoResData, API_DATA.IGetLanguageInfoRes>(getLanguageInfo, { all: 1 })(['_id', 'value'], [ 'name', 'label' ], data => data.list)}
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
            request={() => localFetchData4Array<API_DATA.IGetDistrictInfoResData, API_DATA.IGetDistrictInfoRes>(getDistrictInfo, { all: 1 })(['_id', 'value'], ['name', 'label'], data => data.list)}
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
            fieldProps={{
              disabledDate: (currentDate) => {
                return currentDate > moment()
              }
            }}
            rules={[{
              required: true
            }]}
          />
        </ProForm.Group>
        <VideoUpload 
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
            // maxFiles: 6,
            acceptedFileTypes: [ 'image/*' ]
          }}
        />
        <ProFormTextArea 
          name="author_description" 
          label="主观描述" 
          fieldProps={{
            autoSize: true
          }}
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
        <Form.Item
          name="_id" 
        >
          <Input
            type="hidden"
          />
        </Form.Item>
      </ProForm>
    
     </Card>
    </PageContainer>
  )

})

export default CreateForm
