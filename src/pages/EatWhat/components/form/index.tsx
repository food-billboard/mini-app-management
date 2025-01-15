import { ModalForm } from '@/components/ProModal';
import { getCurrentMenuClassifyList } from '@/services';
import { sleep } from '@/utils';
import {
  ProFormDatePicker,
  ProFormDependency,
  ProFormSelect,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Form, Input } from 'antd';
import type { Store } from 'antd/lib/form/interface';
import dayjs from 'dayjs';
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { MENU_MAP } from '../../columns';

type FormData = API.PutEatMenuData | API.PostEatMenuData;

interface IProps {
  onCancel?: () => any;
  onSubmit?: (data: FormData) => any;
}

export interface IFormRef {
  open: (values?: API.GetEatMenuListData) => void;
}

const CreateForm = forwardRef<IFormRef, IProps>((props, ref) => {
  const [visible, setVisible] = useState<boolean>(false);

  const { onCancel: propsCancel, onSubmit } = useMemo(() => {
    return props;
  }, [props]);

  const [formRef] = Form.useForm();

  const open = useCallback(
    async (values?: API.GetEatMenuListData) => {
      const isEdit = !!values;

      const show = () => {
        setVisible(true);
      };

      if (isEdit) {
        // 获取修改的数据
        show();
        formRef.setFieldsValue(values)
      }

      show();
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
      await onSubmit?.(values as FormData);
      setVisible(false);
      formRef.resetFields();
    },
    [onSubmit],
  );

  useImperativeHandle(ref, () => ({
    open,
  }));

  return (
    <ModalForm
      title="新增菜单"
      open={visible}
      // @ts-ignore
      form={formRef}
      onFinish={onFinish}
      onOpenChange={onVisibleChange}
      modalProps={{
        destroyOnClose: true,
      }}
    >
      <ProFormSelect
        name="menu_type"
        label="餐别类型"
        options={MENU_MAP}
        initialValue={'BREAKFAST'}
        fieldProps={{
          onChange: () => {
            formRef.setFieldsValue({
              classify: undefined,
            });
          },
        }}
      />
      <ProFormDependency name={['menu_type']}>
        {({ menu_type = '' }) => {
          return (
            <ProFormSelect
              showSearch
              params={{ menu_type }}
              rules={[{ required: true }]}
              placeholder={'输入关键字查询'}
              request={async (params) => {
                const { keyWords } = params;
                return getCurrentMenuClassifyList({
                  currPage: 0,
                  pageSize: keyWords ? 999 : 50,
                  content: keyWords || '',
                  menu_type,
                }).then((data) => {
                  return data.list.map((item: any) => {
                    return {
                      label: item.title,
                      value: item._id,
                    };
                  });
                });
              }}
              name="classify"
              label="菜单分类"
            />
          );
        }}
      </ProFormDependency>
      <ProFormTextArea
        name="description"
        placeholder="请输入描述信息"
        label="描述信息"
        fieldProps={{
          autoSize: true,
        }}
      />
      <ProFormDatePicker
        placeholder={'请选择时间'}
        name="date"
        label="时间"
        initialValue={dayjs()}
      />
      <Form.Item name="_id">
        <Input type="hidden" />
      </Form.Item>
    </ModalForm>
  );
});

export default CreateForm;
