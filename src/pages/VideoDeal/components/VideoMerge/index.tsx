import { message } from '@/components/Toast';
import VideoUpload from '@/components/VideoUpload';
import { withTry } from '@/utils';
import { ProForm, ProFormDependency } from '@ant-design/pro-components';
import { Form } from 'antd';
import type { Store } from 'antd/lib/form/interface';
import { useCallback, useContext, useEffect } from 'react';
import dayjs from 'dayjs'
import { DealContext } from '../../context'
import { fileValidator } from '../../../DataEdit/utils';
import Sorter from './components/Sorter';
import { mergeVideoChunk } from '@/services'

const VideoMerge = () => {
  const [formRef] = Form.useForm();

  const { videoList } = useContext(DealContext)

  const handleAdd = useCallback(async (fields: any) => {
    const hide = message.loading('正在添加');

    const {
      video
    } = fields;

    const params = {
      _id: video.join(','),
      page: `视频处理-视频合并(${dayjs().format('YYYY-MM-DD')})`
    };

    try {
      const result = await mergeVideoChunk(params);
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
        message.info('任务执行中，请稍后查看')
      }
    },
    [handleAdd],
  );

  useEffect(() => {
    formRef.setFieldsValue({
      video: videoList || []
    })
  }, [])

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
            maxFiles: null,
            acceptedFileTypes: ['video/*'],
            allowMultiple: true,
          }}
        />
        <ProFormDependency name={['video']}>
          {({ video }) => {
            return (
              <ProForm.Item name="result" label="顺序调整">
                <Sorter
                  value={video}
                  onChange={value => formRef.setFieldsValue({
                    video: value 
                  })}
                />
              </ProForm.Item>
            );
          }}
        </ProFormDependency>
      </ProForm>
    </div>
  );
};

export default VideoMerge;
