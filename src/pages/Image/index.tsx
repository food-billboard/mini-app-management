import React, { FC, memo, useMemo, useCallback } from 'react'
import { Result, Button } from 'antd'
import { history } from 'umi'
import ImageViewer, { TSrc } from '@/components/Image'


const VideoPreview: FC<any> = () => {

  const urls: TSrc[] | undefined = useMemo(() => {
    const { location: { query } } = history
    const { urls=[] } = query as { urls: string[] | undefined } || {}
    return (Array.isArray(urls) ? urls : [urls])?.map(url => {
      return {
        src: url
      }
    })
  }, [])

  const goback = useCallback(() => {
    history.goBack()
  }, [])

  if(!urls) return <Result
    status="404"
    title="404"
    subTitle="对不起，当前无图片资源"
    extra={
      <Button onClick={goback} type="primary">回到上一页</Button>
    }
  />

  return (
    <ImageViewer
      srcs={urls}
    />
  )

}

export default memo(VideoPreview)