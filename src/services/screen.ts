import { request } from '@/utils'

// mock数据列表
export const getScreenMockList = async (params: API_SCREEN.IGetScreenMockParams) => {
  return request<API_SCREEN.IGetScreenMockRes>('/api/manage/screen/mock', {
    method: 'GET',
    params
  })
}

// mock数据新增
export const postScreenMock = async (data: API_SCREEN.IPostScreenMockDataParams) => {
  return request('/api/manage/screen/mock', {
    method: 'POST',
    data
  })
}

// mock数据删除
export const deleteScreenMock = async (params: { _id: string }) => {
  return request('/api/manage/screen/mock', {
    method: 'DELETE',
    params
  })
}

// mock数据修改
export const updateScreenMock = async (data: API_SCREEN.IPutScreenMockDataParams) => {
  return request('/api/manage/screen/mock', {
    method: 'PUT',
    data
  })
}

// 大屏列表
export const getScreenList = async (params: API_SCREEN.IGetScreenListParams) => {
  return request<API_SCREEN.IGetScreenListRes>('/api/manage/screen/list', {
    method: 'GET',
    params,
  })
}

// 大屏删除
export const deleteScreenList = async (params: { _id: string | string[] }) => {
  return request('/api/manage/screen/list', {
    method: 'DELETE',
    params
  })
}

// 大屏模板导入
export const leadInScreen = async (data: API_SCREEN.ILeadInScreenParams) => {
  return request('/api/screen/pre/leadin', {
    method: 'POST',
    data
  })
}

// 大屏模板导出
export const exportScreen = async (data: API_SCREEN.ILeadInScreenParams) => {
  return request('/api/screen/pre/export', {
    method: 'POST',
    data,
    responseType: 'arraybuffer',
    origin: true 
  })
}

// 模板列表
export const getScreenModelList = async (params: API_SCREEN.IGetScreenListParams) => {
  return request<API_SCREEN.IGetScreenListRes>('/api/manage/screen/model', {
    method: 'GET',
    params,
  })
}

// 模板删除
export const deleteScreenModel = async (params: { _id: string | string[] }) => {
  return request('/api/manage/screen/model', {
    method: 'DELETE',
    params
  })
}