import { Outlet } from 'umi';
import { App } from 'antd';
import useToast from '../components/Toast'
import ImagePreview from '../components/ImagePreview'
import VideoPreview from '../components/VideoPreview'

const BasicLayout = () => {

  useToast()

  return (
    <div>
      <ImagePreview />
      <VideoPreview />
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
