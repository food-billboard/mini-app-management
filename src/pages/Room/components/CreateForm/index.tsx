import { ModalForm } from '@/components/ProModal';
import SearchForm from '@/components/TransferSelect';
import Upload from '@/components/Upload';
import { getMemberList } from '@/services';
import { ProForm, ProFormTextArea } from '@ant-design/pro-components';
import { Form, Input } from 'antd';
import type { Store } from 'antd/lib/form/interface';
import { omit } from 'lodash';
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { fileValidator } from '../../../DataEdit/utils';

type FormData = API_CHAT.IPutRoomParams;

interface IProps {
  onCancel?: () => any;
  onSubmit?: (data: FormData) => any;
}

export interface IFormRef {
  open: (values?: API_CHAT.IGetRoomListResData) => void;
}

const POST_REQUIRED_MAP = {
  name: {
    required: true,
    message: '请输入聊天室名称',
  },
  avatar: {
    required: true,
    message: '请选择聊天室海报',
    validator: fileValidator(1),
    validateTrigger: 'onBlur',
  },
};

const PUT_REQUIRED_MAP = {
  _id: {
    required: true,
    message: '请选择id',
  },
};

const CreateForm = forwardRef<IFormRef, IProps>((props, ref) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [isPut, setIsPut] = useState<boolean>(false);

  const { onCancel: propsCancel, onSubmit } = useMemo(() => {
    return props;
  }, [props]);

  const [formRef] = Form.useForm();

  const requiredMap: any = useMemo(() => {
    return isPut ? PUT_REQUIRED_MAP : POST_REQUIRED_MAP;
  }, [isPut]);

  const fetchMemberList = useCallback(
    async (
      nextParams: Partial<API_CHAT.IGetMemberListParams> & {
        update?: boolean;
      } = {},
    ) => {
      const params: API_CHAT.IGetMemberListParams = {
        currPage: 0,
        pageSize: 99999,
        ...omit(nextParams, ['update']),
      };
      if (isPut || !!nextParams.update)
        params.room = nextParams.room || formRef.getFieldValue('_id');
      try {
        const data = await getMemberList(params);
        return data.list.map((item: any) => ({
          key: item['_id'],
          title: item.user?.username,
        }));
      } catch (er) {
        return [];
      }
    },
    [isPut],
  );

  const open = useCallback(
    async (values?: API_CHAT.IGetRoomListResData) => {
      setIsPut(!!values);
      setVisible(true);
      if (!values) return;

      const {
        info: { avatar, name, description },
        _id,
      } = values || {};
      const data = await fetchMemberList({ room: _id, update: true });
      formRef.setFieldsValue({
        avatar: Array.isArray(avatar) ? avatar : [avatar],
        name,
        description,
        _id,
        members: data.map((item: any) => item.key),
      });
    },
    [fetchMemberList],
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
      const { members, avatar, ...nextValues } = values;
      await onSubmit?.({
        ...nextValues,
        avatar: Array.isArray(avatar) ? avatar[0] : avatar,
        members: members.join(','),
      } as FormData);
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
      title="新建聊天室"
      open={visible}
      // @ts-ignore
      form={formRef}
      onFinish={onFinish}
      onOpenChange={onVisibleChange}
    >
      <ProFormTextArea
        name="name"
        label="名称"
        fieldProps={{
          autoSize: true,
        }}
        rules={requiredMap?.name ? [requiredMap?.name] : []}
      />
      <Upload
        wrapper={{
          label: '海报',
          name: 'avatar',
          rules: requiredMap?.avatar ? [requiredMap?.avatar] : [],
        }}
        item={{
          maxFiles: 1,
          acceptedFileTypes: ['image/*'],
          allowMultiple: false,
        }}
      />
      <ProForm.Group>
        <SearchForm
          wrapper={{
            label: `成员编辑(修改时为删除)`,
            name: 'members',
            rules: requiredMap?.members ? [requiredMap?.members] : [],
          }}
          item={{
            fetchData: fetchMemberList,
          }}
        />
      </ProForm.Group>
      <ProFormTextArea
        name="description"
        label="描述"
        fieldProps={{
          autoSize: true,
        }}
        rules={requiredMap?.description ? [requiredMap?.description] : []}
      />
      <Form.Item name="_id">
        <Input type="hidden" />
      </Form.Item>
    </ModalForm>
  );
});

export default CreateForm;
