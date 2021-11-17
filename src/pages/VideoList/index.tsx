import React, { FC, memo, useMemo, useCallback, useState, useEffect } from 'react'
import { history } from 'umi'
import { Spin } from 'antd'
import pMap, { pMapSkip } from 'p-map'
import { ImageList, TSrc } from '../Image'
import { PreView } from '../Video'
import { getMediaList } from '@/services'
import { withTry } from '@/utils'

const VideoList: FC<any> = () => {

  const [ imageList, setImageList ] = useState<TSrc[]>([])
  const [ loading, setLoading ] = useState<boolean>(true)

  const videoIds: string[] | undefined = useMemo(() => {
    const { location: { query } } = history
    const { url=[] } = query as { url: string[] | undefined }
    return (Array.isArray(url) ? url : [url])
  }, [])

  const handleClick = useCallback((target: TSrc) => {
    PreView(target.origin, false)
  }, [])

  const fetchData = useCallback(async (list: string[]) => {
    setLoading(true)
    const result = await pMap(list, async (item) => {
      const { pathname } = new URL(item)
      const [, data] = await withTry(getMediaList)({
        type: 1,
        content: pathname 
      })
      if(!data) return pMapSkip
      const target = data.list[0]
      return target ? {
        src: target.poster,
        _id: target["_id"],
        origin: target.src 
      } : pMapSkip
    }, {
      concurrency: 3
    })
    setImageList(result)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchData(videoIds)
  }, [videoIds])

  if(loading) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Spin />
      </div>
    )
  }

  return (
    <ImageList
      value={imageList}
      onClick={handleClick}
    />
  )

}

export default memo(VideoList)