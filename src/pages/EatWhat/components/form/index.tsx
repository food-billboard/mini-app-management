import { Form, Input } from 'antd';
import type { FormInstance } from 'antd/lib/form';
import {
  ModalForm,
  ProFormTextArea,
  ProFormSelect,
  ProFormDatePicker,
  ProFormDependency,
} from '@ant-design/pro-form';
import moment from 'moment';
import type { Store } from 'antd/lib/form/interface';
import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { getCurrentMenuClassifyList } from '@/services';
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

  const formRef = useRef<FormInstance | null>(null);

  const open = useCallback(
    async (values?: API.GetEatMenuListData) => {
      const isEdit = !!values;

      const show = () => {
        setVisible(true);
      };

      if (isEdit) {
        const {} = values;
        // 获取修改的数据
        formRef.current?.setFieldsValue(values);
        show();
      }

      show();
    },
    [formRef],
  );

  const onCancel = useCallback(() => {
    setVisible(false);
    formRef.current?.resetFields();
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
      formRef.current?.resetFields();
    },
    [onSubmit],
  );

  useImperativeHandle(ref, () => ({
    open,
  }));

  return (
    <ModalForm
      title="新增菜单"
      visible={visible}
      // @ts-ignore
      formRef={formRef}
      onFinish={onFinish}
      onVisibleChange={onVisibleChange}
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
            formRef.current?.setFieldsValue({
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
        initialValue={moment()}
      />
      <Form.Item name="_id">
        <Input type="hidden" />
      </Form.Item>
    </ModalForm>
  );
});

export default CreateForm;
