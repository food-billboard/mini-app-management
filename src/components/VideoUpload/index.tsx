import { memo, useCallback } from 'react'
import type { FilePondProps } from 'react-filepond'
import { Upload } from '@/components/Upload'
import Wrapper from '@/components/WrapperItem'
import type { IProps } from '@/components/Upload'
import { generateVideoPoster } from '@/services'
import { withTry } from '@/utils'

export const VideoUpload = (props: IProps) => {

  // const [ files, setFiles ] = useState<string[]>(props.value || [])

  const { onChange, onLoad, ...nextProps } = props 

  const wrapperOnLoad = useCallback(async (id: string) => {
    await withTry(generateVideoPoster)({
      _id: id 
    })
    onLoad?.(id)
  }, [])

  // ! 就目前来说暂时没什么用
  // const wrapperOnChange = useCallback(async (value: string[]) => {
  //   const newValue = value.filter(item => !files.includes(item))
  //   await pMap(newValue, async (item) => {
  //     await withTry(generateVideoPoster)({
  //       _id: item 
  //     })
  //   })
  //   setFiles(value)
  //   onChange?.(value)
  // }, [onChange, files])

  return (
    <Upload 
      {...nextProps}
      onChange={onChange}
      onLoad={wrapperOnLoad}
    />
  )
}

export default Wrapper<FilePondProps & Pick<IProps, 'expire'>>(memo(VideoUpload))