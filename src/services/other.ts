import { request } from '@/utils';

// 假期列表
export const getHolidayList = (params: API_OTHER.GetHolidayListParams) => {
  return request('/api/manage/other/holiday', {
    method: 'GET',
    params
  });
};

// 修改假期
export const postHoliday = (data: API_OTHER.PostHolidayParams) => {
  return request('/api/manage/other/holiday', {
    method: 'POST',
    data
  });
};