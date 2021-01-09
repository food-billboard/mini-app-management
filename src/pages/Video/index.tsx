import React, { FC, memo, useState, useMemo, useCallback } from 'react'
import { Result, Button } from 'antd'
import { history } from 'umi'
import Video from '@/components/Video'


const VideoPreview: FC<any> = () => {

  const videoId: string | undefined = useMemo(() => {
    const { location: { state } } = history
    const { url } = state as { url: string | undefined }
    return url
  }, [])

  const goback = useCallback(() => {
    history.goBack()
  }, [])

  if(!videoId) return <Result
    status="404"
    title="404"
    subTitle="对不起，未找到对应视频资源"
    extra={
      <Button onClick={goback} type="primary">回到上一页</Button>
    }
  />

  return (
    <Video
      src={`/api/static/video/${videoId}.mp4`}
    />
  )

}

export default memo(VideoPreview)