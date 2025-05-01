import { ModalForm } from '@/components/ProModal';
import { ProFormTextArea } from '@ant-design/pro-components';
import { Button, Form, Input } from 'antd';
import type { ButtonProps } from 'antd'
import type { Store } from 'antd/lib/form/interface';
import { ReactNode, useCallback, useState } from 'react';

type FormData = API_SCORE.PutScoreClassifyParams | API_SCORE.PostScoreClassifyParams;

type IProps = {
  onCancel?: () => any;
  onSubmit?: (data: FormData) => any;
  children?: ReactNode;
  value?: API_SCORE.GetScoreClassifyListData;
  extraButtonProps?: ButtonProps
};

const CreateForm = (props: IProps) => {
  const [visible, setVisible] = useState<boolean>(false);

  const { onCancel: propsCancel, onSubmit, children, value, extraButtonProps } = props;

  const [formRef] = Form.useForm();

  const open = useCallback(async () => {
    const isEdit = !!value;

    const show = () => {
      setVisible(true);
    };

    show();

    if (isEdit) {
      formRef.setFieldsValue(value);
    }
  }, [value]);

  const onCancel = useCallback(() => {
    setVisible(false);
    formRef.resetFields();
    propsCancel?.();
  }, [propsCancel]);

  const onVisibleChange = useCallback(
    (nowVisible: boolean) => {
      if (!nowVisible) onCancel();
      if (nowVisible !== visible) setVisible(nowVisible);
    },
    [onCancel, visible],
  );

  const onFinish = useCallback(
    async (values: Store) => {
      await onSubmit?.(values as FormData)
        .then(() => {
          setVisible(false);
          formRef.resetFields();
        })
        .catch(() => {});
    },
    [onSubmit],
  );

  return (
    <>
      <Button onClick={open} {...extraButtonProps}>
        {children}
      </Button>
      <ModalForm
        title={`${value ? '编辑' : '新增'}原因分类`}
        open={visible}
        // @ts-ignore
        form={formRef}
        onFinish={onFinish}
        onOpenChange={onVisibleChange}
      >
        <ProFormTextArea
          required
          name="content"
          placeholder="请输入内容"
          label="内容"
          fieldProps={{
            autoSize: true,
          }}
        />
        <ProFormTextArea
          name="description"
          placeholder="请输入描述信息"
          label="描述信息"
          fieldProps={{
            autoSize: true,
          }}
        />
        <Form.Item name="_id">
          <Input type="hidden" />
        </Form.Item>
      </ModalForm>
    </>
  );
};

export default CreateForm;
