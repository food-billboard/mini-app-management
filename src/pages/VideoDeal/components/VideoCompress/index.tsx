import { message, modal } from '@/components/Toast';
import VideoUpload from '@/components/VideoUpload';
import { withTry } from '@/utils';
import { ProForm } from '@ant-design/pro-components';
import { Form } from 'antd';
import type { Store } from 'antd/lib/form/interface';
import { saveAs } from 'file-saver';
import { useCallback } from 'react';
import { videoCompress } from '@/services'
import { fileValidator } from '../../../DataEdit/utils';
import dayjs from 'dayjs'

const VideoMerge = () => {
  const [formRef] = Form.useForm();

  const handleAdd = useCallback(async (fields: any) => {
    const hide = message.loading('正在添加');

    const {
      video,
    } = fields;

    const params = {
      _id: video.join(','),
      page: `视频处理-视频压缩(${dayjs().format('YYYY-MM-DD')})`,
    };

    try {
      const result = await videoCompress(params);
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
          }}
          item={{
            maxFileSize: '10240MB',
            allowMultiple: true,
            expire: true,
          }}
        />
      </ProForm>
    </div>
  );
};

export default VideoMerge;
