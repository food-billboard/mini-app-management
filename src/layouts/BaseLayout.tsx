import { Outlet } from 'umi';
import { ProConfigProvider } from '@ant-design/pro-components'
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

export default BasicLayout
