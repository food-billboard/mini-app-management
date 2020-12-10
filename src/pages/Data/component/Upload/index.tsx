import React, { useRef, useState } from 'react'
import {
  message,
} from 'antd'
import { Upload as TusUpload, defaultOptions, isSupported, canStoreURLs } from 'tus-js-client'
import { supported, FilePondFile, FilePondErrorDescription, RevertServerConfigFunction, ProcessServerConfigFunction } from 'filepond'
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
import { deleteFile } from '@/services'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-file-poster/dist/filepond-plugin-file-poster.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

interface IExtraMetaData {
  md5: string
  objectId: string
}

registerPlugin(
  FilePondPluginFileRename, 
  FilePondPluginFileValidateSize, 
  FilePondPluginFileValidateType, 
  FilePondPluginFilePoster, 
  FilePondPluginImagePreview
)

const CHUNK_SIZE = 1024 * 1024 * 5

const filepondSupport = supported()
const tusSupport = isSupported

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

  // //预上传请求头
  // const processHeaders = (file: File) => {
  //   const files = getFiles()
  //   const [ target ] = files.filter(item => eq(item.file, file))
  //   if(!target) return {}
  //   const { md5, chunksLength, file: originFile } = target as any
  //   return {
  //     'Upload-name': md5,
  //     'Upload-length': chunksLength,
  //     'Upload-auth': 'PUBLIC',
  //     'Upload-chunk': props.chunkSize || CHUNK_SIZE,
  //     'Upload-mime': originFile.type,
  //     'Upload-size': originFile.size,
  //     /**
  //      * Upload-Length
  //      * Upload-Name
  //      * Upload-Offset
  //      * Content-Type
  //      */
  //   }
  // }

  const getFiles = () => uploadRef.current?.getFiles() || []

  // const processLoad  = (response: any) => {
  //   const { responseText } = response
  //   if(typeof responseText !== 'string') return
  //   const [ md5, id ] = responseText.split('-').map(text => text.trim())
  //   const files = getFiles()
  //   files.forEach((file: any) => {
  //     if(file.md5 == md5) file.setMetadata('objectId', id)
  //   })
  // }

  //删除
  const revert: RevertServerConfigFunction = async (__, load, _) => load()

  //上传
  const process:ProcessServerConfigFunction = async (fieldName, file, metadata, load, error, progress, abort) => {
  
    const upload = new TusUpload(file, {
      endpoint: "/api/user/test",
      // uploadUrl: "/api/user/test",
      // retryDelays: [0, 1000, 3000, 5000],
      chunkSize: CHUNK_SIZE,
      uploadLengthDeferred: false,
      addRequestId: true,
      //自定义存储文件标识符，比如存储在服务端
      // urlStorage
      // 用于特定文件处理逻辑
      //fileReader
      onBeforeRequest: function (req) {
        var xhr = req.getUnderlyingObject()
        xhr.withCredentials = true
      },
      onAfterResponse: function (req, res) {
        var url = req.getURL()
        var value = res.getHeader("X-My-Header")
        console.log(`Request for ${url} responded with ${value}`)
      },
      //自定义文件id
      fingerprint: (file, options) => {
        console.log('自定义文件id', file, options)
        let md5
        const wrapperFile = uploadRef.current?.getFile(fieldName) 
        if(!wrapperFile) {
          md5 = fieldName
        }else {
          md5 = (wrapperFile.getMetadata() as IExtraMetaData).md5
        }
        return Promise.resolve(md5)
      },
      metadata: {
        filename: file.name,
        filetype: file.type
      },
      //@ts-ignore
      //不重试
      onShouldRetry: () => false,
      onError: function(err: Error) {
        error(err.message)
      },
      //上传进度 不用onProgress 因为这个更准确
      onChunkComplete: function(bytesUploaded:number, bytesTotal:number) {
        progress(true, bytesUploaded, bytesTotal)
      },
      onSuccess: function() {
        load(fieldName)
      }
    })
    // Start the upload
    upload.start()
    //findPreviousUploads
    //resumeFromPreviousUpload

    return {
      abort: () => {
        upload.abort()
        abort()
      }
    }
  }

  return (
    filepondSupport && tusSupport ?
      <FilePond 
        files={(props.files || []) as any}
        required
        checkValidity
        ref={uploadRef}
        allowMultiple={true} 
        server={{
          url: '/api/test',
          process,
          // process: {
          //   withCredentials: false,
          //   headers: processHeaders,
          //   timeout: 5000,
          //   onload: processLoad,
          //   onerror: null,
          //   ondata: null
          // },
          revert
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
    :
    null
  )

}

export default Wrapper<FilePondProps>(React.memo(Upload))
