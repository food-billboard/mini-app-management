import { request } from '@/utils'

//实例信息列表
export const getInstanceInfoList = () => {

  return request<API_INSTANCE.IGetInstanceInfoRes>('/api/manage/instance', {
    method: 'GET'
  })

}

//删除实例信息
export const deleteInstanceInfo = (params: API_INSTANCE.IDeleteInstanceInfoParams) => {

  return request('/api/manage/instance', {
    method: 'DELETE',
    params
  })

}

//新增实例信息
export const postInstanceInfo = (data: API_INSTANCE.IPostInstanceInfoParams) => {

  return request('/api/manage/instance', {
    method: 'POST',
    data
  })

}

//修改实例信息
export const putInstanceInfo = (data: API_INSTANCE.IPutInstanceInfoParams) => {

  return request('/api/manage/instance', {
    method: 'PUT',
    data
  })

}