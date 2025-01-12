import { forwardRef, useEffect, useState } from 'react';
import { Image } from 'antd';
import type { PreviewGroupPreview } from 'rc-image/es/PreviewGroup'
import { EventEmitter } from 'eventemitter3'

const Emitter = new EventEmitter()

export function preview(image: string[], modalConfig: Partial<PreviewGroupPreview>={}) {
  if(!image.length) return 
  Emitter.emit('view', image, modalConfig)
}

const DEFAULT_PREVIEW_CONFIG: Partial<PreviewGroupPreview> = {}

export type ImagePreviewRef = {
  open: (value: string) => void;
};

const ImagePreview = forwardRef<ImagePreviewRef, any>((props, ref) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [value, setValue] = useState<string[]>([]);

  const [previewConfig, setModalConfig] = useState<Partial<PreviewGroupPreview>>({...DEFAULT_PREVIEW_CONFIG})

  useEffect(() => {
    function listener(url: string[], config: Partial<PreviewGroupPreview>={}) {
      setValue(url)
      setModalConfig({...config})
    }
    Emitter.addListener('view', listener)
    return () => {
      Emitter.removeListener('view', listener)
    }
  }, [])

  return (
    <Image.PreviewGroup
      items={value}
      preview={{
        current: 0,
        ...previewConfig,
        visible,
        onVisibleChange: (visible) => {
          setVisible(visible)
        }
      }}
    />
  );
});

export default ImagePreview;
