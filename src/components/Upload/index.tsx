import React, { useRef, useState, useEffect } from 'react'
import { message } from 'antd'
import { Upload as TusUpload, isSupported, PreviousUpload, HttpRequest } from 'tus-js-client'
import { supported, FilePondFile, FilePondErrorDescription, RevertServerConfigFunction, ProcessServerConfigFunction, FilePondInitialFile as IInitFileType } from 'filepond'
import { FilePond, registerPlugin, FilePondProps } from 'react-filepond'
import FilePondPluginFileRename from 'filepond-plugin-file-rename'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginFilePoster from 'filepond-plugin-file-poster'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import pick from 'lodash/pick'
import { withTry } from '@/utils'
import Wrapper from '@/components/WrapperItem'
import china from './locale'
import { encryptionFile, sleep, toBase64, propsValueValid, isObjectId } from './util'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-file-poster/dist/filepond-plugin-file-poster.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

interface IExtraMetaData {
  md5: string
  objectId: string
}

interface IProps extends FilePondProps {
  value: Array<string>
  onChange: (...args: any[]) => any
}

interface ReactFC<TProps> extends React.FC<TProps> {
  valid: (value: string[], length: number) => boolean
} 

interface IValue extends IInitFileType {
  local?: {
    _id?: string
    md5?: string
  }
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

export type FilePondInitialFile = IInitFileType

const Upload: ReactFC<IProps> = ({
  value: propsValue=[],
  ...props
}) => {

  const uploadRef = useRef<FilePond | null>(null)

  const initFiles: IValue[] = (Array.isArray(propsValue) ? [] : [propsValue]).filter(isObjectId).map(file => ({ source: file, options: { type: 'local' }, local: { _id: file } }))
  const [ value, setValue ] = useState<IValue[]>(initFiles)
  
  //文件添加时对其进行加密
  const onAddFile = async (error: FilePondErrorDescription | null, fileObj: FilePondFile) => {

    if(!!error || Object.prototype.toString.call(fileObj.file) !== '[object File]') return

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

  //删除方法覆盖
  const revert: RevertServerConfigFunction = async (__, load, _) => load()

  //上传
  const process:ProcessServerConfigFunction = async (fieldName, file, metadata, load, error, progress, abort) => {
    
    const { md5 } = metadata
    const uploadMetadata: { [key: string]: string | number } = {
      md5,
      size: file.size,
      mime: file.type,
      chunk: CHUNK_SIZE,
      auth: 'PUBLIC',
    }

    const upload = new TusUpload(file, {
      endpoint: "/api/customer/upload",
      uploadUrl: "/api/customer/upload",
      chunkSize: CHUNK_SIZE,
      uploadLengthDeferred: false,
      addRequestId: true,
      //自定义存储文件标识符，比如存储在服务端
      //组织localstorage存储
      urlStorage: {
        findAllUploads: (): Promise<PreviousUpload[]> => Promise.resolve([]),
        findUploadsByFingerprint: (_: string): Promise<PreviousUpload[]> => Promise.resolve([]),
        removeUpload: (_: string): Promise<void> => Promise.resolve(),
        // Returns the URL storage key, which can be used for removing the upload.
        addUpload: (_: string, __: PreviousUpload): Promise<string> => Promise.resolve('')
      },
      onBeforeRequest: function (req: HttpRequest) {
        const xhr = req.getUnderlyingObject()
        xhr.withCredentials = true
    
        const method = req.getMethod().toLowerCase()
        let metadata = {}
        
        if(method === 'head') {
          metadata = uploadMetadata
        }else if(method === 'patch') {
          metadata = pick(uploadMetadata, [ 'md5', 'auth' ])
        }

        //添加额外文件数据请求头
        req.setHeader('Upload-Metadata', Object.keys(metadata).reduce((acc: string, cur: string) => {
          acc += `${cur} ${toBase64(metadata[cur])},`
          return acc
        }, '').slice(0, -1))
  
      },
      onAfterResponse: function (req, res) {
        const method = req.getMethod().toLowerCase()
        //查询请求保存id
        if(method === 'head') {
          const id = res.getHeader('Upload-Id')
          setValue([
            ...value.filter(val => {
              return typeof val === 'object' && val.local?._id !== id
            }),
            {
              source: id,
              local: {
                _id: id,
                md5,
              },
              options: {
                type: 'input',
                file: {
                  name: file.name,
                  size: file.size,
                  type: file.type,
                }
              }
            }
          ])
        }
      },
      //自定义文件id
      fingerprint: (file, options) => {
        let md5
        const wrapperFile = uploadRef.current?.getFile(fieldName) 
        if(!wrapperFile) {
          md5 = fieldName
        }else {
          md5 = (wrapperFile.getMetadata() as IExtraMetaData).md5
        }
        return Promise.resolve(md5)
      },
      //@ts-ignore
      //不重试
      onShouldRetry: () => false,
      onError: function(err: Error) {
        error(err.message)
        setValue(value.map(val => {
          if(val.local?.md5 != md5) return val
          return {
            ...val,
            local: {
              ...val.local as { md5: string },
              _id: undefined
            }
          }
        }))
      },
      //上传进度 不用onProgress 因为这个更准确
      onChunkComplete: function(bytesUploaded:number, bytesTotal:number) {
        progress(true, bytesUploaded, bytesTotal)
      },
      onSuccess: function() {
        load(fieldName)
      }
    })

    upload.start()

    return {
      abort: () => {
        upload.abort()
        abort()
      }
    }
  }

  useEffect(() => {
    if(Array.isArray(propsValue) && propsValue.length) {
      propsValue.forEach(file => {
        if(!value.some(internalFile => internalFile.local?._id === file)) {
          uploadRef.current?.addFile(file, {
            type: 'local'
          })
        }
      })
    }
  }, [ propsValue ])

  useEffect(() => {
    let validFiles: string[] = []
    value.forEach(file => {
      const id = file.local?._id
      if(!!id) validFiles.push(id)
    })
    props.onChange && props.onChange(validFiles)
  }, [value])

  return (
    filepondSupport && tusSupport ?
      <FilePond 
        required
        checkValidity
        ref={uploadRef}
        allowMultiple={true} 
        server={{
          url: '/api/customer/upload',
          process,
          revert
        }}
        //@ts-ignore
        maxFileSize={'100MB'}
        instantUpload={false}
        chunkRetryDelays={[1000]}
        chunkUploads
        chunkSize={CHUNK_SIZE}
        itemInsertInterval={200}
        onaddfile={onAddFile}
        {...china}
        {...props}
      />
    :
    null
  )

}

Upload.valid = propsValueValid

export {
  Upload
}

export default Wrapper<FilePondProps>(React.memo(Upload))
