import { merge } from 'lodash'
import { request } from '@/utils'
import { encoder } from '../utils/string2arraybuffer';

export const deleteFile = (params: Upload.IDeleteParams) => {
  return request('/api/customer/upload', {
    method: 'DELETE',
    params
  })
}

export const loadFile = (params: Upload.ILooadParams) => {
  return request(`/api/customer/upload?${Object.entries(params).reduce((acc, cur) => {
    const [ key, value ] = cur
    const nextData = `${key}=${value}&`
    return `${acc}${nextData}`
  }, '').slice(0, -1)}`, {
    method: 'GET'
  })
}

// 下面是代码形式的文件上传

export const DEFAULT_CHECK_UPLOAD_PARAMS = {
  auth: 'PUBLIC',
  chunk: 1024 * 1024 * 5,
};

function string2Base64(str: string) {
  return encoder(str);
}

function mergeMetaData(params: { [key: string]: any }) {
  const data = Object.entries(params).reduce((acc, cur) => {
    const [key, value] = cur;
    const realValue = typeof value === 'string' ? value : value.toString();
    acc.push(`${key} ${string2Base64(realValue)}`);
    return acc;
  }, [] as any);
  return {
    'Upload-Metadata': data.join(','),
  };
}

export const checkUploadFile = (
  params: Partial<Upload.ICheckUploadFileParams>,
) => {
  const newParams = merge({}, DEFAULT_CHECK_UPLOAD_PARAMS, params);
  return request<{
    headers: Upload.ICheckUploadFileRes;
    [key: string]: any;
  }>('/api/customer/upload', {
    method: 'HEAD',
    headers: merge({}, { 'Tus-Resumable': '1.0.0' }, mergeMetaData(newParams)),
    origin: true,
    mis: false,
  }).then((data) => {
    const { headers } = data as any;
    const offset = headers['upload-offset'] ?? headers['Upload-Offset'];
    const fileId = headers['upload-id'] ?? headers['Upload-Id'];
    return {
      data: offset,
      _id: fileId,
    };
  });
};

export const uploadFile = async (params: Upload.IUploadParams) => {
  const { file, offset, ...nextParams } = params;
  return request<{ headers: { 'Upload-Offset': number }; [key: string]: any }>(
    '/api/customer/upload/weapp',
    {
      method: 'POST',
      headers: merge(
        {},
        {
          'Tus-Resumable': '1.0.0',
          'Upload-Offset': offset.toString(),
          'content-type': 'application/offset+octet-stream',
        },
        mergeMetaData(nextParams),
      ),
      data: file,
      origin: true,
      mis: false,
    },
  ).then((data) => {
    const { headers } = data as any;
    const nextOffset = headers['upload-offset'] ?? headers['Upload-Offset'];
    return {
      data: nextOffset,
    };
  });
};

export const getUploadFile = (params: Upload.IGetUploadParams) => {
  return request('/api/manage/media', {
    method: 'GET',
    params: {
      type: 0,
      ...params,
    },
    mis: false,
  });
};