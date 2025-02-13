import PageContainer from '@/components/PageContainer';
import { Tabs } from 'antd';
import VideoMerge from './components/VideoMerge'
import VideoCorp from './components/VideoCorp'
import VideoCompress from './components/VideoCompress'
import styles from './index.less';

const VideoDeal = () => {
  return (
    <PageContainer>
      <div className={styles['video-deal']}>
        <Tabs
          destroyInactiveTabPane
          items={[
            {
              label: '视频合并',
              key: 'merge',
              children: (<VideoMerge />),
            },
            {
              label: '视频裁剪',
              key: 'corp',
              children: (<VideoCorp />),
            },
            {
              label: '视频压缩',
              key: 'compress',
              children: (<VideoCompress />),
            },
          ]}
        />
      </div>
    </PageContainer>
  );
};

export default VideoDeal;
