import { request } from '@/utils';

// 获取列表
export const getCurrentMenuList = (params: API.GetEatMenuListParams) => {
  return request<{ data: API.GetEatMenuListData[]; total: number }>('/api/user/eat_what', {
    method: 'GET',
    params,
  });
};

// 新增菜单
export const postCurrentMenu = (data: API.PostEatMenuData) => {
  return request('/api/user/eat_what', {
    method: 'POST',
    data,
  });
};

// 修改菜单
export const putCurrentMenu = (data: API.PutEatMenuData) => {
  return request('/api/user/eat_what', {
    method: 'PUT',
    data,
  });
};

// 删除菜单
export const deleteCurrentMenu = (params: { _id: string }) => {
  return request('/api/user/eat_what', {
    method: 'DELETE',
    params,
  });
};

// 菜单详情
export const getCurrentMenuDetail = (params: { _id: string }) => {
  return request<{ data: API.GetEatMenuListData }>('/api/user/eat_what/detail', {
    method: 'GET',
    params,
  });
};
