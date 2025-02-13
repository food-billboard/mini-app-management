import { Button, Modal } from "antd"
import { CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { forwardRef, ReactNode, useImperativeHandle, useState } from "react"
import styles from './index.less'

export type VideoListModalRef = {
  open: (videoList: API_MEDIA.ICorpVideoChunkData[]) => void 
}

export type VideoListModalProps = {
  extraFooter?: ReactNode
}

const VideoListModal = forwardRef<VideoListModalRef, VideoListModalProps>((props, ref) => {

  const { extraFooter } = props 

  const [open, setOpen] = useState(false)
  const [videoList, setVideoList] = useState<API_MEDIA.ICorpVideoChunkData[]>([])

  useImperativeHandle(ref, () => {
    return {
      open: (videoList) => {
        setOpen(true)
        setVideoList(videoList)
      }
    }
  }, [])

  return (
    <Modal
      title="处理结果"
      open={open}
      footer={(_, { CancelBtn }) => {
        return (
          <>
            <CancelBtn />
            {extraFooter}
          </>
        )
      }}
      onCancel={() => setOpen(false)}
      destroyOnClose
      width={720}
    >
      <div className={styles['video-list']}>
        {
          videoList.map((item, index) => {
            const { status, value, reason } = item 
            const success = status === 'fulfilled'
            return (
              <div key={success ? value : index}>
                <Button type="link" danger={!success} icon={success ? <CheckCircleOutlined /> : <CloseCircleOutlined />} ></Button>
                <span>片段{index + 1}</span>
                <Button type="link" danger={!success} onClick={() => success && window.open(value, "_blank")}>{success ? value : JSON.stringify(reason)}</Button>
              </div>
            )
          })
        } 
      </div>
    </Modal>
  )

})

export default VideoListModal