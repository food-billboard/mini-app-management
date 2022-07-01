import { message, Input, Form } from 'antd';
import type { FormInstance } from 'antd/lib/form';
import { ModalForm, ProFormTextArea } from '@ant-design/pro-form';
import type { Store } from 'antd/lib/form/interface';
import React, { useCallback, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import Upload from '@/components/Upload';
import VideoUpload from '@/components/VideoUpload'

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

  const formRef = useRef<FormInstance | null>(null);

  const open = useCallback(async (id: string) => {
    formRef.current?.setFieldsValue({
      _id: id,
    });
    setVisible(true);
  }, []);

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
      const { image, video, text="", ...nextProps } = values;
      if (!image.length && !video.length && !text.length) {
        message.info('评论内容不能完全为空，至少填写一项');
        return false 
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
      formRef.current?.resetFields();
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
      visible={visible}
      // @ts-ignore
      formRef={formRef}
      onFinish={onFinish}
      onVisibleChange={onVisibleChange}
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
      <Form.Item
        name="_id" 
      >
        <Input
          type="hidden"
        />
      </Form.Item>
    </ModalForm>
  );
});

export default CreateForm;
