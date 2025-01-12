import { FC, memo, useState, useEffect } from 'react'
import { Modal, Pagination } from 'antd'
import type { ModalProps } from 'antd'
import { EventEmitter } from 'eventemitter3'
import Video from '../Video'

const Emitter = new EventEmitter()

export function preview(video: string[], modalConfig: Partial<ModalProps>={}) {
  if(!video.length) return 
  Emitter.emit('view', video, modalConfig)
}

const DEFAULT_MODAL_CONFIG: Partial<ModalProps> = {}

const VideoPreview: FC<any> = () => {

  const [ visible, setVisible ] = useState(false)
  const [dataSource, setDataSource] = useState<string[]>([])
  const [ current, setCurrent ] = useState(0)

  const [modalConfig, setModalConfig] = useState<Partial<ModalProps>>({...DEFAULT_MODAL_CONFIG})

  useEffect(() => {
    function listener(video: string[], config: Partial<ModalProps>) {
      const dataSource = video.map(item => {
        try {
          const { pathname } = new URL(item)
          return pathname
        }catch(err) {
          return item
        }
      }).filter(Boolean)
      setDataSource(dataSource)
      setCurrent(0)
      setModalConfig({...config})
    }
    Emitter.addListener('view', listener)
    return () => {
      Emitter.removeListener('view', listener)
    }
  }, [])

  return (
    <Modal
      width={520}
      destroyOnClose
      {...modalConfig}
      open={visible}
      afterClose={() => {
        setModalConfig({...DEFAULT_MODAL_CONFIG})
      }}
      onCancel={() => setVisible(false)}
    >
      <Video
        src={`/api${dataSource[current]}`}
      />
      <Pagination 
        pageSize={10}
        current={current}
        onChange={current => {
          setCurrent(current)
        }}
        simple
      />
    </Modal>
  )

}

export default memo(VideoPreview)