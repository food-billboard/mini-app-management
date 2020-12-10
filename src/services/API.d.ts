declare namespace API {
  export interface CurrentUser {
    avatar?: string;
    name?: string;
    title?: string;
    group?: string;
    signature?: string;
    tags?: {
      key: string;
      label: string;
    }[];
    userid?: string;
    access?: 'user' | 'guest' | 'admin';
    unreadCount?: number;
  }

  export interface LoginStateType {
    status?: 'ok' | 'error';
    type?: string;
  }

  export interface NoticeIconData {
    id: string;
    key: string;
    avatar: string;
    title: string;
    datetime: string;
    type: string;
    read?: boolean;
    description: string;
    clickClose?: boolean;
    extra: any;
    status: string;
  }

}

declare namespace API_USER {

  export enum UserRole {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    DEVELOPMENT = "DEVELOPMENT",
    SUB_DEVELOPMENT = "SUB_DEVELOPMENT",
    CUSTOMER = "CUSTOMER",
    USER = "USER"
  }

  export enum UserStatus {
    SIGNIN = "SIGNIN",
    SIGNOUT = "SIGNOUT",
    FREEZE = "FREEZE"
  }

  export interface IGetUserListParams {
    currPage?: number
    pageSize?: number
    start_date?: string
    end_date?: string
    role?: keyof typeof UserRole
    status?: keyof typeof API.UserStatus
    content?: string
  }

  export interface IGetUserListRes {
    total: number
    list: Array<IGetUserListResData>
  }

  export interface IGetUserListResData {
    _id: string
    hot: number
    fans_count: number
    issue_count: number
    comment_count: number
    store_count: number
    attentions_count: number
    username: string
    mobile: number
    email: string
    roles: keyof typeof UserRole
    createdAt: string
    updatedAt: string
    status: keyof typeof UserStatus
  }

  export interface IPostUserParams {
    mobile: number
    password: string
    email: string
    username: string
    avatar: string
    description: string
    role: keyof typeof UserRole
  }

  export interface IPUTUserParams extends IPostUserParams {
    _id: string
  }

  export interface IDeleteUserParams extends Pick<IPUTUserParams, '_id'> {}

  export interface IGetUserDetailParams extends IDeleteUserParams {}

  export interface IGetUserDetailRes extends IGetUserListResData {}

  export interface IDeleteUserCommentParams extends IGetUserListResData {}

  export type TSourceType = "comment" | "movie"

  export interface IGetUserCommentListParams extends Exclude<IGetUserListParams, 'role' | 'status' | 'content'> {
    _id: string
    source_type?: TSourceType
    like?: 1 | -1
    comment?: 1 | -1
  }

  export interface ICommentData {
    _id: string
    user_info: {
      _id: string
      username: string
    }
    createdAt: string
    updatedAt: string
    sub_comments: number
    total_like: number
    source: string
    source_type: TSourceType
    content: {
      text: string
      image: Array<string>
      video: Array<string>
    }
  }

  export interface IGetUserCommentListRes {
    total: number
    list: ICommentData[]
  }

  export type TFeedbackStatus = "DEALING" | "DEAL"

  export interface IGetFeedbackListParams extends Exclude<IGetUserListParams, 'role' | 'status' | 'content'> {
    status?: TFeedbackStatus
  }

  export interface IGetFeedbackData {
    _id: string
    user_info: {
      _id: string
      username: string
    }
    createdAt: string
    updatedAt: string
    status: TFeedbackStatus
    content: {
      text: string
      image: string[]
      image: string[]
    }
  }

  export interface IGetFeedbackListRes {
    total: number
    list: Array<IGetFeedbackData>
  }

  export interface IPutFeedbackParams {
    _id: string
    description: string
    status: TFeedbackStatus
  }

  export interface IDeleteFeedbackParams extends IDeleteUserParams {}

  export interface IGetUserIssueListParams extends Exclude<IGetFeedbackListParams, 'status'> {
    status?: API_DATA.IDataStatus
  }

  export interface IGetUserIssueData {
    _id: string
    name: string
    author: {
      _id: string
      username: string
    }
    createdAt: string
    updatedAt: string
    glance: number
    hot: number
    rate_person: number
    total_rate: number
    status: API_DATA.IDataStatus
    comment_count: number
    tag_count: number
    barrage_count: number
  }

  export interface IGetUserIssueListRes {
    total: number
    list: IGetUserIssueData[]
  } 

  export interface IGetUserRateData {
    _id: string
    name: string
    author_rate: number
    rate_person: number
    total_rate: number
    source_type: API_DATA.IDataSourceType
  }

  export interface IGetUserRateListParams extends Exclude<IGetUserIssueListParams, 'status'> {
    value: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  }

  export interface IGetUserRateListRes {
    total: number
    list: Array<{
      value: number
      createdAt: string
      movie: IGetUserRateData
    }>
  }

}

declare namespace API_DATA {

  export type IDataStatus = "COMPLETE" | "NOT_VERIFY" | "VERIFY"

  export type IDataSourceType = "ORIGIN" | "USER" 

  export interface IGetMovieListParams {
    currPage?: number
    pageSize?: number
    content?: string
    classify?: 1 | -1
    status?: "VERIFY" | "COMPLETE" | "NOT_VERIFY"
    source_type?: 'ORIGIN' | 'USER'
    start_date?: string
    end_date?: string
  }

  export interface IGetMovieData {
    _id: string
    name: string
    author: {
      _id: string
      username: string
    }
    createdAt: string
    updatedAt: string
    glance: number
    hot: number
    rate_person: number
    total_rate: number
    source_type: IDataSourceType
    stauts: IDataStatus
    comment_count: number
    tag_count: number
    barrage_count: number
  }

