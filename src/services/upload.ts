import { request } from '@/utils'

export const deleteFile = (params: Upload.IDeleteParams) => {
  return request('/api/customer/upload', {
    method: 'DELETE',
    params
  })
}