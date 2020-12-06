import React, { useRef, useState } from 'react'
import {
  message,
} from 'antd'
import { FilePondFile, FilePondErrorDescription } from 'filepond'
import { FilePond, registerPlugin, FilePondProps } from 'react-filepond'
import FilePondPluginFileRename from 'filepond-plugin-file-rename'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginFilePoster from 'filepond-plugin-file-poster'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import eq from 'lodash/eq'
import Wrapper from '../WrapperItem'
import china from './locale'
import { encryptionFile, sleep } from './util'
import { withTry } from '@/utils'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-file-poster/dist/filepond-plugin-file-poster.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

registerPlugin(
  FilePondPluginFileRename, 
  FilePondPluginFileValidateSize, 
  FilePondPluginFileValidateType, 
  FilePondPluginFilePoster, 
  FilePondPluginImagePreview
)

const CHUNK_SIZE = 1024 * 1024 * 5


const Upload: React.FC<FilePondProps> = (props) => {

  const uploadRef = useRef<FilePond | null>(null)

  const [ value, setValue ] = useState<string[]>([])

  const onError = (error: FilePondErrorDescription) => {
    console.log(error)
    message.info('上传错误，请重试')
  }
  
  //文件添加时对其进行加密
  const onAddFile = async (fileObj: FilePondFile) => {

    const chunkSize = props.chunkSize || CHUNK_SIZE

    await sleep(300)

    const [ , md5 ] = await withTry(encryptionFile)(fileObj.file, chunkSize)

    if(!md5) {
      uploadRef.current?.removeFile(fileObj)
      message.info('文件解析错误，请重试')
      return
    }

    fileObj.setMetadata('md5', md5)

  }

  //文件上传完成
  const processFiles = () => {
    const files = getFiles()
    setValue(files.map((file: any) => file.objectId))
  }

  //文件删除
  const removeFile = (error: FilePondErrorDescription | null, file: FilePondFile) => {
    if(error) return
    const { objectId } = file as any
    const newValue = value.filter(file => file !== objectId)
    if(newValue.length !== value.length) {
      setValue(newValue)
      
    }
  }

  //预上传请求头
  const processHeaders = (file: File) => {
    const files = getFiles()
    const [ target ] = files.filter(item => eq(item.file, file))
    if(!target) return {}
    const { md5, chunksLength, file: originFile } = target as any
    return {
      'Upload-name': md5,
      'Upload-length': chunksLength,
      'Upload-auth': 'PUBLIC',
      'Upload-chunk': props.chunkSize || CHUNK_SIZE,
      'Upload-mime': originFile.type,
      'Upload-size': originFile.size,
      /**
       * Upload-Length
       * Upload-Name
       * Upload-Offset
       * Content-Type
       */
    }
  }

  const getFiles = () => uploadRef.current?.getFiles() || []

  const processLoad  = (response: any) => {
    const { responseText } = response
    if(typeof responseText !== 'string') return
    const [ md5, id ] = responseText.split('-').map(text => text.trim())
    const files = getFiles()
    files.forEach((file: any) => {
      if(file.md5 == md5) file.setMetadata('objectId', id)
    })
  }

  return (
      <FilePond 
        files={(props.files || []) as any}
        required
        checkValidity
        ref={uploadRef}
        allowMultiple={true} 
        //@ts-ignore
        server={{
          url: '/api/test',
          process: {
            withCredentials: false,
            headers: processHeaders,
            timeout: 5000,
            onload: processLoad,
            onerror: null,
            ondata: null
          },
        }}
        onprocessfiles={processFiles}
        onremovefile={removeFile}
        //@ts-ignore
        maxFileSize={'100MB'}
        instantUpload={false}
        chunkRetryDelays={[1000]}
        onerror={onError}
        chunkUploads
        chunkSize={CHUNK_SIZE}
        itemInsertInterval={200}
        onaddfilestart={onAddFile}
        {...china}
        {...props}
      />
  )

}

export default Wrapper<FilePondProps>(React.memo(Upload))
