import { request } from '@/utils';

// 仓库列表
export const getRaspberryList = () => {
  return request<API_RASPBERRY.GetListRes>('/api/manage/raspberry/package', {
    method: 'GET',
  });
};

// 删除仓库
export const deleteRaspberry = (params: API_RASPBERRY.DeleteDataParams) => {
  return request('/api/manage/raspberry/package', {
    method: 'DELETE',
    params,
  });
};

// 重新构建仓库
export const rebuildRaspberry = (data: API_RASPBERRY.RebuildParams) => {
  return request('/api/manage/raspberry/package/build', {
    method: 'PUT',
    data,
  });
};

// 新增仓库
export const postRaspberry = (data: API_RASPBERRY.PostDataParams) => {
  return request('/api/manage/raspberry/package', {
    method: 'POST',
    data,
  });
};

// 修改仓库
export const putRaspberry = (data: API_RASPBERRY.PutDataParams) => {
  return request('/api/manage/raspberry/package', {
    method: 'PUT',
    data,
  });
};
