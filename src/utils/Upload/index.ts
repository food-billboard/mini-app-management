import { Upload } from 'chunk-file-upload';
import { nanoid } from 'nanoid';
import mime from 'mime';
import type { UploadFile, RcFile } from 'antd/es/upload/interface';
import {
  checkUploadFile,
  uploadFile,
  DEFAULT_CHECK_UPLOAD_PARAMS,
  getUploadFile,
} from '@/services';

const UPLOAD_INSTANCE = new Upload();

export function exitDataFn(onResponse: Function) {
  return async function (params: {
    filename: string;
    md5: string;
    suffix: string;
    size: number;
    chunkSize: number;
    chunksLength: number;
  }) {
    const { size, suffix, md5, chunkSize } = params;
    const data = await checkUploadFile({
      auth: 'PUBLIC',
      mime: suffix,
      chunk: chunkSize,
      md5,
      size,
      name: md5,
    });
    onResponse(
      data,
      `${process.env.REQUEST_API}/static/${
        suffix.startsWith('image') ? 'image' : 'video'
      }/${md5}.${mime.getExtension(suffix)}`,
    );
    return data;
  };
}

export function uploadFn() {
  return async function (data: any) {
    let response: any = {};
    const md5 = data.get('md5');
    const file = data.get('file');
    const index = data.get('index') as any;
    response = await uploadFile({
      md5: md5 as string,
      file: file as Blob,
      offset: (index as number) * DEFAULT_CHECK_UPLOAD_PARAMS.chunk,
    });
    return response;
  };
}

export function beforeDelete(target: UploadFile) {
  try {
    UPLOAD_INSTANCE.cancel(target.response.task.name);
    URL.revokeObjectURL(target.preview || '');
  } catch (err) {}
  return true;
}

// change
// percent progress
export function UploadImage(
  value: UploadFile,
  {
    onChange,
  }: {
    onChange?: (value: UploadFile) => void;
  },
) {
  const { originFileObj } = value;
  value.response = value.response || {};

  const [name] = UPLOAD_INSTANCE.add({
    file: {
      file: originFileObj as File,
    },
    request: {
      exitDataFn: exitDataFn(function (data: any) {
        value.response.id = data._id;
      }),
      uploadFn: uploadFn(),
      callback(err) {
        if (err) {
          value.status = 'error';
          onChange?.(value);
        } else {
          getUploadFile({ _id: value.response.id })
            .then((data: any) => {
              const [target = {}] = data.list || [];
              value.url = target.src || '';
              value.status = 'done';
            })
            .catch(() => {
              value.status = 'error';
            })
            .then(() => {
              onChange?.(value);
            });
        }
      },
    },
  });

  if (!name) {
    value.status = 'error';
  } else {
    UPLOAD_INSTANCE.deal(name);
    const task = UPLOAD_INSTANCE.getTask(name);
    value.response.task = task;
  }
}

export const createBaseUploadFile: (file: RcFile) => UploadFile = (file) => {
  return {
    uid: file.uid,
    size: file.size,
    name: file.name,
    fileName: file.name,
    lastModified: file.lastModified,
    lastModifiedDate: file.lastModifiedDate,
    status: 'uploading',
    percent: 0,
    // thumbUrl?: string;
    originFileObj: file,
  };
};

export const createUploadedFile = (url: string) => {
  const name = url.substring(url.lastIndexOf('\\') + 1);
  return {
    uid: nanoid(),
    name,
    fileName: name,
    status: 'done',
    url,
  };
};

// 文件上传
export async function upload(file: File) {
  let fileId: string = '';
  let filePath: string = '';

  return new Promise((resolve, reject) => {
    const [name] = UPLOAD_INSTANCE.add({
      file: {
        file,
      },
      request: {
        exitDataFn: exitDataFn(function (data: any, path: string) {
          fileId = data._id;
          filePath = path;
        }),
        uploadFn: uploadFn(),
        callback(err) {
          if (err) {
            reject(err);
          } else {
            resolve({
              id: fileId,
              filePath,
            });
          }
        },
      },
    });

    if (!name) {
      return Promise.reject();
    } else {
      UPLOAD_INSTANCE.deal(name);
    }
  })
    .then(() => {
      UPLOAD_INSTANCE.dispose();
      return {
        id: fileId,
        filePath,
      };
    })
    .catch((err) => {
      UPLOAD_INSTANCE.dispose();
      return Promise.reject(err);
    });
}

export function fileUpload(config: {
  beforeUpload?: () => boolean;
  upload?: (file: File) => void;
  uploadEnd?: (fileId: string) => any;
  callback?: () => void;
  accept: string;
}) {
  const { beforeUpload, upload: configUpload, uploadEnd, accept, callback } = config;
  if (beforeUpload && !beforeUpload()) return;
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('accept', accept);
  input.addEventListener('change', (e: any) => {
    const file = e.target?.files[0];
    if (file) {
      configUpload?.(file);
      upload(file)
        .then(({ filePath }: any) => {
          return uploadEnd?.(filePath);
        })
        .then(() => {
          callback?.();
        });
    }
  });
  input.click();
}
