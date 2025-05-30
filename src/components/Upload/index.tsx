import { message } from '@/components/Toast';
import { useDeepCompareEffect, useGetState } from 'ahooks';
import {
  FilePondErrorDescription,
  FilePondFile,
  FilePondInitialFile as IInitFileType,
  ProcessServerConfigFunction,
  RevertServerConfigFunction,
  supported,
} from 'filepond';
import FilePondPluginFilePoster from 'filepond-plugin-file-poster';
import FilePondPluginFileRename from 'filepond-plugin-file-rename';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import { pick } from 'lodash';
import pMap from 'p-map';
import dayjs from 'dayjs'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FilePond, FilePondProps, registerPlugin } from 'react-filepond';
import {
  HttpRequest,
  isSupported,
  PreviousUpload,
  Upload as TusUpload,
} from 'tus-js-client';
// import useDeepCompareEffect from 'use-deep-compare-effect';
import Wrapper from '@/components/WrapperItem';
import { loadFile } from '@/services';
import { withTry } from '@/utils';
import 'filepond-plugin-file-poster/dist/filepond-plugin-file-poster.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond/dist/filepond.min.css';
import china from './locale';
import {
  encryptionFile,
  isObjectId,
  propsValueValid,
  sleep,
  toBase64,
} from './util';

interface IExtraMetaData {
  md5: string;
  objectId: string;
}

export interface IProps extends FilePondProps {
  value: string[];
  onChange: (...args: any[]) => any;
  onLoad?: (id: string) => void;
  expire?: boolean 
}

interface ReactFC<TProps> extends React.FC<TProps> {
  valid: (value: string[], length: number) => boolean;
}

interface IValue extends IInitFileType {
  local?: {
    _id?: string;
    md5?: string;
  };
}

registerPlugin(
  FilePondPluginFileRename,
  FilePondPluginFileValidateSize,
  FilePondPluginFileValidateType,
  FilePondPluginFilePoster,
  FilePondPluginImagePreview,
);

const CHUNK_SIZE = 1024 * 1024 * 5;

const filepondSupport = supported();
const tusSupport = isSupported;

export type FilePondInitialFile = IInitFileType;

