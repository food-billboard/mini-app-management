import { ModalForm } from '@/components/ProModal';
import SearchForm from '@/components/TransferSelect';
import { getMemberList } from '@/services';
import { ProForm } from '@ant-design/pro-components';
import { Form, Input } from 'antd';
import type { Store } from 'antd/lib/form/interface';
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';

type FormData = API_CHAT.IPostMemberParams;

interface IProps {
  onCancel?: () => any;
  onSubmit?: (data: FormData) => any;
}

export interface IFormRef {
  open: (value: string) => void;
}

const CreateForm = forwardRef<IFormRef, IProps>((props, ref) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [memberList, setMemberList] = useState<
    { key: string; title: string }[]
  >([]);

  const { onCancel: propsCancel, onSubmit } = useMemo(() => {
    return props;
  }, [props]);

  const [formRef] = Form.useForm();

  const open = useCallback(
    async (value: string) => {
      setVisible(true);
      formRef.setFieldsValue({
        room: value,
      });
      const data = await getMemberList({
        room: value,
        currPage: 0,
        pageSize: 999999,
      });
      setMemberList(
        data.list.map((item: any) => ({
          key: item['_id'],
          title: item.user?.username,
        })),
      );
    },
    [formRef],
  );

  const onCancel = useCallback(() => {
    setVisible(false);
    formRef.resetFields();
    propsCancel?.();
  }, [formRef]);

  const onVisibleChange = useCallback(
    (nowVisible: boolean) => {
      if (!nowVisible) onCancel();
      if (nowVisible !== visible) setVisible(nowVisible);
    },
    [onCancel, visible],
  );

  const onFinish = useCallback(
    async (values: Store) => {
      const { _id, ...nextValues } = values;
      await (onSubmit &&
        onSubmit({
          ...nextValues,
          _id: _id.join(','),
        } as FormData));
      setVisible(false);
      formRef.resetFields();
    },
    [onSubmit],
  );

  useImperativeHandle(ref, () => ({
    open,
  }));

  const fetchMemberList = useCallback(async () => {
    const params: API_CHAT.IGetMemberListParams = {
      currPage: 0,
      pageSize: 99999,
    };
    try {
      const data = await getMemberList(params);
      return data.list.map((item: any) => {
        const { _id } = item;
        const disabled = memberList?.some((member) => member.key === _id);
        return {
          key: _id,
          title: item.user?.username,
          disabled,
        };
      });
    } catch (er) {
      return [];
    }
  }, [memberList]);

  return (
    <ModalForm
      title="新增成员"
      open={visible}
      // @ts-ignore
      form={formRef}
      onFinish={onFinish}
      onOpenChange={onVisibleChange}
    >
      <ProForm.Group>
        <SearchForm
          wrapper={{
            label: `新增成员`,
            name: '_id',
            rules: [
              {
                required: true,
                message: '请选择成员',
              },
            ],
          }}
          item={{
            fetchData: fetchMemberList,
          }}
        />
      </ProForm.Group>
      <Form.Item name="room">
        <Input type="hidden" />
      </Form.Item>
    </ModalForm>
  );
});

export default CreateForm;
