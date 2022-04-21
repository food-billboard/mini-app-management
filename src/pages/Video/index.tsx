import React, { FC, memo, useMemo, useCallback } from 'react'
import { Result, Button } from 'antd'
import { history } from 'umi'
import Video from '@/components/Video'

export function PreView(videos: string | string[], toList: boolean=true) {
  if(!videos) return 
  const list = Array.isArray(videos) ? videos : [videos]
  const path = toList  ? '/media/video/list' : '/media/video'
  history.push({
    pathname: path,
    query: {
      url: list,
    },
  })
}

const VideoPreview: FC<any> = () => {

  const videoId: string | undefined = useMemo(() => {
    const { location: { query } } = history
    const { url } = query as { url: string | undefined }
    const target = Array.isArray(url) ? url[0] || "" : url 
    try {
      const { pathname } = new URL(target)
      return pathname
    }catch(err) {
      return target 
    }
  }, [])

  const goBack = useCallback(() => {
    history.goBack()
  }, [])

  if(!videoId) return <Result
    status="404"
    title="404"
    subTitle="对不起，未找到对应视频资源"
    extra={
      <Button onClick={goBack} type="primary">回到上一页</Button>
    }
  />

  // return (
  //   <div>另外一个页面</div>
  // )

  // ? 有问题就用下面那个
  return (
    <Video
      src={`/api${videoId}`}
    />
  )

  return (
    <Video
      src={`/api/static/video/${videoId}.mp4`}
    />
  )

}

export default memo(VideoPreview)