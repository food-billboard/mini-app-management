import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Image, message } from 'antd'
import { Upload } from '@/components/Upload'
import { isObjectId } from '@/components/Upload/util'
import { IMAGE_FALLBACK, formatUrl } from '@/utils'
import { getMediaList } from '@/services'

export const PreImage = ({ value, onClick }: { value: string, onClick?: any }) => {

  const [ src, setSrc ] = useState<string>(value)

  const error = useCallback((err) => {
    // message.info('图片获取失败')
  }, [])

  const fetchData = useCallback(async (objectId: string) => {
    try {
      const data = await getMediaList({
        type: 0,
        _id: objectId
      })
      return setSrc(formatUrl(data.list[0].src))
    }catch(err) {
      return ''
    }
  }, [])

  useEffect(() => {
    if(typeof value === 'string' && !isObjectId(value)) {
      setSrc(formatUrl(value))
    }else {
      fetchData(value)
    }
  }, [value])

  return (
    <Image  
      // width={200}
      // height={200}
      style={{maxWidth: 400, maxHeight: 300}}
      onError={error}
      preview={false}
      src={src}
      fallback={IMAGE_FALLBACK}
      onClick={onClick}
    />
  )

}

export default ({ value, props }: {value: string, props: any}) => {

  const srcValue = useMemo(() => {
    return (Array.isArray(value) ? value : [value]).filter(item => typeof item === 'string')
  }, [value])

  const { onChange } = useMemo(() => {
    const { fieldProps: { onChange } } = props 
    return {
      onChange
    }
  }, [props])

  const onSelectChange = useCallback((value) => {
    const [ newValue ] = value
    onChange(newValue) 
  }, [onChange])

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