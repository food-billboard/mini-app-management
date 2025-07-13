import { message } from '@/components/Toast';
import Upload from '@/components/Upload';
import { PutAdminInfo } from '@/services';
import {
  ProForm,
  ProFormText,
  ProFormTextArea,
  ProFormDatePicker
} from '@ant-design/pro-components';
import { Form } from 'antd';
import dayjs from 'dayjs'
import type { Store } from 'antd/lib/form/interface';
import { merge } from 'lodash';
import { useCallback, useEffect, useRef } from 'react';
import { history, useModel } from 'umi';
import { fileValidator } from '../../DataEdit/utils';
import styles from './BaseView.less';

const BaseView = () => {
  const viewRef = useRef<HTMLDivElement>(null);

  const { initialState } = useModel('@@initialState');
  const { currentUser: userInfo } = initialState || {};

  const [formRef] = Form.useForm();

  const setBaseInfo = useCallback(() => {
    if (userInfo) {
      const { avatar, birthday, ...nextUserInfo } = userInfo;
      formRef.setFieldsValue(
        merge({}, nextUserInfo, {
          birthday: dayjs(birthday),
          avatar: Array.isArray(avatar) ? avatar : [avatar],
        }),
      );
    }
  }, [userInfo, formRef]);

  const handlerSubmit = useCallback(async (values: Store) => {
    const { avatar, ...nextValues } = values;
    await PutAdminInfo(
      merge({}, nextValues, {
        avatar: Array.isArray(avatar) ? avatar[0] : avatar,
      }) as API_ADMIN.IPutAdminInfoParams,
    );
    formRef.resetFields();
    return new Promise<boolean>((resolve) => {
      message.info('操作成功', 1, () => {
        history.replace('/admin');
        resolve(true);
      });
    });
  }, []);

  useEffect(() => {
    setBaseInfo();
  }, []);

  return (
    <div className={styles.baseView} ref={viewRef}>
      <div className={styles.left}>
        <ProForm
          // @ts-ignore
          form={formRef}
          onFinish={handlerSubmit}
        >
          <ProFormText
            label="邮箱"
            name="email"
            rules={[
              {
                required: true,
                message: '请输入邮箱',
              },
              {
                pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
                message: '不正确的邮箱格式',
              },
            ]}
          />
          <ProFormText
            label="用户名"
            name="username"
            rules={[
              {
                required: true,
                message: '请输入用户名',
              },
            ]}
          />
          <ProFormTextArea
            label="描述"
            name="description"
            rules={[
              {
                required: true,
                message: '请输入描述',
              },
            ]}
          />
          <ProFormDatePicker 
            label="出生年月"
            name="birthday"
            rules={[
              {
                required: true,
                message: '请选择出生年月',
              },
            ]}
            fieldProps={{
              format: 'YYYY-MM-DD',
              style: {
                width: '100%'
              },
              disabledDate: date => {
                return dayjs().diff(date) <= 0 
              }
            }}
          />
          <ProFormText
            name="mobile"
            label="手机号"
            rules={[
              {
                required: true,
                message: '请输入手机号',
              },
              {
                pattern: /^1\d{10}$/,
                message: '不正确的手机格式',
              },
            ]}
            fieldProps={{
              type: 'tel',
            }}
          />
          <ProFormText.Password width="md" name="password" label="密码" />
          <Upload
            wrapper={{
              label: '头像',
              name: 'avatar',
              rules: [
                {
                  required: true,
                  validator: fileValidator(1),
                  validateTrigger: 'onBlur',
                },
              ],
            }}
            item={{
              maxFiles: 1,
              acceptedFileTypes: ['image/*'],
              allowMultiple: false,
            }}
          />
        </ProForm>
      </div>
    </div>
  );
};

export default BaseView;
