import { ModalForm } from '@/components/ProModal';
import RichTextEditor from '@/components/RichTextEditor';
import { ProFormSelect, ProFormTextArea } from '@ant-design/pro-components';
import { Form, Input } from 'antd';
import type { Store } from 'antd/lib/form/interface';
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { FOOD_MAP, MENU_MAP } from '../../columns';

type FormData = API.PutEatMenuClassifyData | API.PostEatMenuClassifyData;

interface IProps {
  onCancel?: () => any;
  onSubmit?: (data: FormData) => any;
}

export interface IFormRef {
  open: (values?: API.GetEatMenuClassifyListData) => void;
}

const CreateForm = forwardRef<IFormRef, IProps>((props, ref) => {
  const [visible, setVisible] = useState<boolean>(false);

  const { onCancel: propsCancel, onSubmit } = useMemo(() => {
    return props;
  }, [props]);

  const [formRef] = Form.useForm();

  const open = useCallback(
    async (values?: API.GetEatMenuClassifyListData) => {
      const isEdit = !!values;

      const show = () => {
        setVisible(true);
      };

      show();

      if (isEdit) {
        const { food_type } = values!;
        // 获取修改的数据
        formRef.setFieldsValue({
          ...values,
          food_type: food_type?.[0] || 'OTHER',
        });
      }
    },
    [formRef],
  );

  const onCancel = useCallback(() => {
    setVisible(false);
    formRef.resetFields();
    propsCancel?.();
  }, [formRef, propsCancel]);

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

  useImperativeHandle(ref, () => ({
    open,
  }));

  return (
    <ModalForm
      title="新增菜单分类"
      open={visible}
      // @ts-ignore
      form={formRef}
      onFinish={onFinish}
      onOpenChange={onVisibleChange}
      modalProps={{
        styles: {
          body: {
            height: 500,
            overflowY: 'auto',
          },
        },
      }}
    >
      <ProFormTextArea
        name="title"
        label="标题"
        rules={[
          {
            required: true,
            message: '请输入标题',
          },
        ]}
        placeholder="请输入标题"
        fieldProps={{
          autoSize: true,
        }}
      />
      <ProFormSelect
        mode="multiple"
        placeholder={'请选择餐别类型'}
        options={MENU_MAP}
        name="menu_type"
        label="餐别类型"
        initialValue={['BREAKFAST']}
      />
      <ProFormSelect
        placeholder={'请选择菜单类型'}
        options={FOOD_MAP}
        name="food_type"
        label="菜单类型"
        initialValue={['OTHER']}
      />
      <Form.Item name="content" label="内容">
        <RichTextEditor />
      </Form.Item>
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
  );
});

export default CreateForm;
