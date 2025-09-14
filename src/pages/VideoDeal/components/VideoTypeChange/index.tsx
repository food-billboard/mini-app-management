import { message } from '@/components/Toast';
import VideoUpload from '@/components/VideoUpload';
import { changeVideoType } from '@/services';
import { withTry } from '@/utils';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { Form } from 'antd';
import type { Store } from 'antd/lib/form/interface';
import dayjs from 'dayjs'
import { useCallback, useContext, useEffect } from 'react';
import { fileValidator } from '../../../DataEdit/utils';
import { DealContext } from '../../context';

const VideoTypeChange = () => {
  const [formRef] = Form.useForm();

  const { onChange, videoList } = useContext(DealContext);

  const handleAdd = useCallback(async (fields: any) => {

    const { video, type, } = fields;

    const params = {
      _id: video.join(','),
      type,
      page: `视频处理-视频类型转换(${dayjs().format('YYYY-MM-DD')})`
    };

    try {
      const result = await changeVideoType(params);
      return result;
    } catch (error) {
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
            allowMultiple: true,
            expire: true,
          }}
        />
        <ProFormText
          name="type"
          label="视频格式"
          required
          placeholder={"输入要转换的视频格式"}
        />
      </ProForm>
    </div>
  );
};

export default VideoTypeChange;
