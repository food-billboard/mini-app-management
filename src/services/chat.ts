import { request } from '@/utils'

//聊天室列表
export const getRoomList = async (params: API_CHAT.IGetRoomListParams) => {
  return request<API_CHAT.IGetRoomListRes>('/api/manage/chat/room', {
    method: 'GET',
    params
  })
}

//新增聊天室
export const postRoom = async (data: API_CHAT.IPostRoomParams) => {
  return request('/api/manage/chat/room', {
    method: 'POST',
    data
  })
}

//修改聊天室
export const putRoom = async (data: API_CHAT.IPutRoomParams) => {
  return request('/api/manage/chat/room', {
    method: 'PUT',
    data
  })
}

//删除聊天室
export const deleteRoom = async (params: API_CHAT.IDeleteRoomParams) => {
  return request('/api/manage/chat/room', {
    method: 'DELETE',
    params
  })
}

//消息列表
export const getMessageList = async (params: API_CHAT.IGetMessageListParams) => {
  return request<API_CHAT.IGetMessageRes>('/api/manage/chat/message', {
    method: 'GET',
    params
  })
}

//发送消息
export const postMessage = async (data: API_CHAT.IPostMessageParams) => {
  return request('/api/manage/chat/message', {
    method: 'POST',
    data
  })
}

//删除消息
export const deleteMessage = async (params: API_CHAT.IDeleteMessageParams) => {
  return request('/api/manage/chat/message', {
    method: 'DELETE',
    params
  })
}

//成员列表
export const getMemberList = async (params: API_CHAT.IGetMemberListParams) => {
  return request<API_CHAT.IGetMemberListRes>('/api/manage/chat/member', {
    method: 'GET',
    params
  })
}

//新增成员
export const postMember = async (data: API_CHAT.IPostMemberParams) => {
  return request('/api/manage/chat/member', {
    method: 'POST',
    data
  })
}

//删除成员
export const deleteMember = async (params: API_CHAT.IDeleteMemberParams) => {
  return request('/api/manage/chat/member', {
    method: 'DELETE',
    params
  })
}

