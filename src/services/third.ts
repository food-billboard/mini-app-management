import { request } from '@/utils'

// 获取第三方接口
export const getThirdList = (params: API_THIRD.GetThirdListParams) => {
  return request<API_THIRD.GetThirdListRes>('/api/third', {
    method: 'GET',
    params
  })
}

// 修改第三方接口
export const putThirdData = (data: API_THIRD.PutThirdDataParams) => {
  return request('/api/third', {
    method: 'PUT',
    data
  })
}

// 新增第三方接口
export const postThirdData = (data: API_THIRD.PostThirdDataParams) => {
  return request('/api/third', {
    method: 'POST',
    data
  })
}

// 删除第三方接口
export const deleteThirdData = (params: API_THIRD.DeleteThirdDataParams) => {
  return request('/api/third', {
    method: 'DELETE',
    params
  })
}

// 获取第三方接口数据
export const getThirdData = (data: API_THIRD.GetThirdDataParams) => {
  return request('/api/third/request', {
    method: 'POST',
    data
  })
}

