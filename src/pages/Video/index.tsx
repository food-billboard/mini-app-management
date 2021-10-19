import React, { FC, memo, useMemo, useCallback } from 'react'
import { Result, Button } from 'antd'
import { history } from 'umi'
import Video from '@/components/Video'

export function PreView(videos: string | string[]) {
  if(!videos) return 
  const list = Array.isArray(videos) ? videos : [videos]
  history.push({
    pathname: '/media/video',
    query: {
      url: list[0],
    },
  })
}

const VideoPreview: FC<any> = () => {

  const videoId: string | undefined = useMemo(() => {
    const { location: { query } } = history
    const { url } = query as { url: string | undefined }
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