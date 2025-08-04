import { ModalForm } from '@/components/ProModal';
import { ProFormSelect } from '@ant-design/pro-components';
import type { FormInstance } from 'antd/lib/form';
import type { Store } from 'antd/lib/form/interface';
import { Component, createRef } from 'react';
import { getUserList } from '@/services'

interface IProps {
  onCancel?: () => any;
  onSubmit?: (data: FormData) => Promise<any> | any;
}

interface IState {
  visible: boolean;
}

class CreateForm extends Component<IProps, IState> {
  public state: IState = {
    visible: false,
  };

  private formRef = createRef<FormInstance>();

  public open = async () => {
    this.setState({
      visible: true,
    });
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
        title="新增人员"
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
        <ProFormSelect
          name="_id"
          label="用户"
          hasFeedback
          placeholder="请选择用户"
          showSearch
          fieldProps={{
            filterOption: false 
          }}
          request={async ({ keyWords }: any) => {
            if(!keyWords) return []
            return getUserList({ 
              content: keyWords,
              currPage: 0,
              pageSize: 999
            })
            .then(data => {
              return data.list.map((item: any) => {
                return{
                  label: item.username,
                  value: item._id
                }
              })
            })
          }}
          rules={[
            {
              required: true,
            },
          ]}
        />
      </ModalForm>
    );
  };
}

export default CreateForm;
