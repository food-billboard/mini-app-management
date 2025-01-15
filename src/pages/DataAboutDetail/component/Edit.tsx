import { ModalForm } from '@/components/ProModal';
import { message } from '@/components/Toast';
import { Form } from 'antd';
import type { FormInstance } from 'antd/es/form';
import type { ModalProps } from 'antd/es/modal';
import type { Store } from 'antd/lib/form/interface';
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { unstable_batchedUpdates } from 'react-dom';

interface IProps extends ModalProps {
  onConfirm?: (values: Store) => Promise<any>;
  renderForm: (form: FormInstance) => React.ReactNode;
  fetchData?: (...args: any[]) => Promise<any>;
}

export interface IEditRef {
  open: (values?: { id?: string }) => void;
}

const EditModal = forwardRef<IEditRef, IProps>((props, ref) => {
  const { renderForm, onConfirm, fetchData, ...nextProps } = props;

  const [visible, setVisible] = useState<boolean>(false);
  const [id, setId] = useState<string | boolean>();

  const [formRef] = Form.useForm();

  useImperativeHandle(ref, () => ({
    open: (
      values: {
        id?: string;
      } = {},
    ) => {
      const { id: dataId } = values;
      unstable_batchedUpdates(() => {
        setVisible(true);
        setId(dataId);
      });
    },
  }));

  const internalFetchData = useCallback(async () => {
    if (!id) return;
    if (fetchData) {
      const data = await fetchData({
        _id: id,
      });
      let form;
      if (Array.isArray(data)) {
        [form] = data;
      } else {
        form = data;
      }
      formRef.setFieldsValue(form);
    }
  }, [id]);

  const onFinish = useCallback(
    async (values: Store) => {
      await onConfirm?.(values);
      message.success('提交成功');
      formRef.resetFields();
      setVisible(false);
    },
    [id],
  );

  const onCancel = useCallback(
    (e: any) => {
      setVisible(false);
      nextProps.onCancel?.(e);
    },
    [nextProps],
  );

  const visibleChange = useCallback(
    (visibleState: boolean) => {
      if (!visibleState) {
        onCancel(null);
        setId(false);
        formRef.resetFields();
      }
    },
    [onCancel, formRef],
  );

  useEffect(() => {
    if (!id) return;
    if (visible) internalFetchData();
  }, [id, visible]);

  return (
    <ModalForm
      title={`${id ? '编辑' : '新增'}信息`}
      open={visible}
      // @ts-ignore
      form={formRef}
      onFinish={onFinish}
      onOpenChange={visibleChange}
      modalProps={{
        ...nextProps,
        onCancel,
      }}
    >
      {renderForm(formRef)}
    </ModalForm>
  );
});

export const Edit = memo(EditModal);
