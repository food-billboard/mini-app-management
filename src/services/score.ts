import { request } from '@/utils';

// 积分记录
export const getScoreMemoryList = (params: API_SCORE.GetScoreMemoryListParams) => {
  return request<API_SCORE.GetListResponse<API_SCORE.GetScoreMemoryListData>>('/api/manage/score/memory/obtain', {
    method: 'GET',
    params
  });
};

// 积分
export const postScoreMemory = (data: API_SCORE.PostScoreMemoryParams) => {
  return request('/api/manage/score/memory/obtain', {
    method: 'POST',
    data
  });
};

// 兑换记录
export const getScoreExchangeMemoryList = (params: API_SCORE.GetScoreExchangeMemoryListParams) => {
  return request<API_SCORE.GetListResponse<API_SCORE.GetScoreExchangeMemoryListData>>('/api/manage/score/memory/exchange', {
    method: 'GET',
    params
  });
};

// 兑换
export const postScoreExchangeMemory = (data: API_SCORE.PostScoreExchangeMemoryParams) => {
  return request('/api/manage/score/memory/exchange', {
    method: 'POST',
    data
  });
};

// 核销
export const checkScoreExchangeMemory = (data: API_SCORE.CheckScoreExchangeMemoryParams) => {
  return request('/api/manage/score/memory/exchange', {
    method: 'PUT',
    data
  });
};

// 一级分类列表
export const getScorePrimaryClassifyList = (params: API_SCORE.GetScorePrimaryClassifyListParams) => {
  return request<API_SCORE.GetListResponse<API_SCORE.GetScorePrimaryClassifyListData>>('/api/manage/score/classify/primary', {
    method: 'GET',
    params
  });
};

// 分类列表
export const getScoreClassifyList = (params: API_SCORE.GetScoreClassifyListParams) => {
  return request<API_SCORE.GetListResponse<API_SCORE.GetScoreClassifyListData>>('/api/manage/score/classify', {
    method: 'GET',
    params
  });
};

// 分类修改
export const putScoreClassify = (data: API_SCORE.PutScoreClassifyParams) => {
  return request('/api/manage/score/classify', {
    method: 'PUT',
    data,
  });
};

// 新增分类
export const postScoreClassify = (data: API_SCORE.PostScoreClassifyParams) => {
  return request('/api/manage/score/classify', {
    method: 'POST',
    data 
  });
};

// 删除分类
export const deleteScoreClassify = (params: API_SCORE.DeleteScoreClassifyParams) => {
  return request('/api/manage/score/classify', {
    method: 'DELETE',
    params
  });
};

// 奖品列表
export const getScoreAward = (params: API_SCORE.GetScoreAwardParams) => {
  return request<API_SCORE.GetListResponse<API_SCORE.GetScoreAwardData>>('/api/manage/score/award', {
    method: 'GET',
    params
  });
};

// 奖品修改
export const putScoreAward = (data: API_SCORE.PutScoreAwardParams) => {
  return request('/api/manage/score/award', {
    method: 'PUT',
    data
  });
};

// 新增奖品
export const postScoreAward = (data: API_SCORE.PostScoreAwardParams) => {
  return request('/api/manage/score/award', {
    method: 'POST',
    data
  });
};

// 删除奖品
export const deleteScoreAward = (params: API_SCORE.DeleteScoreAwardParams) => {
  return request('/api/manage/score/award', {
    method: 'DELETE',
    params
  });
};