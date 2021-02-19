import React, { memo, forwardRef, useImperativeHandle, useEffect, useState } from 'react'
import { fabric } from 'fabric'

export { default as Config } from './Config'
export { default as Layers } from './Layers'

interface IProps extends Partial<fabric.Canvas> {}

export interface IEditorRef {
  instance?: fabric.Canvas
}

const Editor = forwardRef<IEditorRef, IProps>((props, ref) => {

  const [ canvas, setCanvas ] = useState<fabric.Canvas>()

  useImperativeHandle(ref, () => {
    return {
      instance: canvas
    }
  }, [canvas])

  useEffect(() => {
    const canvas = new fabric.Canvas('image-editor-container', {
      allowTouchScrolling: true,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      centeredRotation: true,
      centeredScaling: true,
      controlsAboveOverlay: true,
      enableRetinaScaling: true,
      fireMiddleClick: true,
      fireRightClick: true,
      imageSmoothingEnabled: true,
      includeDefaultValues: true,
      // isDrawingMode: true,
      renderOnAddRemove: true,
      width: 500,
      height: 500,
      ...props
    })
    setCanvas(canvas)
    return () => {
      canvas.dispose()
    }
  }, [])

  return (
    <canvas
      id="image-editor-container"
    >
      当前浏览器不支持canvas特性
    </canvas>
  )

})

export default memo(Editor)