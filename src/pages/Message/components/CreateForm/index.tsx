import { Form, Input, Select } from 'antd';
import type { FormInstance } from 'antd/lib/form';
import { ProFormSelect } from '@ant-design/pro-components';
import { pick } from 'lodash';
import type { Store } from 'antd/lib/form/interface';
import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { ModalForm } from '@/components/ProModal'
import ImageContent from '../Image';
import VideoContent from '../Video';
import TextContent from '../Text';
import { getMemberList } from '@/services';
import { fileValidator } from '../../../DataEdit/utils';

type FormData = API_CHAT.IPostMessageParams;

interface IProps {
  onCancel?: () => any;
  onSubmit?: (data: FormData) => any;
}

export interface IFormRef {
  open: (value: string) => void;
}

const CreateForm = forwardRef<IFormRef, IProps>((props, ref) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [memberList, setMemberList] = useState<any>([]);

  const { onCancel: propsCancel, onSubmit } = useMemo(() => {
    return props;
  }, [props]);

  const formRef = useRef<FormInstance | null>(null);

  const { getFieldValue } = useMemo(() => {
    return formRef.current! || {};
  }, [formRef]);

  const fetchMemberList = useCallback(
    async (nextParams: Partial<API_CHAT.IGetMemberListParams> = {}) => {
      const fetchParams: API_CHAT.IGetMemberListParams = {
        currPage: 0,
        pageSize: 99999,
        ...nextParams,
      };
      try {
        const data = await getMemberList(fetchParams);
        return data.list.map((item: any) => ({ value: item._id, label: item.user?.username }));
      } catch (er) {
        return [];
      }
    },
    [],
  );

  const open = useCallback(
    async (value: string) => {
      formRef.current?.setFieldsValue({
        _id: value,
      });
      const data = await fetchMemberList({
        room: value,
      });
      setMemberList(data);
      setVisible(true);
    },
    [formRef],
  );

  const onCancel = useCallback(() => {
    setVisible(false);
    formRef.current?.resetFields();
    if (propsCancel) propsCancel();
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
      const { media_type, ...nextValues } = values;
      const contentData: any = pick(values, ['video', 'image', 'audio', 'text']);
      const content = contentData[media_type.toLowerCase()];
      await (onSubmit &&
        onSubmit({
          ...nextValues,
          media_type,
          content: Array.isArray(content) ? content[0] : content,
        } as FormData));
      setVisible(false);
      formRef.current?.resetFields();
    },
    [onSubmit],
  );

  useImperativeHandle(ref, () => ({
    open,
  }));

  const validator = useCallback(
    async (type: string, callback: any, errMsg: string, ...args: any[]) => {
      try {
        const currentType = formRef.current?.getFieldValue?.('media_type');
        if (currentType === type) {
          return callback(...args);
        }
        return Promise.resolve();
      } catch (err) {
        return Promise.reject(errMsg);
      }
    },
    [getFieldValue],
  );

  return (
    <ModalForm
      title="新增消息"
      open={visible}
      //@ts-ignore
      formRef={formRef}
      onFinish={onFinish}
      onOpenChange={onVisibleChange}
    >
      <ProFormSelect
        name="media_type"
        label="媒体类型"
        valueEnum={{
          VIDEO: '视频',
          // AUDIO: '音频',
          TEXT: '文本',
          IMAGE: '图片',
        }}
        rules={[
          {
            required: true,
            message: '请选择媒体类型',
          },
        ]}
      />
      <TextContent
        rules={[
          {
            // required: getFieldValue?.('media_type') === 'TEXT',
            message: '请输入文本消息内容',
            validator: validator.bind(
              null,
              'TEXT',
              (_: any, value: string) => {
                return !!value ? Promise.resolve() : Promise.reject('');
              },
              '请输入文本消息内容',
            ),
          },
        ]}
      />
      <VideoContent
        rules={[
          {
            required: getFieldValue?.('media_type') === 'VIDEO',
            message: '请选择视频消息内容',
            validator: validator.bind(null, 'VIDEO', fileValidator(1), '请选择视频消息内容'),
            validateTrigger: 'onBlur',
          },
        ]}
      />
      <ImageContent
        rules={[
          {
            required: getFieldValue?.('media_type') === 'IMAGE',
            message: '请选择图片消息内容',
            validator: validator.bind(null, 'IMAGE', fileValidator(1), '请选择图片消息内容'),
            validateTrigger: 'onBlur',
          },
        ]}
      />
      {/* <AudioContent 
        rules={[
          {
            required: getFieldValue?.('media_type') === 'AUDIO',
            message: "请选择音频消息内容",
          }
        ]}
      /> */}
      <Form.Item name="point_to" label="特指">
        <Select options={memberList} placeholder="请选择特指的成员" allowClear />
      </Form.Item>
      <Form.Item name="_id">
        <Input type="hidden" />
      </Form.Item>
    </ModalForm>
  );
});

export default CreateForm;
