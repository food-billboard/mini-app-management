import { message } from '@/components/Toast';
import {
  ProForm,
  ProFormSelect,
  ProFormTextArea,
  ProFormDatePicker
} from '@ant-design/pro-components';
import { Form } from 'antd';
import dayjs from 'dayjs'
import type { Store } from 'antd/lib/form/interface';
import { useCallback } from 'react';
import { createMediaDataBase } from '@/services'

const VideoCreate = () => {
  const [formRef] = Form.useForm();

  const onFinish = useCallback(
    async (values: Store) => {
      const hide = message.loading('正在添加');

      const {
        poster,
        expire,
        ...nextFields
      } = values;
  
      const params: any = {
        ...nextFields,
        expire,
        poster: Array.isArray(poster) ? poster[0] : poster,
        page: `视频处理-视频数据库创建(${dayjs().format('YYYY-MM-DD')})`
      };
  
      try {
        await createMediaDataBase(params);
        hide();
        message.info('数据库任务创建中，可稍后查看结果')
        return true;
      } catch (error) {
        hide();
        message.error('操作失败请重试！');
        return false;
      }
    },
    [],
  );

  return (
    <div>
      <ProForm form={formRef} onFinish={onFinish}>
        <ProFormSelect
          disabled
          name="type"
          label="媒体类型"
          initialValue="video"
          fieldProps={{
            options: [
              {
                label: '图片',
                value: 'image',
              },
              {
                label: '视频',
                value: 'video',
              },
              {
                label: '其他',
                value: 'other',
              },
            ],
          }}
          rules={[
            {
              required: true,
              message: '请选择媒体类型',
            },
          ]}
        />
        <ProFormTextArea
          name="file_name"
          label="文件名称"
          fieldProps={{
            autoSize: true,
          }}
        />
        <ProFormTextArea
          name="src"
          label="文件地址"
          fieldProps={{
            autoSize: true,
          }}
          placeholder={`文件在数据库中的位置，如"/static/video/xxx.mp4"`}
          rules={[
            {
              required: true,
              message: '请输入文件地址',
            },
          ]}
        />
        {/* <Upload
          wrapper={{
            label: '视频封面',
            name: 'poster',
          }}
          item={{
            maxFiles: 1,
            acceptedFileTypes: ['image/*'],
            allowMultiple: false,
          }}
        /> */}
        <ProFormTextArea
          name="description"
          label="描述"
          fieldProps={{
            autoSize: true,
          }}
        />
        <ProFormDatePicker
          name="expire"
          label="过期时间"
          fieldProps={{
            showTime: true,
            format: 'YYYY-MM-DD HH:mm:ss'
          }}
        />
      </ProForm>
    </div>
  );
};

export default VideoCreate;