  export interface IGetMovieListRes {
    total: number
    list: IGetMovieData[]
  }

  export interface IPostMovieParams {
    video: string
    poster: string
    actor: Array<string>
    director: string[]
    district: string[]
    language: string[]
    classify: string[]
    name: string
    screen_time: string
    description: string
    author_rate: number
    alias: string[]
    images: [string, string, string, string, string, string]
  }
  
  export interface IPutMovieParams extends IPostMovieParams {
    _id: string
  }

  export interface IDeleteMovieParams {
    _id: string
  }

  export interface IGetMovieDetailParams {
    _id: string
  }

  export interface IGetMovieDetailRes extends IGetMovieData {
    classify: Array<string>
    images: string[]
    poster: string
    video: string
  }

  export interface IGetMovieCommentParams extends Pick<IGetMovieListParams, 'currPage' | 'pageSize' | 'start_date' | 'end_date'> {
    _id: string
    hot?: 1 | -1
    time?: 1 | -1
    comment?: 1 | -1
  }

  export interface IGetMovieCommentRes {
    total: number
    list: {
      _id: string
      user_info: {
        _id: string
        username: string
      }
      createdAt: string
      updatedAt: string
      comment_count: number
      like_person_count: number
      total_like: number
      content: {
        text: string
        image: string[]
        video: string[]
      }
    }[]
  }

  export interface IGetStoreUserListParams extends Exclude<IGetMovieCommentParams, 'hot' | 'time' | 'comment'> {
    status?: API_USER.UserStatus
    roles?: keyof typeof API_USER.UserRole
  }

  export interface IGetStoreUserListRes {
    total: number
    list: {
      _id: string
      username: string
      mobile: number
      email: string
      hot: number
      createdAt: string
      updatedAt: string
      status: API_USER.UserStatus
      roles: keyof typeof API_USER.UserRole
      glance_date: string
      movie_name: string
      issue_count: number
      fans_count: number
      attentions_count: number
    }[]
  }

  export interface IGetActorInfoParams {
    _id: string
  }

  export interface IGetActorInfoRes {
    _id: string
    another_name: string
    name: string
    createdAt: string
    updatedAt: string
    avatar: string
    source_type: IDataSourceType
  }

  export interface IPutActorInfoParams extends IPostActorInfoParams {
    _id: string
  }

  export interface IPostActorInfoParams {
    avatar: string
    alias: string
    name: string
  }

  export interface IDeleteActorParams extends IGetActorInfoParams {}

  export interface IGetDirectorInfoParams extends IGetActorInfoParams {}

  export interface IGetDirectorInfoRes extends IGetActorInfoRes {}

  export interface IPutDirectorInfoParams extends IPostDirectorInfoParams {
    _id: string
  }

  export interface IPostDirectorInfoParams extends IPostActorInfoParams {}

  export interface IDeleteDirectorParams extends IGetDirectorInfoParams {}

  export interface IGetDistrictInfoParams extends IGetActorInfoParams {}

  export interface IGetDistrictInfoRes extends Exclude<IGetActorInfoRes, 'avatar' | 'another_name'> {}

  export interface IPutDistrictInfoParams extends IPostDistrictInfoParams {
    _id: string
  }

  export interface IPostDistrictInfoParams {
    name: string
  }

  export interface IDeleteDistrictParams extends IGetDirectorInfoParams {}

  export interface IGetLanguageInfoParams extends IGetActorInfoParams {}

  export interface IGetLanguageInfoRes extends IGetDistrictInfoRes {}

  export interface IPutLanguageInfoParams extends IPutDistrictInfoParams {}

  export interface IPostLanguageInfoParams extends IPostDistrictInfoParams {}

  export interface IDeleteLanguageParams extends IGetDirectorInfoParams {}

  export interface IGetClassifyInfoParams extends IGetActorInfoParams {}

  export interface IGetClassifyInfoRes {
    _id: string
    glance: number
    name: string
    createdAt: string
    updatedAt: string
    icon: string
    source_type: IDataSourceType
  }

  export interface IPutClassifyInfoParams extends IPostClassifyInfoParams {
    _id: string
  }

  export interface IPostClassifyInfoParams {
    name: string
    icon: string
  }

  export interface IDeleteClassifyParams extends IGetDirectorInfoParams {}

}

declare namespace API_ADMIN {
  export interface IGetAdminInfoRes {
    _id: string
    hot: number
    fans: number
    issue: number
    comment: number
    store: number
    attentions: number
    username: string
    mobile: number
    email: string
    roles: keyof typeof API_USER.API_USER
    createdAt: string
    updatedAt: string
  }

  export interface IPutAdminInfoParams {
    username: string
    avatar: string
    description: string
  }

  export interface IGetAdminIssueListParams {
    currPage?: number
    pageSize?: number
  }

  export interface IGetAdminCommentListParams extends IGetAdminIssueListParams {
    like?: 1 | -1
    comment?: 1 | -1
  }

  export interface IGetAdminIssueListRes {
    _id: string
    name: string
    reatedAt: string
    updatedAt: string
    glance: number
    hot: number
    rate_person: number
    total_rate: number
    status: API_DATA.IDataStatus
    barrage_count: number
    tag_count: number
    comment_count: number
  }

  export interface IGetAdminCommentData {
    _id: string
    createdAt: string
    updatedAt: string
    sub_comments: number
    total_like: number
    source: string
    source_type: API_ADMIN.TSourceType
    content: {
      text: string
      image: string[]
      video: string[]
    }
  }

  export interface IGetAdminCommentListRes {
    total: number
    list: Array<IGetAdminCommentData>
  }

}

declare namespace Upload {

  export interface IDeleteParams {
    _id: string
  }

}