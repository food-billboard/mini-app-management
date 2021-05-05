import { request } from '@/utils';

export async function query() {
  return request<API.CurrentUser[]>('/api/users');
}

//获取当前用户信息
export async function getUserInfo() {
  return request<API.CurrentUser>('/api/manage/admin');
}

export async function queryNotices(): Promise<any> {
  return request<{ data: API.NoticeIconData[] }>('/api/notices');
}

//用户列表
export const getUserList = (params: API_USER.IGetUserListParams) => {
  return request<API_USER.IGetUserListRes>('/api/manage/user', {
    method: 'GET',
    params
  })
}

//用户粉丝列表
export const getUserFansList = (params: API_USER.IGetUserFansListParams) => {
  return request<API_USER.IGetUserFansListRes>('/api/manage/user/detail/fans', {
    method: 'GET',
    params
  })
}

//用户关注列表
export const getUserAttentionsList = (params: API_USER.IGetUserAttentionsListParams) => {
  return request<API_USER.IGetUserAttentionsListRes>('/api/manage/user/detail/attentions', {
    method: 'GET',
    params
  })
}

//新增用户
export const postUser = (data: API_USER.IPostUserParams) => {
  return request('/api/manage/user', {
    method: 'POST',
    data
  })
}

//修改用户
export const putUser = (data: API_USER.IPutUserParams) => {
  return request('/api/manage/user', {
    method: 'PUT',
    data
  })
}

//删除用户
export const deleteUser = (params: API_USER.IDeleteUserParams) => {
  return request('/api/manage/user', {
    method: 'DELETE',
    params
  })
}

//用户详情
export const getUserDetail = (params: API_USER.IGetUserDetailParams) => {
  return request<API_USER.IGetUserDetailRes>('/api/manage/user/detail', {
    method: 'GET',
    params
  })
}

//用户发布的评论列表
export const getUserCommentList = (params: API_USER.IGetUserCommentListParams) => {
  return request<API_USER.IGetUserCommentListRes>('/api/manage/user/detail/comment', {
    method: 'GET',
    params
  })
}

//删除评论
export const deleteUserComment = (params: API_USER.IDeleteUserCommentParams) => {
  return request('/api/manage/user/detail/comment', {
    method: 'DELETE',
    params
  })
}

//用户的反馈列表
export const getUserFeedbackList = (params: API_USER.IGetFeedbackListParams) => {
  return request<API_USER.IGetFeedbackListRes>('/api/manage/user/detail/feedback', {
    method: 'GET',
    params
  })
}

//修改反馈
export const putUserFeedback = (data: API_USER.IPutFeedbackParams) => {
  return request('/api/manage/user/detail/feedback', {
    method: 'PUT',
    data
  })
}

//删除反馈
export const deleteUserFeedback = (params: API_USER.IDeleteFeedbackParams) => {
  return request('/api/manage/user/detail/feedback', {
    method: 'DELETE',
    params
  })
}

//用户上传的电影列表
export const getUserIssueList = (params: API_USER.IGetUserIssueListParams) => {
  return request<API_USER.IGetUserIssueListRes>('/api/manage/user/detail/issue', {
    method: 'GET',
    params
  })
}

//用户评分的电影列表
export const getUserRateList = (params: API_USER.IGetUserRateListParams) => {
  return request<API_USER.IGetUserRateListRes>('/api/manage/user/detail/rate', {
    method: 'GET',
    params
  })
}