import { request } from '@/utils'

// 个人信息
export const GetAdminInfo = () => {
  return request<API_ADMIN.IGetAdminInfoRes>('/api/manage/admin', {
    method: 'GET'
  })
}

// 修改个人信息
export const PutAdminInfo = (data: API_ADMIN.IPutAdminInfoParams) => {
  return request('/api/manage/admin', {
    method: 'Put',
    data
  })
}

// 获取个人发布列表
export const GetAdminIssueList = (params: API_ADMIN.IGetAdminIssueListParams) => {
  return request<API_ADMIN.IGetAdminIssueListRes>('/api/manage/admin/upload', {
    method: 'GET',
    params
  })
}

// 获取个人评论列表
export const GerAdminCommentList = (params: API_ADMIN.IGetAdminCommentListParams) => {
  return request<API_ADMIN.IGetAdminCommentListRes>('/api/manage/admin/comment', {
    method: 'GET',
    params
  })
}