const Upload: ReactFC<IProps> = ({
  value: propsValue = [],
  onLoad,
  expire,
  ...props
}) => {
  const uploadRef = useRef<FilePond | null>(null);
  const isMessaging = useRef(false)

  const [value, setValue] = useState<IValue[]>([]);
  const [isUploading, setIsUploading, getIsUploading] = useGetState(true)

  const mergeProcess = useRef({
    current: 0,
    total: 0
  })

  const labelFileProcessing = useMemo(() =>  {
    return isUploading ? '上传中' : '合并中'
  }, [isUploading])

  // 文件添加时对其进行加密
  const onAddFile = async (fileObj: FilePondFile) => {
    if (!isMessaging.current) {
      isMessaging.current = true 
      message.info('文件解析中...', 1, () => {
        isMessaging.current = false 
      });
    }
    if (Object.prototype.toString.call(fileObj.file) !== '[object File]') {
      return true;
    }

    const chunkSize = props.chunkSize || CHUNK_SIZE;

    await sleep(300);

    const [, md5] = await withTry(encryptionFile)(fileObj.file, chunkSize);

    if (!md5) {
      uploadRef.current?.removeFile(fileObj);
      message.info('文件解析错误，请重试');
      return false;
    }
    fileObj.setMetadata('md5', md5);

    return true;
  };

  // 删除方法覆盖
  const revert: RevertServerConfigFunction = async (__, load) => load();

  // 上传
  const process: ProcessServerConfigFunction = async (
    fieldName,
    file,
    metadata,
    load,
    error,
    progress,
    abort,
  ) => {
    const { md5 } = metadata;
    const uploadMetadata: { [key: string]: string | number } = {
      md5,
      size: file.size,
      mime: file.type,
      chunk: CHUNK_SIZE,
      auth: 'PUBLIC',
    };
    if(expire) {
      uploadMetadata.expire = dayjs().add(1, 'day').format('YYYY-MM-DD HH:mm:ss')
    }
    let uploadId: string = '';

    const upload = new TusUpload(file, {
      endpoint: '/api/customer/upload',
      uploadUrl: '/api/customer/upload',
      chunkSize: CHUNK_SIZE,
      uploadLengthDeferred: false,
      addRequestId: true,
      // 自定义存储文件标识符，比如存储在服务端
      // 组织localstorage存储
      urlStorage: {
        findAllUploads: (): Promise<PreviousUpload[]> => Promise.resolve([]),
        findUploadsByFingerprint: (): Promise<PreviousUpload[]> =>
          Promise.resolve([]),
        removeUpload: (): Promise<void> => Promise.resolve(),
        // Returns the URL storage key, which can be used for removing the upload.
        addUpload: (): Promise<string> => Promise.resolve(''),
      },
      onBeforeRequest: function onBeforeRequest(req: HttpRequest) {
        const xhr = req.getUnderlyingObject();
        xhr.withCredentials = true;

        const method = req.getMethod().toLowerCase();
        let resMetadata: any = {};

        if (method === 'head') {
          resMetadata = uploadMetadata;
        } else if (method === 'patch') {
          resMetadata = pick(uploadMetadata, ['md5', 'auth']);
        }

        // 添加额外文件数据请求头
        req.setHeader(
          'Upload-Metadata',
          Object.keys(resMetadata)
            .reduce((acc: string, cur: string) => {
              return `${acc}${cur} ${toBase64(resMetadata[cur])},`;
            }, '')
            .slice(0, -1),
        );
      },
      onAfterResponse: function onAfterResponse(req: any, res: any) {
        const method = req.getMethod().toLowerCase();
        // 查询请求保存id
        if (method === 'head') {
          const id = res.getHeader('Upload-Id');
          uploadId = id;

          setValue((prevValue) => {
            const restValue = prevValue.filter((val) => {
              return typeof val === 'object' && val.local?.['_id'] !== id;
            });
            const newValue = new Array(
              prevValue.length - restValue.length + 1,
            ).fill({
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
                },
              },
            });
            return [...restValue, ...newValue];
          });
        }
        if(method === 'patch') {
          const isUploading = getIsUploading()
          const current = res.getHeader('Upload-Merge-Offset')
          const total = res.getHeader('Upload-Merge-Total')
          mergeProcess.current = {
            current: current || 0,
            total: total || 1
          }
          if(isUploading && total) {
            setIsUploading(!total)
            progress(true, 0, 100)
          }
        }
      },
      // 自定义文件id
      fingerprint: () => {
        let md5Data;
        const wrapperFile = uploadRef.current?.getFile(fieldName);
        if (!wrapperFile) {
          md5Data = fieldName;
        } else {
          md5Data = (wrapperFile.getMetadata() as IExtraMetaData).md5;
        }
        return Promise.resolve(md5Data);
      },
      // @ts-ignore
      // 不重试
      onShouldRetry: () => false,
      onError: function onError(err: Error) {
        setIsUploading(true)
        error(err.message);
        setValue((prevValue) => {
          return prevValue.map((val) => {
            if (val.local?.md5 !== md5) return val;
            return {
              ...val,
              local: {
                ...(val.local as { md5: string }),
                _id: undefined,
              },
            };
          });
        });
      },
      // 上传进度 不用onProgress 因为这个更准确
      onChunkComplete: function onChunkComplete(
        _,
        bytesUploaded: number,
        bytesTotal: number,
      ) {
        const isUploading = getIsUploading()
        if(isUploading) {
          progress(true, bytesUploaded, bytesTotal);
        }else {
          progress(true, mergeProcess.current.current, mergeProcess.current.total)
        }
      },
      onSuccess: function onSuccess() {
        load(fieldName);
        onLoad?.(uploadId);
        setIsUploading(true)
      },
    });

    upload.start();

    return {
      abort: () => {
        upload.abort();
        abort();
      },
    };
  };

  const onremovefile = useCallback(
    (error: FilePondErrorDescription | null, file: FilePondFile) => {
      if (error) return;
      const { source } = file;
      let newValue;
      if (typeof source === 'string') {
        newValue = value.filter((val) => val.source !== source);
      } else {
        const { md5 } = file.getMetadata();
        newValue = value.filter((val) => val.local?.md5 !== md5);
      }
      setValue(newValue);
    },
    [value],
  );

  const isExists: (
    propsData: string[],
    state: IValue[],
    target: string,
  ) => boolean = useCallback((propsData, state, target) => {
    const stateLen = state.filter(
      (item) => item.local?.['_id'] === target,
    ).length;
    const propsLen = propsData.filter((item) => item === target).length;
    return stateLen === propsLen;
  }, []);

  // 获取文件id
  const fetchFileId = useCallback(async (file: string) => {
    if (isObjectId(file)) return file;
    const [err, data] = await withTry(loadFile)({
      load: encodeURIComponent(file),
    });
    if (err) return file;
    return data;
  }, []);

  // 路径转id
  const formatValue = useCallback(
    async (normalValue: string[] | string): Promise<string[]> => {
      const realValue = Array.isArray(normalValue)
        ? normalValue
        : [normalValue];
      return pMap(realValue, async (item) => {
        if (isObjectId(item)) return item;
        return await fetchFileId(item);
      });
    },
    [fetchFileId],
  );

  useEffect(() => {
    formatValue(propsValue).then((newPropsValue) => {
      setValue((prevValue) => {
        const internalList: IValue[] = [...prevValue];
        newPropsValue.forEach((file) => {
          if (!isExists(newPropsValue, prevValue, file)) {
            uploadRef.current?.addFile(file, {
              type: 'local',
            });
            internalList.push({
              source: file,
              options: { type: 'local' },
              local: { _id: file },
            });
          }
        });
        return internalList;
      });
    });
  }, [propsValue, uploadRef]);

  useDeepCompareEffect(() => {
    const validFiles: string[] = [];
    value.forEach((file) => {
      const id = file.local?.['_id'];
      if (id) validFiles.push(id);
    });
    props.onChange?.(validFiles);
  }, [value]);

  return filepondSupport && tusSupport ? (
    <FilePond
      required
      checkValidity
      ref={uploadRef}
      allowMultiple={true}
      server={{
        url: '/api/customer/upload',
        process,
        revert,
      }}
      // @ts-ignore
      maxFileSize={'300MB'}
      instantUpload={false}
      chunkRetryDelays={[1000]}
      chunkUploads
      chunkSize={CHUNK_SIZE}
      itemInsertInterval={200}
      // onaddfile={onAddFile}
      beforeAddFile={onAddFile}
      onremovefile={onremovefile}
      {...china}
      labelFileProcessing={labelFileProcessing}
      {...props}
    />
  ) : null;
};

Upload.valid = propsValueValid;

export { Upload };

export default Wrapper<FilePondProps>(React.memo(Upload));
