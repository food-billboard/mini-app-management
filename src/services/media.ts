import { request } from '@/utils'

// 耗时任务列表
export const getLongTimeTaskList = (params: Omit<API_MEDIA.IGetLongTimeTaskListParams, 'app'>) => {
  return request<API_MEDIA.ILongTimeTaskListRes>('/api/customer/task', {
    method: 'GET',
    params: {
      ...params,
      app: 'MANAGE'
    }
  })
}

// 媒体获取
export const getMediaList = (params: API_MEDIA.IGetMediaListParams) => {
  return request<API_MEDIA.IGetMediaListRes>('/api/manage/media', {
    method: 'GET',
    params
  })
}

// 媒体详情获取
export const getMediaDetail = (params: API_MEDIA.IGetMediaDetailParams) => {
  return request<API_MEDIA.IGetMediaListData>('/api/media', {
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

// 视频截取
export const corpVideoChunk = (data: API_MEDIA.ICorpVideoChunk) => {
  return request('/api/media/video/corp', {
    method: "POST",
    data: {
      ...data,
      app: 'MANAGE'
    },
  })
}

// 视频类型转换
export const changeVideoType = (data: API_MEDIA.IChangeVideoType) => {
  return request('/api/media/video/exchange', {
    method: "POST",
    data: {
      ...data,
      app: 'MANAGE'
    },
  })
}

// 视频合并
export const mergeVideoChunk = (data: API_MEDIA.IMergeVideoChunk) => {
  return request('/api/media/video/merge', {
    method: "POST",
    data: {
      ...data,
      app: 'MANAGE'
    },
  })
}

// 创建媒体数据库
export const createMediaDataBase = (data: API_MEDIA.ICreateMediaData) => {
  return request('/api/media/video/create', {
    method: "POST",
    data: {
      ...data,
      app: 'MANAGE'
    },
  })
}