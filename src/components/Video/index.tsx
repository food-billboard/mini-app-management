import ReactPlayer from 'react-player'
import type { ReactPlayerProps } from 'react-player'
import './index.less'

const Video = (props: ReactPlayerProps) => {

  // const mediaInfo = useCallback(async (src: string) => {
  //   const paths = src?.split('/') || []
  //   let fileId = paths[paths.length - 1]
  //   if(!fileId) return 'video/mp4'
  //   fileId = fileId.includes('.') ? fileId.split('.')[0] : fileId
  //   const params: API_MEDIA.IGetMediaListParams = {
  //     type: 1
  //   }
  //   if(isObjectId(fileId)) {
  //     params["_id"] = fileId
  //   }else {
  //     params.content = fileId
  //   }
  //   const data = await getMediaList(params)
  //   const [ target ] = data?.list || []
  //   return target?.info?.mime?.toLowerCase()
  // }, [])

  // useEffect(() => {
  //   if(!src) return 
  //   const type = await mediaInfo(props.src)
  //   .then(type => {

  //   })
  //   const src: Videojs.Tech.SourceObject = {
  //     src: props.src,
  //     type: type || 'video/mp4'
  //     // type: 'application/x-mpegURL'
  //   }
  // }, [src])

  return (
    <div
      style={{
        width: "100%",
        height: "100%"
      }}
    >
      <ReactPlayer
        style={{
          width: "100%",
          height: "100%"
        }}
        className="video-js vjs-big-play-centered"
        id="video"
        {...props}
      />
    </div>
  )

}

export default Video