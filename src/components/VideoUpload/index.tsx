import React, { memo, useCallback, useState } from 'react'
import pMap from 'p-map'
import type { FilePondProps } from 'react-filepond'
import { Upload } from '@/components/Upload'
import Wrapper from '@/components/WrapperItem'
import type { IProps } from '@/components/Upload'
import { generateVideoPoster } from '@/services'
import { withTry } from '@/utils'

export const VideoUpload = (props: IProps) => {

  const [ files, setFiles ] = useState<string[]>(props.value || [])

  const { onChange, ...nextProps } = props 

  const wrapperOnChange = useCallback(async (value: string[]) => {
    const newValue = value.filter(item => !files.includes(item))
    await pMap(newValue, async (item) => {
      await withTry(generateVideoPoster)({
        _id: item 
      })
    })
    setFiles(value)
    onChange?.(value)
  }, [onChange, files])

  return (
    <Upload 
      {...nextProps}
      onChange={wrapperOnChange}
    />
  )
}

export default Wrapper<FilePondProps>(memo(VideoUpload))