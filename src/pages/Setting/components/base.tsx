import { Form, message, FormInstance } from 'antd'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import ProForm, { ProFormText, ProFormTextArea } from '@ant-design/pro-form'
import { connect } from 'dva'
import { history } from 'umi'
import { Store } from 'antd/lib/form/interface'
import { merge } from 'lodash'
import PhoneView from './PhoneView'
import Upload from '@/components/Upload'
import { fileValidator } from '../../DataEdit/utils'
import { mapStateToProps, mapDispatchToProps } from '../connect'
import { PutAdminInfo } from '@/services'
import styles from './BaseView.less'

const FormItem = Form.Item;

interface IProps {
  userInfo: API_ADMIN.IGetAdminInfoRes
}

// const AvatarView = ({ avatar }: { avatar: string }) => (
//   <Fragment>
//     <div className={styles.avatar_title}>
//       头像
//     </div>
//     <div className={styles.avatar}>
//       <img src={avatar} alt="avatar" />
//     </div>
//     <Upload showUploadList={false}>
//       <div className={styles.button_view}>
//         <Button>
//           更换头像
//         </Button>
//       </div>
//     </Upload>
//   </Fragment>
// )

const validatorPhone = (_: any, value: any, callback: any) => {
  const values = value.split('-');

  if (!values[0]) {
    callback('Please input your area code!')
  }

  if (!values[1]) {
    callback('Please input your phone number!')
  }

  callback();
}

const BaseView = (props: IProps) => {

  const viewRef = useRef<HTMLDivElement>(null)

  const { userInfo } = useMemo(() => {
    return props
  }, [props])

  const formRef = useRef<FormInstance>(null)

  const setBaseInfo = useCallback(() => {
    if (userInfo) {
      const { avatar, ...nextUserInfo } = userInfo
      formRef.current?.setFieldsValue(merge({}, nextUserInfo, {
        avatar: Array.isArray(avatar) ? avatar : [avatar]
      }))
    }
  }, [userInfo, formRef])

  const handlerSubmit = useCallback(async (values: Store) => {
    const { avatar, ...nextValues } = values
    await PutAdminInfo(merge({}, nextValues, {
      avatar: Array.isArray(avatar) ? avatar[0] : avatar
    }) as API_ADMIN.IPutAdminInfoParams)
    formRef.current?.resetFields()
    return new Promise<boolean>((resolve) => {
      message.info("操作成功", 1, () => {
        history.replace('/admin')
        resolve(true)
      })
    })
  }, [])

  useEffect(() => {
    setBaseInfo()
  }, [])

  return (
    <div className={styles.baseView} ref={viewRef}>
      <div className={styles.left}>
        <ProForm
          //@ts-ignore
          formRef={formRef}
          onFinish={handlerSubmit}
        >
          <ProFormText 
            label="邮箱" 
            name="email"
            rules={[
              {
                required: true,
                message: "请输入邮箱",
              },
            ]}
          />
          <ProFormText 
            label="用户名" 
            name="username"
            rules={[
              {
                required: true,
                message: "请输入用户名",
              },
            ]}
          />
          <ProFormTextArea 
            label="描述" 
            name="description"
            rules={[
              {
                required: true,
                message: "请输入描述",
              },
            ]}
          />
          <ProFormText
            name="mobile"
            label="手机号"
            rules={[
              {
                required: true,
                message: "请输入手机号",
              },
              // {
              //   validator: validatorPhone,
              // },
            ]}
            fieldProps={{
              type:"tel"
            }}
          />
          <ProFormText.Password 
            width="md" 
            name="password" 
            label="密码" 
          />
          <Upload 
            wrapper={{
              label: '头像',
              name: 'avatar',
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
        </ProForm>
      </div>
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(BaseView)
