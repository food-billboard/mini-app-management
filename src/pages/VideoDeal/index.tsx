import PageContainer from '@/components/PageContainer';
import { Tabs } from 'antd';
import { useState, useCallback, useRef } from 'react';
import VideoCompress from './components/VideoCompress';
import VideoCorp from './components/VideoCorp';
import VideoMerge from './components/VideoMerge';
import VideoCreate from './components/VideoCreate';
import { DealContext } from './context';
import styles from './index.less';

const VideoDeal = () => {
  const [ currentTab, setCurrentTab ] = useState('merge');
  
  const extraParams = useRef<any>({})

  const onChange = useCallback((key: string, extra: any={}) => {
    extraParams.current = {...extra}
    setCurrentTab(key)
  }, [])


  return (
    <PageContainer>
      <div className={styles['video-deal']}>
        <DealContext.Provider value={{
          onChange,
          ...extraParams.current
        }}>
          <Tabs
            onChange={setCurrentTab}
            accessKey={currentTab}
            destroyInactiveTabPane
            items={[
              {
                label: '视频合并',
                key: 'merge',
                children: <VideoMerge />,
              },
              {
                label: '视频裁剪',
                key: 'corp',
                children: <VideoCorp />,
              },
              {
                label: '视频压缩',
                key: 'compress',
                children: <VideoCompress />,
              },
              {
                label: '视频数据库创建',
                key: 'create',
                children: <VideoCreate />,
              },
            ]}
          />
        </DealContext.Provider>
      </div>
    </PageContainer>
  );
};

export default VideoDeal;
