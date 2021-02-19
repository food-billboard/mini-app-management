import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle, memo, useRef } from 'react'
import Viewer from 'viewerjs'
import Affix from './components/Affix'
import { ImageConfig, IImageConfigRef } from './components/Config'
import 'viewerjs/dist/viewer.css'
import styles from './index.less'

export { default as Preview } from './components/Click2Preview'

interface IViewerRef {}

export type TSrc = {
  src: string
  [key: string]: any
}

interface IProps {
  srcs: TSrc[] | TSrc
}

const ImageViewer: React.FC<IProps> = forwardRef<IViewerRef, IProps & Viewer.Options>((props, ref) => {

  const [ instance, setInstance ] = useState<Viewer>()

  const configRef = useRef<IImageConfigRef>(null)

  const initInstance = useCallback(() => {
    const element = document.getElementById('image-viewer') as HTMLElement

    const viewer: Viewer = new Viewer(element, {
      inline: true,
      viewed() {
        viewer.zoomTo(1);
      },
      title: [4, (image: any, imageData: any) => `${image.alt} (${imageData.naturalWidth} × ${imageData.naturalHeight})`],
      ...props
    })
    setInstance(viewer)
  }, [])

  const handleOpenConfig = useCallback(() => {
    configRef.current?.open()
  }, [configRef])

  useImperativeHandle(ref, () => ({
    ...instance
  }))

  useEffect(() => {
    initInstance()
    return () => {
      instance && instance.destroy()
    }
  }, [])
 
  const list: TSrc[] = !!props.srcs ? (
    Array.isArray(props.srcs) ? props.srcs: [props.srcs]
  ) : []

  return (
    <div className={styles["image-viewer-wrapper"]}>
      <div id="image-viewer">
        {
          list.map((item: TSrc, index: number) => {
            return (
              <img
                key={item?.src || index}
                {...item}
              />
            )
          })
        }
      </div>
      <Affix onClick={handleOpenConfig} />
      <ImageConfig 
        ref={configRef}
        instance={instance as Viewer}
        mask={false}
        width={400}
      />
    </div>
  )

})

export default memo(ImageViewer)