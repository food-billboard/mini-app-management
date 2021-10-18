import { request } from '@/utils'

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