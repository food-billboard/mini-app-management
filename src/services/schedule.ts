import { request } from '@/utils';

// 获取定时任务列表
export async function getScheduleList() {
  return request<API_SCHEDULE.IGetScheduleListData[]>('/api/manage/schedule', {
    method: 'GET'
  });
}

// 修改定时任务时间
export async function putScheduleDealTime(data: API_SCHEDULE.IPutScheduleTimeParams) {
  return request('/api/manage/schedule/time', {
    method: 'PUT',
    data
  });
}

// 重新启动定时任务
export async function restartScheduleDeal(data: API_SCHEDULE.IRestartScheduleDealParams) {
  return request('/api/manage/schedule', {
    method: 'PUT',
    data
  });
}

// 取消定时任务执行
export async function cancelScheduleDeal(params: API_SCHEDULE.ICancelScheduleDealParams) {
  return request('/api/manage/schedule', {
    method: 'DELETE',
    params
  });
}

// 立即执行定时任务
export async function invokeScheduleDeal(data: API_SCHEDULE.IPostScheduleDealParams) {
  return request('/api/manage/schedule', {
    method: 'POST',
    data
  });
}
