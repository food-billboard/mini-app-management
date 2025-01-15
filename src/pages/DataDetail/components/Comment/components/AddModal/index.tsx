import { ModalForm } from '@/components/ProModal';
import { message } from '@/components/Toast';
import Upload from '@/components/Upload';
import VideoUpload from '@/components/VideoUpload';
import { ProFormTextArea } from '@ant-design/pro-components';
import { Form, Input } from 'antd';
import type { Store } from 'antd/lib/form/interface';
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';

type FormData = Omit<API_DATA.IPostMovieCommentParams, 'source_type'>;

interface IProps {
  onCancel?: () => any;
  onSubmit?: (data: FormData) => any;
}

export interface IFormRef {
  open: (id: string) => void;
}

const CreateForm = forwardRef<IFormRef, IProps>((props, ref) => {
  const [visible, setVisible] = useState<boolean>(false);

  const { onCancel: propsCancel, onSubmit } = props;

  const [formRef] = Form.useForm();

  const open = useCallback(async (id: string) => {
    formRef.setFieldsValue({
      _id: id,
    });
    setVisible(true);
  }, []);

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
      const { image, video, text = '', ...nextProps } = values;
      if (!image.length && !video.length && !text.length) {
        message.info('评论内容不能完全为空，至少填写一项');
        return false;
      }
      const formData = {
        ...nextProps,
        content: {
          image,
          video,
          text,
        },
      };
      await (onSubmit && onSubmit(formData as FormData));
      setVisible(false);
      formRef.resetFields();
      return Promise.resolve();
    },
    [onSubmit],
  );

  useImperativeHandle(ref, () => ({
    open,
  }));

  return (
    <ModalForm
      title="新增评论"
      open={visible}
      // @ts-ignore
      form={formRef}
      onFinish={onFinish}
      onOpenChange={onVisibleChange}
    >
      <ProFormTextArea
        name="text"
        label="文本"
        fieldProps={{
          autoSize: true,
        }}
      />
      <Upload
        wrapper={{
          label: '图片',
          name: 'image',
        }}
        item={{
          acceptedFileTypes: ['image/*'],
          allowMultiple: false,
        }}
      />
      <VideoUpload
        wrapper={{
          label: '视频',
          name: 'video',
        }}
        item={{
          acceptedFileTypes: ['video/*'],
          allowMultiple: false,
        }}
      />
      <Form.Item name="_id">
        <Input type="hidden" />
      </Form.Item>
    </ModalForm>
  );
});

export default CreateForm;
