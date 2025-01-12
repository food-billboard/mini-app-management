import { Form, Input } from 'antd';
import type { FormInstance } from 'antd/lib/form';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import type { Store } from 'antd/lib/form/interface';
import React, { Component, createRef } from 'react';

export type FormData = API_RASPBERRY.GetListData;

interface IProps {
  onCancel?: () => any;
  onSubmit?: (data: FormData) => Promise<boolean>;
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

  public open = async (data?: API_RASPBERRY.GetListData) => {
    const isEdit = !!data;

    if (data) {
      // 获取修改的数据
      this.formRef.current?.setFieldsValue(data);
    }

    this.setState({
      visible: true,
      loading: isEdit,
      editable: isEdit,
    });

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
        title="仓库编辑"
        open={visible}
        // @ts-ignore
        formRef={this.formRef as any}
        onFinish={async (values: Store) => {
          const result = await this.props.onSubmit?.(values as FormData);
          if (!result) return false;
          this.setState({ visible: false });
          this.formRef.current?.resetFields();
          return true;
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
          name="name"
          label="仓库名称"
          placeholder={'请输入仓库名称'}
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
        <ProFormText
          name="url"
          label="github地址"
          placeholder={'请输入github地址'}
          rules={[
            {
              required: true,
            },
          ]}
        />
        <ProFormText
          name="folder"
          label="本地路径"
          placeholder={'请输入本地路径'}
          rules={[
            {
              required: true,
            },
          ]}
        />
        <Form.Item name="_id">
          <Input type="hidden" />
        </Form.Item>
      </ModalForm>
    );
  };
}

export default CreateForm;
