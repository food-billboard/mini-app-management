import { request } from '@/utils'

// 实例信息列表
export const getInstanceInfoList = () => {

  return request<API_INSTANCE.IGetInstanceInfoRes>('/api/manage/instance/info', {
    method: 'GET'
  })

}

// 删除实例信息
export const deleteInstanceInfo = (params: API_INSTANCE.IDeleteInstanceInfoParams) => {

  return request('/api/manage/instance/info', {
    method: 'DELETE',
    params
  })

}

// 新增实例信息
export const postInstanceInfo = (data: API_INSTANCE.IPostInstanceInfoParams) => {

  return request('/api/manage/instance/info', {
    method: 'POST',
    data
  })

}

// 修改实例信息
export const putInstanceInfo = (data: API_INSTANCE.IPutInstanceInfoParams) => {

  return request('/api/manage/instance/info', {
    method: 'PUT',
    data
  })

}

// 专题列表
export const getInstanceSpecialList = (params: API_INSTANCE.IGetInstanceSpecialParams) => {

  return request<API_INSTANCE.IGetInstanceSpecialRes>('/api/manage/instance/special', {
    method: 'GET',
    params
  })

}

// 删除专题信息
export const deleteInstanceSpecial = (params: API_INSTANCE.IDeleteInstanceSpecialParams) => {

  return request('/api/manage/instance/special', {
    method: 'DELETE',
    params
  })

}

// 新增专题信息
export const postInstanceSpecial = (data: API_INSTANCE.IPostInstanceSpecialParams) => {

  return request('/api/manage/instance/special', {
    method: 'POST',
    data
  })

}

// 修改专题信息
export const putInstanceSpecial = (data: API_INSTANCE.IPutInstanceSpecialParams) => {

  return request('/api/manage/instance/special', {
    method: 'PUT',
    data
  })

}