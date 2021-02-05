import React, { FC, useRef, memo, useMemo, useCallback, useEffect } from 'react'
import { Button } from 'antd'
import ProCard from '@ant-design/pro-card'
import { history } from 'umi'
import classnames from 'classnames'
import ImageEditor, { Config as EditorConfig, Layers as EditroLayers, IEditorRef } from '@/components/ImageEditor'
import StoreModal, { IModalRef } from './components/StoreModal'
import styles from './index.less'

const Editor: FC<any> = () => {

  const editorRef = useRef<IEditorRef>(null)
  const storeModalRef = useRef<IModalRef>(null)

  const originImage: string | undefined = useMemo(() => {
    const { location: { state } } = history
    const { url } = state as { url?: string } || {}
    return url
  }, [])

  const getInstance = useCallback(() => {
    return editorRef.current?.instance as fabric.Canvas
  }, [editorRef])

  //选择保存类型
  const handleStore = useCallback(() => {
    storeModalRef.current?.open()
  }, [storeModalRef])

  //保存
  const onStore = useCallback((values) => {
    console.log(values, '获取当前的保存配置并作出保存操作')
  }, [storeModalRef, editorRef])

  useEffect(() => {
    const dom = document.querySelector('.image-editor-container .ant-pro-card-body')
    setTimeout(() => {  
      const { width=500, height=500 } = dom?.getBoundingClientRect() || {}
      editorRef.current?.instance?.setWidth(width - 48)
      editorRef.current?.instance?.setHeight(height - 74)
    }, 0)
  }, [])

  return (
    <ProCard style={{position: 'absolute', height: '100%'}} title="图片编辑" extra={
      <Button type="primary" onClick={handleStore}>保存</Button>
    } split="vertical" bordered headerBordered>
      <ProCard 
        title="图层" 
        colSpan={6}
        style={{overflowY: 'auto', overflowX: 'hidden'}}
      >
        <EditroLayers
          getInstance={getInstance}
        />
      </ProCard>
      <ProCard 
        className={classnames(styles["image-editor-container"], 'image-editor-container')}
        title="编辑" 
        colSpan={12}
      >
        <ImageEditor
          ref={editorRef}
        />
      </ProCard>
      <ProCard title="配置" colSpan={6}>
        <EditorConfig
          getInstance={getInstance}
        />
      </ProCard>
      <StoreModal
        ref={storeModalRef}
        onOk={onStore}
      />
    </ProCard>
  )

}

export default memo(Editor)