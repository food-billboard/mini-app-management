import React, { useEffect, useCallback, forwardRef, useImperativeHandle, memo, useRef } from 'react'
import Videojs, { VideoJsPlayer, VideoJsPlayerOptions } from 'video.js'
import { message } from 'antd'
import { getMediaList } from '@/services'
import { isObjectId } from '../Upload/util'
import 'video.js/dist/video-js.css'
import './index.less'

interface IVideoRef {
  reload: () => void
}

const Video = forwardRef<IVideoRef & VideoJsPlayer, VideoJsPlayerOptions>((props, ref) => {

  const instance = useRef<VideoJsPlayer>(null)

  const eventBinding: (instance: VideoJsPlayer) => void = useCallback((videoInstance) => {
    videoInstance.on('timeupdate', function() {
      // const currTime: number = videoInstance.currentTime()
      // const duration: number = videoInstance.duration()
      // console.log(currTime, duration)
    })

    videoInstance.on("loadstart",function(){
      // console.log("开始请求数据 ", data);
    })
    videoInstance.on("progress",function(){
        // console.log("正在请求数据 ");
    })
    videoInstance.on("loadedmetadata",function(){
      // console.log(data)
        // console.log("获取资源长度完成 ")
    })
    videoInstance.on("canplaythrough",function(){
    // console.log("视频源数据加载完成")
    })
    videoInstance.on("waiting", function(){
        // console.log("等待数据")
    });
    videoInstance.on("play", function(){
    // console.log("视频开始播放")
    });
    videoInstance.on("playing", function(){
        // console.log("视频播放中")
    });
    videoInstance.on("pause", function(){
        // console.log("视频暂停播放")
    });
    videoInstance.on("ended", function(){
        // console.log("视频播放结束");
    });
    videoInstance.on("error", function(){
        // console.log("加载错误")
    });
    videoInstance.on("seeking",function(){
        // console.log("视频跳转中");
    })
    videoInstance.on("seeked",function(){
        // console.log("视频跳转结束");
    })
    videoInstance.on("ratechange", function(){
        // console.log("播放速率改变")
    });
    videoInstance.on("timeupdate",function(){
        // console.log("播放时长改变");
    })
    videoInstance.on("volumechange",function(){
        // console.log("音量改变");
    })
    videoInstance.on("stalled",function(){
        // console.log("网速异常");
    })
  }, [])

  const mediaInfo = useCallback(async (src: string) => {
    const paths = src?.split('/') || []
    let fileId = paths[paths.length - 1]
    if(!fileId) return 'video/mp4'
    fileId = fileId.includes('.') ? fileId.split('.')[0] : fileId
    const params: API_MEDIA.IGetMediaListParams = {
      type: 1
    }
    if(isObjectId(fileId)) {
      params["_id"] = fileId
    }else {
      params.content = fileId
    }
    const data = await getMediaList(params)
    const [ target ] = data?.list || []
    return target?.info?.mime?.toLowerCase()
  }, [])

  const setSrc = useCallback(async () => {
    if(!instance.current) return 
    const nowSrc = instance.current.src()
    if(!!nowSrc && !props.src) {
      message.info('视频地址错误')
      return 
    }
    if(!props.src) return 
    if(nowSrc === props.src) return 
    const type = await mediaInfo(props.src)
    instance.current.pause()
    const src: Videojs.Tech.SourceObject = {
      src: props.src,
      type: type || 'video/mp4'
      // type: 'application/x-mpegURL'
    }
    instance.current.src(src)
  }, [props.src])

  // 重载
  const reload = useCallback(async () => {
    if(!instance.current) return 
    await setSrc()
    instance.current.load()
  }, [])

  // 播放器初始化
  const initVideoInstance = useCallback(async () => {
    const videoInstance = Videojs('video', {
      autoplay: true,
      controls: true,
      loop: false,
      muted: false,
      poster: 'https://img-home.csdnimg.cn/images/20201124032511.png',
      language: 'zh-CN',
      // children: [
      //   'bigPlayButton',
      //   'controlBar'
      // ],
      ...props
    })
    // @ts-ignore
    instance.current = videoInstance
    eventBinding(videoInstance)
    reload()
  }, [])

  useImperativeHandle(ref, () => ({
    ...instance.current!,
    reload
  }))

  useEffect(() => {
    initVideoInstance()
    return () => {
      instance.current?.pause()
      instance.current?.dispose()
    }
  }, [])

  useEffect(() => {
    if(!instance.current) return 
    reload()
  }, [setSrc, props.src])

  return (
    <div
      style={{
        width: "100%",
        height: "100%"
      }}
    >
      <video
        style={{
          width: "100%",
          height: "100%"
        }}
        className="video-js vjs-big-play-centered"
        id="video"
      >
        {/* <source src="http://localhost:8000/live/273dbc82f45552ff7b98d36bf1ad86a8/index.m3u8" type="application/x-mpegURL" id="target"></source> */}
      </video>
    </div>
  )

})

export default memo(Video)