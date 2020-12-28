import { request } from '@/utils'


//电影列表
export const getMovieList = (params: API_DATA.IGetMovieListParams={}) => {

  return request<API_DATA.IGetMovieListRes>('/api/manage/movie', {
    method: 'GET',
    params
  })

}

//新增电影
export const postMovie = (data: API_DATA.IPostMovieParams) => {

  return request('/api/manage/movie', {
    method: 'POST',
    data
  })

}

//编辑电影
export const putMovie = (data: API_DATA.IPutMovieParams) => {

  return request('/api/manage/movie', {
    method: 'PUT',
    data
  })

}

//编辑电影信息
export const getMovieInfo = (params: API_DATA.IGetMovieInfoParams) => {

  return request<any>('/api/manage/movie/edit', {
    method: 'GET',
    params
  })

}

//删除电影
export const deleteMovie = (params: API_DATA.IDeleteMovieParams) => {
  return request('/api/manage/movie', {
    method: 'DELETE',
    params
  })
}

//电影详情
export const movieDetail = (params: API_DATA.IGetMovieDetailParams) => {

  return request<API_DATA.IGetMovieDetailRes>('/api/manage/movie/detail', {
    method: 'GET',
    params
  })

}

//评论列表
export const getMovieCommentList = (params: API_DATA.IGetMovieCommentParams) => {
  return request<API_DATA.IGetMovieCommentRes>('/api/manage/movie/detail/comment', {
    method: 'GET',
    params
  })
}

//收藏用户列表
export const getStoreUserList = (params: API_DATA.IGetStoreUserListParams) => {
  return request<API_DATA.IGetStoreUserListRes>('/api/manage/movie/detail/user', {
    method: 'GET',
    params
  })
}

//演员信息
export const getActorInfo = (params: API_DATA.IGetActorInfoParams) => {

  return request<API_DATA.IGetActorInfoRes>('/api/manage/movie/detail/info/actor', {
    method: 'GET',
    params
  })

}

//修改演员信息
export const putActotInfo = (data: API_DATA.IPutActorInfoParams) => {
  return request('/api/manage/movie/detail/info/actor', {
    method: 'PUT',
    data
  })
}

//新增演员
export const postActorInfo = (data: API_DATA.IPostActorInfoParams) => {
  return request('/api/manage/movie/detail/info/actor', {
    method: 'POST',
    data
  })
}

//删除演员
export const deleteActorInfo = (params: API_DATA.IDeleteActorParams) => {
  return request('/api/manage/movie/detail/info/actor', {
    method: 'POST',
    params
  })
}

//导演信息
export const getDirectorInfo = (params: API_DATA.IGetDirectorInfoParams) => {
  return request<API_DATA.IGetDirectorInfoRes>('/api/manage/movie/detail/info/director', {
    method: 'GET',
    params
  })
}

//修改导演信息
export const putDirectorInfo = (data: API_DATA.IPutDirectorInfoParams) => {
  return request('/api/manage/movie/detail/info/director', {
    method: 'PUT',
    data
  })
}

//新增导演
export const postDirectorInfo = (data: API_DATA.IPostDirectorInfoParams) => {
  return request('/api/manage/movie/detail/info/director', {
    method: 'POST',
    data
  })
}

//删除导演
export const deleteDirectorInfo = (params: API_DATA.IDeleteDirectorParams) => {
  return request('/api/manage/movie/detail/info/director', {
    method: 'DELETE',
    params
  })
}

//地区信息
export const getDistrictInfo = (params: API_DATA.IGetDistrictInfoParams) => {
  return request<API_DATA.IGetDistrictInfoRes>('/api/manage/movie/detail/info/district', {
    method: 'GET',
    params
  })
}

//修改地区信息
export const putDistrictInfo = (data: API_DATA.IPutDistrictInfoParams) => {
  return request('/api/manage/movie/detail/info/district', {
    method: 'PUT',
    data
  })
}

//新增地区
export const postDistrictInfo = (data: API_DATA.IPostDistrictInfoParams) => {
  return request('/api/manage/movie/detail/info/district', {
    method: 'POST',
    data
  })
}

//删除地区
export const deleteDistrictInfo = (params: API_DATA.IDeleteDistrictParams) => {
  return request('/api/manage/movie/detail/info/district', {
    method: 'DELETE',
    params
  })
}

//语言信息
export const getLanguageInfo = (params: API_DATA.IGetLanguageInfoParams) => {
  return request('/api/manage/movie/detail/info/language', {
    method: 'GET',
    params
  })
}

//修改语言信息
export const putLanguageInfo = (data: API_DATA.IPutLanguageInfoParams) => {
  return request('/api/manage/movie/detail/info/language', {
    method: 'PUT',
    data
  })
}

//新增语言
export const postLanguageInfo = (data: API_DATA.IPostLanguageInfoParams) => {
  return request('/api/manage/movie/detail/info/language', {
    method: 'POST',
    data
  })
}

//删除语言
export const deleteLanguageInfo = (params: API_DATA.IDeleteLanguageParams) => {
  return request('/api/manage/movie/detail/info/language', {
    method: 'DELETE',
    params
  })
}

//分类信息
export const getClassifyInfo = (params: API_DATA.IGetClassifyInfoParams) => {
  return request<API_DATA.IGetClassifyInfoRes>('/api/manage/movie/detail/info/classify', {
    method: 'GET',
    params
  })
}

//修改分类信息
export const putClassifyInfo = (data: API_DATA.IPutClassifyInfoParams) => {
  return request('/api/manage/movie/detail/info/classify', {
    method: 'PUT',
    data
  })
}

//新增分类
export const postClassifyInfo = (data: API_DATA.IPostClassifyInfoParams) => {
  return request('/api/manage/movie/detail/info/classify', {
    method: 'POST',
    data
  })
}

//删除分类
export const deleteClassifyInfo = (params: API_DATA.IDeleteClassifyParams) => {
  return request('/api/manage/movie/detail/info/classify', {
    method: 'DELETE',
    params
  })
}

