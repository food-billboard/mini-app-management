import { Form, Input } from 'antd';
import type { FormInstance } from 'antd/lib/form';
import { ProFormText, ProFormSelect, ProFormTextArea } from '@ant-design/pro-components';
import type { Store } from 'antd/lib/form/interface';
import React, { Component, createRef } from 'react';
import { ModalForm } from '@/components/ProModal'
import { message } from '@/components/Toast';
import Upload from '@/components/Upload';
import { getUserDetail } from '@/services';
import { fileValidator } from '../../../DataEdit/utils';
import { ROLES_MAP } from '@/utils';

export type FormData = API_DATA.IPutMovieParams | API_DATA.IPostMovieParams;

const ROLES_MAP_ENUM = Object.keys(ROLES_MAP).map((item) => ({
  value: item,
  label: (ROLES_MAP as any)[item],
}));

interface IProps {
  onCancel?: () => any;
  onSubmit?: (data: FormData) => Promise<any> | any;
}

interface IState {
  visible: boolean;
  loading: boolean;
  editable: boolean;
}

class CreateForm extends Component<IProps, IState> {
  public state: IState = {
    visible: false,
    loading: false,
    editable: false,
  };

  private formRef = createRef<FormInstance>();

  public open = async (id?: string) => {
    const isEdit = !!id;

    const show = () => {
      this.setState({
        visible: true,
        loading: isEdit,
        editable: isEdit,
      });
    };

    if (id) {
      // 获取修改的数据
      return await getUserDetail({
        _id: id,
      })
        .then((data: API_USER.IGetUserDetailRes) => {
          const { avatar } = data;
          this.formRef.current?.setFieldsValue({
            ...data,
            poster: Array.isArray(avatar) ? avatar : [avatar],
            _id: id,
          });
          show();
        })
        .catch(() => {
          message.info('数据获取错误，请重试');
        });
    }

    show();

    return Promise.resolve();
  };

  private onCancel = () => {
    this.setState({ visible: false });
    this.formRef.current?.resetFields();
    this.props.onCancel?.();
  };

  public render = () => {
    const { visible } = this.state;

    return (
      <ModalForm
        title="新建表单"
        open={visible}
        // @ts-ignore
        formRef={this.formRef as any}
        onFinish={async (values: Store) => {
          await this.props.onSubmit?.(values as FormData);
          this.setState({ visible: false });
          this.formRef.current?.resetFields();
        }}
        onOpenChange={(visibleState: boolean) => {
          if (!visibleState) this.onCancel();
          this.setState((prev) => {
            if (prev.visible === visibleState) return null;
            return { visible: visibleState };
          });
        }}
      >
        <ProFormText
          name="mobile"
          label="手机号"
          placeholder={'请输入手机号'}
          rules={[
            {
              required: true,
            },
            {
              pattern: /^1\d{10}$/,
              message: '不正确的手机格式',
            },
          ]}
        />
        <ProFormText.Password name="password" label="密码" placeholder={'请输入密码'} />
        <ProFormText
          name="email"
          label="邮箱"
          placeholder={'请输入邮箱'}
          rules={[
            {
              required: true,
            },
            {
              pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
              message: '不正确的邮箱格式',
            },
          ]}
        />
        <ProFormText
          name="username"
          label="用户名"
          placeholder={'请输入用户名'}
          rules={[
            {
              required: true,
            },
          ]}
        />
        <ProFormTextArea
          name="description"
          label="描述"
          fieldProps={{
            autoSize: true,
          }}
          rules={[
            {
              required: true,
            },
          ]}
        />
        <ProFormSelect
          options={ROLES_MAP_ENUM}
          name="roles"
          label="权限"
          hasFeedback
          placeholder="请选择权限"
          showSearch
          mode="multiple"
          rules={[
            {
              required: true,
            },
          ]}
        />
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
        <Form.Item name="_id">
          <Input type="hidden" />
        </Form.Item>
      </ModalForm>
    );
  };
}

export default CreateForm;
