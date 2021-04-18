import { request } from '@/utils'

//媒体获取
export const getMediaList = (params: API_Media.IGetMediaListParams) => {
  return request<API_Media.IGetMediaListRes>('/api/manage/media', {
    method: 'GET',
    params
  })
}

//媒体删除
export const deleteMedia = (params: API_Media.IDeleteMediaParams) => {
  return request('/api/manage/media', {
    method: 'DELETE',
    params
  })
}

//媒体修改
export const updateMedia = (data: API_Media.IPutMediaParams) => {
  return request('/api/manage/media', {
    method: 'POST',
    data
  })
}

//媒体上传验证
export const getMediaValid = (params: API_Media.IGetMediaValidParams) => {
  return request<API_Media.IGetMediaValidRes>('/api/manage/media/valid', {
    method: 'GET',
    params
  })
}