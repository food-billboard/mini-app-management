import React, { FC, memo, useMemo, useCallback, useState, useEffect } from 'react'
import { Result, Button } from 'antd'
import { history } from 'umi'
import ImageViewer, { TSrc } from '@/components/Image'
import { getMediaList } from '@/services'
import { formatUrl } from '@/utils'
import { isObjectId } from '@/components/Upload/util'

const VideoPreview: FC<any> = () => {

  const [ values, setValues ] = useState<TSrc[]>([])

  const urls: TSrc[] | undefined = useMemo(() => {
    const { location: { query } } = history
    const { urls=[] } = query as { urls: string[] | undefined } || {}
    return (Array.isArray(urls) ? urls : [urls])?.map(url => {
      return {
        src: url
      }
    })
  }, [])

  const fetchData = useCallback(async (urls: TSrc[]) => {
    let newValues = []
    for(let i = 0; i < urls.length; i ++) {
      const target = urls[i]
      const { url } = target 
      if(typeof url === 'string' && !isObjectId(url)) {
        newValues.push({
          src: formatUrl(url)
        })
      }else {
        try {
          const data = await getMediaList({
            type: 0,
            _id: url
          })
          newValues.push({
            src: formatUrl(data.list[0].src)
          })
        }catch(err) {
          // return ''
        }
      }
    }
    setValues(newValues)
  }, [])

  useEffect(() => {
    fetchData(urls)
  }, [urls])

  const goback = useCallback(() => {
    history.goBack()
  }, [])

  if(!values) return <Result
    status="404"
    title="404"
    subTitle="对不起，当前无图片资源"
    extra={
      <Button onClick={goback} type="primary">回到上一页</Button>
    }
  />

  return (
    <ImageViewer
      srcs={values}
    />
  )

}

export default memo(VideoPreview)