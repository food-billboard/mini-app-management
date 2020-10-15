import { request } from '@/utils';

export async function query() {
  return request<API.CurrentUser[]>('/api/users');
}

//获取当前用户信息
export async function queryCurrent() {
  return request<API.CurrentUser>('/api/currentUser');
}

export async function queryNotices(): Promise<any> {
  return request<{ data: API.NoticeIconData[] }>('/api/notices');
}
