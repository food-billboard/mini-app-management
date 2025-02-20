import { message, modal } from '@/components/Toast';
import VideoUpload from '@/components/VideoUpload';
import { withTry } from '@/utils';
import { ProForm, ProFormDependency } from '@ant-design/pro-components';
import { Form } from 'antd';
import type { Store } from 'antd/lib/form/interface';
import { saveAs } from 'file-saver';
import { useCallback, useContext, useEffect } from 'react';
import { DealContext } from '../../context'
import { fileValidator } from '../../../DataEdit/utils';
import Sorter from './components/Sorter';

const VideoMerge = () => {
  const [formRef] = Form.useForm();

  const { videoList } = useContext(DealContext)

  const handleAdd = useCallback(async (fields: any) => {
    const hide = message.loading('正在添加');
    // const method = fields['_id'] ? putMovie : postMovie;
    const method = async (value: any) => {};

    const {
      video,
      poster,
      district = [],
      classify = [],
      language = [],
      ...nextFields
    } = fields;

    const params = {
      ...nextFields,
      classify: Array.isArray(classify) ? classify : [classify],
      district: Array.isArray(district) ? district : [district],
      language: Array.isArray(language) ? language : [language],
      video: Array.isArray(video) ? video[0] : video,
      poster: Array.isArray(poster) ? poster[0] : poster,
    };

    try {
      await method(params);
      hide();
      message.success('操作成功');
      return true;
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
        modal.confirm({
          title: '提示',
          content: '视频合并成功，是否下载？',
          onOk: () => {
            saveAs('TODO');
          },
        });
      }
    },
    [handleAdd],
  );

  useEffect(() => {
    formRef.setFieldsValue({
      video: videoList 
    })
  }, [videoList])

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
                  value={video?.map((item: any) => {
                    return {
                      url: item,
                      id: '',
                    };
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
