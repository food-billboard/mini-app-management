import { message } from '@/components/Toast';
import VideoUpload from '@/components/VideoUpload';
import { withTry } from '@/utils';
import { ProForm } from '@ant-design/pro-components';
import { corpVideoChunk } from '@/services'
import { Form } from 'antd';
import type { Store } from 'antd/lib/form/interface';
import { useCallback, useRef } from 'react';
import TimePicker from './components/TimePicker'
import VideoListModal, { VideoListModalRef } from '../VideoListModal';
import { fileValidator } from '../../../DataEdit/utils';

const VideoMerge = () => {
  const [formRef] = Form.useForm();

  const videoListModalRef = useRef<VideoListModalRef>(null)

  const handleAdd = useCallback(async (fields: any) => {
    const hide = message.loading('正在添加');

    const {
      video,
      time
    } = fields;

    const params = {
      time: time.filter((item: any) => !!item.length).map((item: any) => {
        return item.map((data: any) => data.format('HH:mm:ss'))
      }),
      _id: video[0]
    };

    try {
      const result = await corpVideoChunk(params);
      hide();
      message.success('操作成功');
      return result;
    } catch (error) {
      hide();
      message.error('操作失败请重试！');
      return false;
    }
  }, []);

  const onFinish = useCallback(
    async (values: Store) => {
      const [, success] = await withTry(handleAdd)(values);
      if (success) {
        formRef.resetFields();
        videoListModalRef.current?.open(success)
      }
    },
    [handleAdd],
  );

  return (
    <div>
      <ProForm
        form={formRef}
        onFinish={onFinish}
      >
        <VideoUpload
          wrapper={{
            label: '视频',
            name: 'video',
            rules: [
              {
                required: true,
                validator: fileValidator(1),
                validateTrigger: 'onBlur',
              },
            ],
            initialValue: ['67ad9aad0c16e2bc6be07e23']
          }}
          item={{
            maxFiles: 1,
            acceptedFileTypes: ['video/*'],
            allowMultiple: false,
          }}
        />
        <ProForm.Item 
          name="time" 
          label="时间轴"
          rules={[
            {
              required: true,
              validator: (_, value) => {
                if(!value.length) {
                  return Promise.reject('请增加裁剪时间范围')
                }
                return Promise.resolve()
              }
            }
          ]}
        >
          <TimePicker />
        </ProForm.Item>
      </ProForm>
      <VideoListModal ref={videoListModalRef} />
    </div>
  );
};

export default VideoMerge;
