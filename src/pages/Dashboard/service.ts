import { request } from '@/utils'
import { identity, pickBy } from 'lodash'

export interface INavUserCount {
  total: number
  week_add: number
  day_add: number
  day_add_count: number
}

export interface INavVisitDay extends Pick<INavUserCount, 'total'> {
  day_count: number
  data: IDataStatisticsData[]
} 

export interface INavDataCount extends Pick<INavUserCount & INavVisitDay, 'total' | 'week_add' | 'day_add' | 'day_count' | 'data'> {}

export interface INavFeedbackCount extends Pick<INavUserCount, 'total' | 'week_add' | 'day_add' | 'day_add_count'> {
  transform_count: number
}

export interface IGetNavCardList {
  use_count: INavUserCount
  visit_day: INavVisitDay
  data_count: INavDataCount
  feedback_count: INavFeedbackCount
}

export interface IDataStatisticsData {
  day: string
  count: number
}

export interface IDataStatisticsRank {
  name: string
  count: number
  _id: string
}

export type IUserStatisticsData = IDataStatisticsData

export interface IUserStatisticsRank extends IDataStatisticsRank {
  hot: number
}

export type IVisitStatisticsData = IDataStatisticsData

export interface IKyewordStatisticsTotalChart extends IDataStatisticsData {}

export interface IKyewordStatisticsAverageChart extends IKyewordStatisticsTotalChart {}

export interface IKyewordStatisticsData {
  _id: string
  key_word: string
  count: number
}

export interface IGetDataTypeStatisticsData {
  
}

export interface IGetDataStatisticsList {
  data: IDataStatisticsData[]
  rank: IDataStatisticsRank[]
}

export interface IGetUserStatisticsList {
  data: IUserStatisticsData[]
  rank: IUserStatisticsRank[]
}

export type IGetVisitStatisticsList = IVisitStatisticsData[]

export interface IGetKeywordStatisticsList {
  total: number
  average: number
  count_total_day: number
  count_average_day: number
  total_chart: IKyewordStatisticsTotalChart[]
  average_chart: IKyewordStatisticsAverageChart[]
  data: IKyewordStatisticsData[]
}

export type IGetDataTypeStatisticsList = ({ value: number } & Pick<IDataStatisticsRank, '_id' | 'name'>)[]

// 导航卡
export const getNavCardList = () => {
  return request<IGetNavCardList>('/api/manage/dashboard/nav', {
    method: 'GET'
  })
}

// 电影上传数据
export const getDataStatisticsList = (params: {
  date_type?: 'year' | 'month' | 'week' | 'day'
  start_date?: string
  end_date?: string
}={}) => {
  return request<IGetDataStatisticsList>('/api/manage/dashboard/statistics/movie', {
    method: 'GET',
    params: pickBy(params, identity)
  })
}

// 注册用户数据
export const getUserStatisticsList = (params: {
  date_type?: 'year' | 'month' | 'week' | 'day'
  start_date?: string
  end_date?: string
}={}) => {
  return request<IGetUserStatisticsList>('/api/manage/dashboard/statistics/user', {
    method: 'GET',
    params: pickBy(params, identity)
  })
}

// 用户活跃数据
export const getVisitStatisticsList = (params: {
  date_type?: 'year' | 'month' | 'week' | 'day'
  start_date?: string
  end_date?: string
}={}) => {
  return request<IGetVisitStatisticsList>('/api/manage/dashboard/statistics/visit', {
    method: 'GET',
    params: pickBy(params, identity)
  })
}

// 关键词搜索数据
export const getKeywordStatisticsList = (params: {
  currPage?: number
  pageSize?: number
  sort?: string
}={}) => {
  return request<IGetKeywordStatisticsList>('/api/manage/dashboard/search/keyword', {
    method: 'GET',
    params: pickBy(params, identity)
  })
}

// 电影分类数据
export const getDataTypeStatisticsList = () => {
  return request<IGetDataTypeStatisticsList>('/api/manage/dashboard/search/type', {
    method: 'GET'
  })
}