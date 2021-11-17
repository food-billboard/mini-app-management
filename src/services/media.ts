import { request } from '@/utils'

// 媒体获取
export const getMediaList = (params: API_MEDIA.IGetMediaListParams) => {
  return request<API_MEDIA.IGetMediaListRes>('/api/manage/media', {
    method: 'GET',
    params
  })
}

// 媒体删除
export const deleteMedia = (params: API_MEDIA.IDeleteMediaParams) => {
  return request('/api/manage/media', {
    method: 'DELETE',
    params
  })
}

// 媒体修改
export const updateMedia = (data: API_MEDIA.IPutMediaParams) => {
  return request('/api/manage/media', {
    method: 'PUT',
    data
  })
}

// 媒体上传验证
export const getMediaValid = (params: API_MEDIA.IGetMediaValidParams) => {
  return request<API_MEDIA.IGetMediaValidRes>('/api/manage/media/valid', {
    method: 'GET',
    params
  })
}

// 海报生成
export const generateVideoPoster = (data: API_MEDIA.IPutVideoPoster) => {
  return request('/api/media/video/poster', {
    method: "PUT",
    data
  })
}