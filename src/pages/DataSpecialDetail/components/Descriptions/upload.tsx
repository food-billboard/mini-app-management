import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Image, message } from 'antd'
import { Upload } from '@/components/Upload'
import { isObjectId } from '@/components/Upload/util'
import { IMAGE_FALLBACK, formatUrl } from '@/utils'
import { getMediaList } from '@/services'
import { fileValidator } from '../../../Data/component/utils'

export const PreImage = (value: string) => {

  const [ src, setSrc ] = useState<string>(value)

  const error = useCallback((err) => {
    message.info('图片获取失败')
  }, [])

  const fetchData = useCallback(async (objectId: string) => {
    return Promise.resolve('https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3206689113,2237998950&fm=26&gp=0.jpg')
    try {
      const data = await getMediaList({
        type: 0,
        _id: objectId
      })
      return formatUrl(data.list[0].src)
    }catch(err) {
      return ''
    }
  }, [])

  useEffect(() => {
    if(typeof value === 'string' && !isObjectId(value)) {
      setSrc(formatUrl(value))
    }else {
      fetchData(value)
      .then(data => {
        setSrc(data as string)
      })
      .catch(err => {
        message.error('图片解析失败')
      })
    }
  }, [value])

  return (
    <Image  
      // width={200}
      // height={200}
      onError={error}
      preview={false}
      src={src}
      fallback={IMAGE_FALLBACK}
    />
  )

}

export default ({ value, props }: {value: string, props: any}) => {

  const srcValue = useMemo(() => {
    return (Array.isArray(value) ? value : [value]).filter(item => typeof item === 'string')
  }, [value])

  const {  } = useMemo(() => {
    return props
  }, [props])

  const onSelectChange = useCallback((value) => {
    console.log(value)
  }, [])

  return (
    <Upload 
      maxFiles={1}
      acceptedFileTypes={['image/*']}
      allowMultiple={false}
      value={srcValue}
      onChange={onSelectChange}
    />
  )
}