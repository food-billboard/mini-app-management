import { message } from '@/components/Toast';
import VideoUpload from '@/components/VideoUpload';
import { corpVideoChunk } from '@/services';
import { withTry } from '@/utils';
import { ProForm } from '@ant-design/pro-components';
import { Form } from 'antd';
import type { Store } from 'antd/lib/form/interface';
import dayjs from 'dayjs'
import { useCallback, useContext, useEffect } from 'react';
import { fileValidator } from '../../../DataEdit/utils';
import { DealContext } from '../../context';
import TimePicker from './components/TimePicker';

const VideoMerge = () => {
  const [formRef] = Form.useForm();

  const { onChange, videoList } = useContext(DealContext);

  const handleAdd = useCallback(async (fields: any) => {
    const hide = message.loading('正在添加');

    const { video, time } = fields;

    const params = {
      time: time
        .filter((item: any) => !!item.length)
        .map((item: any) => {
          return item.map((data: any) => data.format('HH:mm:ss'));
        }),
      _id: video[0],
      page: `视频处理-视频裁剪(${dayjs().format('YYYY-MM-DD')})`
    };

    try {
      const result = await corpVideoChunk(params);
      hide();
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
        message.info('任务执行中，可稍后查看结果')
      }
    },
    [handleAdd],
  );

  useEffect(() => {
    formRef.setFieldsValue({
      video: videoList || [],
    });
  }, []);

  return (
    <div>
      <ProForm form={formRef} onFinish={onFinish}>
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
            initialValue: [],
          }}
          item={{
            maxFileSize: '10240MB',
            maxFiles: 1,
            acceptedFileTypes: ['video/*'],
            allowMultiple: false,
            expire: true,
          }}
        />
        <ProForm.Item
          name="time"
          label="时间轴"
          rules={[
            {
              required: true,
              validator: (_, value) => {
                if (!value.length) {
                  return Promise.reject('请增加裁剪时间范围');
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <TimePicker />
        </ProForm.Item>
      </ProForm>
    </div>
  );
};

export default VideoMerge;
