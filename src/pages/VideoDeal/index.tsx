import PageContainer from '@/components/PageContainer';
import { Tabs } from 'antd';
import VideoMerge from './components/VideoMerge'
import styles from './index.less';

const VideoDeal = () => {
  return (
    <PageContainer>
      <div className={styles['video-deal']}>
        <Tabs
          items={[
            {
              label: '视频合并',
              key: 'merge',
              children: (<VideoMerge />),
            },
          ]}
        />
      </div>
    </PageContainer>
  );
};

export default VideoDeal;
