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

// 获取分类列表
export const getCurrentMenuClassifyList = (params: API.GetEatMenuClassifyListParams) => {
  return request<{ data: API.GetEatMenuClassifyListData[]; total: number }>(
    '/api/user/eat_what/classify',
    {
      method: 'GET',
      params,
    },
  );
};

// 新增分类菜单
export const postCurrentMenuClassify = (data: API.PostEatMenuClassifyData) => {
  return request('/api/manage/eat_what/classify', {
    method: 'POST',
    data,
  });
};

// 修改分类菜单
export const putCurrentMenuClassify = (data: API.PutEatMenuClassifyData) => {
  return request('/api/manage/eat_what/classify', {
    method: 'PUT',
    data,
  });
};

// 删除分类菜单
export const deleteCurrentMenuClassify = (params: { _id: string }) => {
  return request('/api/manage/eat_what/classify', {
    method: 'DELETE',
    params,
  });
};

// 菜单分类详情
export const getCurrentMenuClassifyDetail = (params: { _id: string }) => {
  return request<{ data: API.GetEatMenuClassifyListData }>('/api/user/eat_what/classify/detail', {
    method: 'GET',
    params,
  });
};
