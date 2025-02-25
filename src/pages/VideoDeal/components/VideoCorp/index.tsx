import AsyncButton from '@/components/AsyncButton';
import { message } from '@/components/Toast';
import VideoUpload from '@/components/VideoUpload';
import { corpVideoChunk } from '@/services';
import { withTry } from '@/utils';
import { ProForm } from '@ant-design/pro-components';
import { Button, Form } from 'antd';
import type { Store } from 'antd/lib/form/interface';
import axios from 'axios';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { useCallback, useContext, useEffect, useRef } from 'react';
import { fileValidator } from '../../../DataEdit/utils';
import VideoListModal, { VideoListModalRef } from '../VideoListModal';
import { DealContext } from '../../context'
import TimePicker from './components/TimePicker';

const VideoMerge = () => {
  const [formRef] = Form.useForm();

  const { onChange, videoList } = useContext(DealContext)

  const videoListModalRef = useRef<VideoListModalRef>(null);

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
        videoListModalRef.current?.open(success);
      }
    },
    [handleAdd],
  );

  // 去合并
  const handleMerge = useCallback((videoList) => {
    onChange('merge', {
      videoList
    })
  }, [])

  // 批量下载
  const handleDownload = useCallback(async (videoList) => {
    try {
      // 创建一个新的JSZip对象
      const zip = new JSZip();

      // 异步下载每个文件并添加到zip中
      for (let index = 0; index < videoList.length; index++) {
        const file = videoList[index];
        const { status, value } = file 
        if(status === 'fulfilled') {
          const [fileName] = value.split('/').slice(-1);
          // 使用axios以blob格式下载文件
          const response = await axios.get(value, { responseType: 'blob' });
          // 将下载的blob转换为JSZip可以处理的Uint8Array
          zip.file(fileName, new Uint8Array(response.data));
        }
      }

      // 生成ZIP文件的blob对象
      const content = await zip.generateAsync({ type: 'blob' });
      // 使用file-saver触发文件下载
      saveAs(content, 'bundle.zip');
    } catch (error) {
      message.info('批量下载失败');
    }
  }, []);

  useEffect(() => {
    formRef.setFieldsValue({
      video: videoList || []
    })
  }, [])

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
      <VideoListModal
        ref={videoListModalRef}
        extraFooter={({ videoList }) => {
          return (
            <>
              {
                videoList.every((item: any) => item.status === 'fulfilled') && (
                  <Button onClick={handleMerge.bind(null, videoList)}>去合并</Button>
                )
              }
              <AsyncButton onClick={handleDownload.bind(null, videoList)}>
                批量下载
              </AsyncButton>
            </>
          );
        }}
      />
    </div>
  );
};

export default VideoMerge;
