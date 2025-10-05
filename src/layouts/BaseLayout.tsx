import { Outlet } from 'umi';
import { App } from 'antd';
import useToast from '../components/Toast'
import ImagePreview from '../components/ImagePreview'
import VideoPreview from '../components/VideoPreview'
import LongTaskAction from '@/components/LongTimeTaskAction'

const BasicLayout = () => {

  useToast()

  return (
    <div style={{
      height: 'calc(100vh - 56px - 72.188px - 16px)'
    }}>
      <ImagePreview />
      <VideoPreview />
      <LongTaskAction />
      <Outlet />
    </div>
  );
};

const Wrapper = () => {
  return (
    <App>
      <BasicLayout />
    </App>
  )
}

export default Wrapper
