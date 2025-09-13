import VideoListModal, { VideoListModalRef } from "@/pages/VideoDeal/components/VideoListModal"
import AsyncButton from '../AsyncButton';
import { message, modal } from '../Toast';
import { Button } from 'antd';
import { history } from 'umi'
import axios from 'axios';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { useCallback, useEffect, useRef } from 'react';
import { Modal } from '../ProModal'


let CallbackMap: any = {
  '视频处理-视频裁剪': (props: {
    visible: boolean 
    onClose: () => void 
    onModalClose: () => void 
    value: API_MEDIA.IGetLongTimeTaskListData
  }) => {

    const { visible, value, onClose, onModalClose } = props 
    const { response } = value 

    const videoListModalRef = useRef<VideoListModalRef>(null);

      // 去合并
  const handleMerge = useCallback((videoList) => {
    onClose()
    onModalClose()
    history.replace(`/media/video-deal`, {
      tab: 'merge',
      videoList
    });
  }, []);

  // 批量下载
  const handleDownload = useCallback(async (videoList) => {
    try {
      // 创建一个新的JSZip对象
      const zip = new JSZip();

      // 异步下载每个文件并添加到zip中
      for (let index = 0; index < videoList.length; index++) {
        const file = videoList[index];
        const { status, value } = file;
        if (status === 'fulfilled') {
          const [fileName] = value.split('/').slice(-1);
          // 使用axios以blob格式下载文件
          const response = await axios.get(value, { responseType: 'blob' });
          // 将下载的blob转换为JSZip可以处理的Uint8Array
          zip.file(`${index + 1}-${fileName}`, response.data);
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
    if(visible) {
      videoListModalRef.current?.open(JSON.parse(response));
    }
  }, [visible, response])

    return  (
      <VideoListModal
        ref={videoListModalRef}
        extraFooter={({ videoList }) => {
          return (
            <>
              {videoList.every((item: any) => item.status === 'fulfilled') && (
                <>
                  {/* <Button onClick={handleMerge.bind(null, videoList)}>
                    去合并
                  </Button> */}
                  <AsyncButton onClick={handleDownload.bind(null, videoList)}>
                    批量下载
                  </AsyncButton>
                </>
              )}
            </>
          );
        }}
        
      />
    )
  },
  '视频处理-视频数据库创建': (props: {
    visible: boolean 
    value: API_MEDIA.IGetLongTimeTaskListData
    onClose: () => void 
  }) => {
    const { visible, onClose, value } = props 
    return (
      <Modal
        open={visible}
        onCancel={onClose}
      >
        任务已执行完成
      </Modal>
    )
  },
  '视频处理-视频合并': (props: {
    visible: boolean 
    value: API_MEDIA.IGetLongTimeTaskListData
    onClose: () => void 
  }) => {

    const { visible, onClose, value } = props 

    useEffect(() => {
      if(visible) {
        modal.confirm({
          title: '提示',
          content: '视频合并成功，是否下载？',
          onOk: () => {
            console.log(value, 2222)
            // saveAs('TODO');
          },
        });
      }
    }, [visible, value])

    return (<></>)
  }
}
let prevDataList: any = null

// ! 暂时没用
export function diffData(data: any[]) {
  function deal(data: any) {
    const { _id, response } = data
    const func = CallbackMap[_id]
    delete CallbackMap[_id]
    try {
      func(JSON.parse(response))
    } catch (err) {
      func(response)
    }
  }

  // 第一次进来没有数据
  if (!prevDataList) {
    data.forEach(item => {
      const { status, _id, response } = item
      if (status === 'SUCCESS' && CallbackMap[_id]) {
        deal(response)
      }
    })
  } else {
    data.forEach(item => {
      const { _id, status, response } = item
      if (status === 'SUCCESS' && prevDataList.some((item: any) => item._id === _id && item.status === 'PROCESS')) {
        deal(response)
      }
    })
  }
  prevDataList = [...data]
}

export function getCallbackMap() {
  return CallbackMap
}

export function setCallbackMap(value: any) {
  CallbackMap = { ...value }
}

export function pushTask(taskId: string, callback: any) {
  CallbackMap[taskId] = callback
}

