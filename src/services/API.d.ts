declare namespace API {
  export type EatMenuType = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'NIGHT_SNACK';
  export type EatFoodType = 'MEAT' | 'VEGETABLE' | 'SOUP' | 'OTHER';

  export type GetEatMenuListParams = Partial<{
    content: string;
    date: string;
    menu_type: MenuType;
    currPage: number;
    pageSize: number;
  }>;

  export type GetEatMenuListData = {
    title: string;
    description: string;
    classify: string;
    classify_description: string;
    content: string;
    date: string;
    menu_type: MenuType;
    createdAt: string;
    updateAt: string;
    _id: string;
  };

  export type PostEatMenuData = Pick<GetMenuListData, 'date' | 'description' | 'classify'>;

  export type PutEatMenuData = PostMenuData & {
    _id: string;
  };

  export type GetEatMenuClassifyListParams = Partial<{
    content: string;
    date: string;
    menu_type: MenuType;
    currPage: number;
    pageSize: number;
  }>;

  export type GetEatMenuClassifyListData = {
    title: string;
    description: string;
    content: string;
    date: string;
    menu_type: MenuType;
    food_type: EatFoodType;
    createdAt: string;
    updateAt: string;
    _id: string;
  };

  export type PostEatMenuClassifyData = Pick<
    GetMenuListData,
    'title' | 'description' | 'content'
  > & {
    menu_type: EatMenuType[];
  };

  export type PutEatMenuClassifyData = PostMenuClassifyData & {
    _id: string;
  };

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
    SUPER_ADMIN = 'SUPER_ADMIN',
    ADMIN = 'ADMIN',
    DEVELOPMENT = 'DEVELOPMENT',
    SUB_DEVELOPMENT = 'SUB_DEVELOPMENT',
    CUSTOMER = 'CUSTOMER',
    USER = 'USER',
  }

  export enum UserStatus {
    SIGNIN = 'SIGNIN',
    SIGNOUT = 'SIGNOUT',
    FREEZE = 'FREEZE',
  }

  export interface IGetUserListParams {
    currPage?: number;
    pageSize?: number;
    start_date?: string;
    end_date?: string;
    role?: keyof typeof UserRole;
    status?: keyof typeof API.UserStatus;
    content?: string;
  }

  export interface IGetUserFansListParams extends IGetUserListParams {
    _id: string;
  }

  export interface IGetUserAttentionsListParams extends IGetUserFansListParams {}

  export interface IGetUserFansListRes extends IGetUserListRes {}

  export interface IGetUserAttentionsListRes extends IGetUserListRes {}

  export interface IGetUserListRes {
    total: number;
    list: IGetUserListResData[];
  }

  export interface IGetUserListResData {
    _id: string;
    hot: number;
    fans_count: number;
    issue_count: number;
    comment_count: number;
    store_count: number;
    attentions_count: number;
    username: string;
    mobile: number;
    email: string;
    roles: keyof typeof UserRole;
    createdAt: string;
    updatedAt: string;
    status: keyof typeof UserStatus;
    avatar: string;
  }

  export interface IPostUserParams {
    mobile: number;
    password: string;
    email: string;
    username: string;
    avatar: string;
    description: string;
    // role: keyof typeof UserRole
    role: string;
  }

  export interface IPutUserParams extends IPostUserParams {
    _id: string;
  }

  export interface IDeleteUserParams extends Pick<IPUTUserParams, '_id'> {}

  export interface IGetUserDetailParams extends IDeleteUserParams {}

  export interface IGetUserDetailRes extends IGetUserListResData {}

  export interface IDeleteUserCommentParams {
    _id: string;
  }

  export type TSourceType = 'comment' | 'movie';

  export interface IGetUserCommentListParams
    extends Exclude<IGetUserListParams, 'role' | 'status' | 'content'> {
    _id: string;
    source_type?: TSourceType;
    like?: 1 | -1;
    comment?: 1 | -1;
  }

  export interface ICommentData {
    _id: string;
    user_info: {
      _id: string;
      username: string;
    };
    createdAt: string;
    updatedAt: string;
    sub_comments: number;
    total_like: number;
    source: string;
    source_type: TSourceType;
    content: {
      text: string;
      image: string[];
      video: string[];
    };
  }

  export interface IGetUserCommentListRes {
    total: number;
    list: ICommentData[];
  }

  export type TFeedbackStatus = 'DEALING' | 'DEAL';

  export interface IGetFeedbackListParams
    extends Exclude<IGetUserListParams, 'role' | 'status' | 'content'> {
    status?: TFeedbackStatus;
  }

  export interface IGetFeedbackData {
    _id: string;
    user_info: {
      _id: string;
      username: string;
    };
    createdAt: string;
    updatedAt: string;
    status: TFeedbackStatus;
    content: {
      text: string;
      image: string[];
      video: string[];
    };
  }

  export interface IGetFeedbackListRes {
    total: number;
    list: IGetFeedbackData[];
  }

  export interface IPutFeedbackParams {
    _id: string;
    description?: string;
    status: TFeedbackStatus;
  }

  export interface IDeleteFeedbackParams extends IDeleteUserParams {}

  export interface IGetUserIssueListParams extends Exclude<IGetFeedbackListParams, 'status'> {
    status?: API_DATA.IDataStatus;
  }

  export interface IGetUserIssueData {
    _id: string;
    name: string;
    author: {
      _id: string;
      username: string;
    };
    createdAt: string;
    updatedAt: string;
    glance: number;
    hot: number;
    rate_person: number;
    total_rate: number;
    status: API_DATA.IDataStatus;
    comment_count: number;
    tag_count: number;
    barrage_count: number;
  }

  export interface IGetUserIssueListRes {
    total: number;
    list: IGetUserIssueData[];
  }

  export interface IGetUserRateData {
    _id: string;
    name: string;
    author_rate: number;
    rate_person: number;
    total_rate: number;
    source_type: API_DATA.IDataSourceType;
    createdAt: string;
    value: number;
  }

  export interface IGetUserRateListParams extends Exclude<IGetUserIssueListParams, 'status'> {
    value?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  }

  export interface IGetUserRateListRes {
    total: number;
    list: IGetUserRateData[];
  }
}

declare namespace API_DATA {
  export type IDataStatus = 'COMPLETE' | 'NOT_VERIFY' | 'VERIFY' | 'DRAFT';

  export type IDataSourceType = 'ORIGIN' | 'USER';

  export interface IGetMovieListParams {
    currPage?: number;
    pageSize?: number;
    content?: string;
    classify?: 1 | -1;
    status?: IDataStatus;
    source_type?: IDataSourceType;
    start_date?: string;
    end_date?: string;
    _id?: string;
  }

  export interface IGetMovieData {
    _id: string;
    name: string;
    author: {
      _id: string;
      username: string;
    };
    createdAt: string;
    updatedAt: string;
    glance: number;
    hot: number;
    rate_person: number;
    total_rate: number;
    source_type: IDataSourceType;
    status: IDataStatus;
    comment_count: number;
    tag_count: number;
    barrage_count: number;
  }

  export interface IGetMovieListRes {
    total: number;
    list: IGetMovieData[];
  }

  export interface IPostMovieParams {
    video: string;
    poster: string;
    actor: string[];
    director: string[];
    district: string[];
    language: string[];
    classify: string[];
    name: string;
    screen_time: string;
    description: string;
    author_rate: number;
    alias: string[];
    images: [string, string, string, string, string, string];
  }

  export interface IPutMovieParams extends IPostMovieParams {
    _id: string;
  }

  export interface IDeleteMovieParams {
    _id: string;
  }

  export interface IGetMovieInfoParams extends IDeleteMovieParams {}

  export interface IGetMovieInfoRes {
    _id: string;
    name: string;
    classify: string[];
    actor: string[];
    director: stirng[];
    district: stirng[];
    language: stirng[];
    alias: stirng[];
    screen_time: string;
    description: string;
    images: string[];
    poster: string;
    video: string;
    author_rate: number;
    author_description: string;
  }

  export interface IGetMovieDetailParams {
    _id: string;
  }

  export interface IGetMovieDetailRes extends IGetMovieData {
    classify: string[];
    images: string[];
    poster: string;
    video: string;
  }

  export interface IGetMovieCommentParams
    extends Pick<IGetMovieListParams, 'currPage' | 'pageSize' | 'start_date' | 'end_date'> {
    _id: string;
    hot?: 1 | -1;
    time?: 1 | -1;
    comment?: 1 | -1;
  }

  export interface IPostMovieCommentParams {
    source_type: TSourceType;
    _id: string;
    content: {
      text?: string;
      image?: string[];
      video?: string[];
    };
  }

  export interface IDeleteMovieCommentParams {
    _id: string;
  }

  export interface IGetMovieCommentRes {
    total: number;
    list: IGetMovieCommentDetailData[];
  }

  export interface IGetMovieCommentDetail {
    total: number;
    list: IGetMovieCommentDetailData[];
  }

  export interface IGetMovieCommentData {
    _id: string;
    user_info: {
      _id: string;
      username: string;
    };
    createdAt: string;
    updatedAt: string;
    comment_count: number;
    like_person_count: number;
    total_like: number;
    source: string;
    source_type: API_USER.TSourceType;
    content: {
      text: string;
      image: string[];
      video: string[];
    };
  }

  export interface IGetMovieCommentDetailData
    extends Pick<
      IGetMovieCommentData,
      '_id' | 'createdAt' | 'updatedAt' | 'total_like' | 'content' | 'source' | 'source_type'
    > {
    user_info: {
      _id: string;
      username: string;
      avatar: string;
      description: string;
    };
    comment_users: number;
  }

  export interface IGetGlanceUserListParams
    extends Exclude<IGetMovieCommentParams, 'hot' | 'time' | 'comment'> {
    status?: API_USER.UserStatus;
    roles?: keyof typeof API_USER.UserRole;
  }

  export interface IGetGlanceUserListRes {
    total: number;
    list: IGetGlanceUserListData[];
  }

  export interface IGetGlanceUserListData {
    _id: string;
    username: string;
    mobile: number;
    email: string;
    hot: number;
    createdAt: string;
    updatedAt: string;
    status: API_USER.UserStatus;
    roles: keyof typeof API_USER.UserRole;
    glance_date: string;
    movie_name: string;
    issue_count: number;
    fans_count: number;
    attentions_count: number;
    avatar: string;
  }

  export interface IGetActorInfoParams {
    _id?: string;
    content?: string;
    currPage?: number;
    pageSize?: number;
    all?: 1 | -1;
  }

  interface ICountryData {
    _id: string;
    name: string;
    updatedAt: string;
  }

  export interface IGetActorInfoRes {
    total: number;
    list: IGetActorInfoResData[];
  }

  export interface IGetActorInfoResData {
    _id: string;
    another_name: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    avatar: string;
    avatar_id;
    source_type: IDataSourceType;
    country: ICountryData;
  }

  export interface IGetDirectorInfoResData extends IGetActorInfoResData {}

  export interface IPutActorInfoParams extends IPostActorInfoParams {
    _id: string;
  }

  export interface IPostActorInfoParams {
    avatar: string;
    alias: string;
    name: string;
  }

  export interface IDeleteActorParams extends IGetActorInfoParams {}

  export interface IGetDirectorInfoParams extends IGetActorInfoParams {}

  export interface IGetDirectorInfoRes extends IGetActorInfoRes {
    list: IGetDirectorInfoResData[];
  }

  export interface IPutDirectorInfoParams extends IPostDirectorInfoParams {
    _id: string;
  }

  export interface IPostDirectorInfoParams extends IPostActorInfoParams {}

  export interface IDeleteDirectorParams extends IGetDirectorInfoParams {}

  export interface IGetDistrictInfoParams extends IGetActorInfoParams {}

  export interface IGetDistrictInfoResData
    extends Exclude<IGetActorInfoResData, 'avatar' | 'another_name'> {}

  export interface IGetDistrictInfoRes extends IGetActorInfoRes {
    list: IGetDistrictInfoResData[];
  }

  export interface IPutDistrictInfoParams extends IPostDistrictInfoParams {
    _id: string;
  }

  export interface IPostDistrictInfoParams {
    name: string;
  }

  export interface IDeleteDistrictParams extends IGetDirectorInfoParams {}

  export interface IGetLanguageInfoParams extends IGetActorInfoParams {}

  export interface IGetLanguageInfoResData extends IGetDistrictInfoResData {}

  export interface IGetLanguageInfoRes extends IGetDistrictInfoRes {
    data: IGetLanguageInfoResData[];
  }

  export interface IPutLanguageInfoParams extends IPutDistrictInfoParams {}

  export interface IPostLanguageInfoParams extends IPostDistrictInfoParams {}

  export interface IDeleteLanguageParams extends IGetDirectorInfoParams {}

  export interface IGetClassifyInfoParams extends IGetActorInfoParams {}

  export interface IGetClassifyInfoResData {
    _id: string;
    glance: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    icon: string;
    icon_id: string;
    source_type: IDataSourceType;
  }

  export interface IGetClassifyInfoRes extends IGetActorInfoRes {
    list: IGetClassifyInfoResData[];
  }

  export interface IPutClassifyInfoParams extends IPostClassifyInfoParams {
    _id: string;
  }

  export interface IPostClassifyInfoParams {
    name: string;
    icon: string;
  }

  export interface IDeleteClassifyParams extends IGetDirectorInfoParams {}

  export interface IPutMovieStatusParams {
    _id: string;
  }

  export interface IDeleteMovieStatusParams {
    _id: string;
  }

  export interface IGetMovieTagListParams {
    start_date?: string;
    end_date?: string;
    valid?: boolean;
    content?: string;
    _id?: string;
    weight?: number;
  }

  export interface IGetMovieTagRes {
    total: number;
    list: IGetMovieTagResData[];
  }

  export interface IGetMovieTagResData {
    text: string;
    weight: number;
    source: {
      name: string;
      _id: string;
    };
    valid: boolean;
    createdAt: string;
    updatedAt: string;
    _id: string;
  }

  export interface IPutMovieTagParams {
    _id: string;
    valid: boolean;
  }

  export interface IDeleteMovieTagParams {
    _id: string;
  }

  export interface IGetMovieStoreUserListParams {
    currPage?: number;
    pageSize?: number;
    timestamps?: number;
  }

  export interface IGetMovieStoreUserListRes {
    total: number;
    list: IGetMovieStoreUserListData[];
  }

  export interface IGetMovieStoreUserListData
    extends Omit<IGetGlanceUserListData, ['glance_date']> {
    store_date: string;
  }

  export interface IPutMovieTagUpdateParams {
    _id: string;
  }
}

declare namespace API_INSTANCE {
  export interface IGetInstanceInfoRes {
    total: number;
    list: IGetInstanceInfoData[];
  }

  export interface IGetInstanceInfoData {
    _id: string;
    info: string;
    notice: string;
    valid: boolean;
    visit_count: number;
    createdAt: string;
    updatedAt: string;
  }

  export interface IPostInstanceInfoParams
    extends Pick<IGetInstanceInfoRes, 'info' | 'notice' | 'valid'> {}

  export interface IPutInstanceInfoParams extends Partial<IPostInstanceInfoParams> {
    _id: string;
  }

  export interface IDeleteInstanceInfoParams {
    _id: string;
  }

  export interface IGetInstanceSpecialParams {
    name?: string;
    sort?: string;
    valid?: boolean;
    currPage?: number;
    pageSize?: number;
    _id?: string;
  }

  export interface IGetInstanceSpecialRes {
    total: number;
    list: IGetInstanceSpecialData[];
  }

  export interface SpecialMovieData {
    name: string;
    _id: string;
    poster: string;
  }

  export interface IGetInstanceSpecialData {
    name: string;
    description: string;
    glance: number;
    valid: boolean;
    poster: string;
    movie: SpecialMovieData[];
    _id: string;
    createdAt: string;
    updatedAt: string;
  }

  export interface IPostInstanceSpecialParams {
    name: string;
    description?: string;
    movie: string[];
    poster: string;
    valid?: boolean;
  }

  export interface IPutInstanceSpecialParams extends Partial<IPostInstanceSpecialParams> {
    _id: string;
  }

  export interface IDeleteInstanceSpecialParams {
    _id: string;
  }
}

declare namespace API_ADMIN {
  export interface IGetAdminInfoRes {
    _id: string;
    hot: number;
    fans: number;
    issue: number;
    comment: number;
    store: number;
    attentions: number;
    username: string;
    mobile: number;
    email: string;
    roles: keyof typeof API_USER.API_USER;
    createdAt: string;
    updatedAt: string;
    avatar: string;
    description: string;
  }

  export interface IPutAdminInfoParams {
    username: string;
    avatar: string;
    description: string;
    mobile: number;
    email: string;
    password: string;
  }

  export interface IGetAdminIssueListParams {
    currPage?: number;
    pageSize?: number;
  }

  export interface IGetAdminCommentListParams extends IGetAdminIssueListParams {
    like?: 1 | -1;
    comment?: 1 | -1;
  }

  export interface IGetAdminIssueListData {
    _id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    glance: number;
    hot: number;
    rate_person: number;
    total_rate: number;
    status: API_DATA.IDataStatus;
    barrage_count: number;
    tag_count: number;
    comment_count: number;
    description: string;
    poster: string;
    images: string[];
  }

  export interface IGetAdminIssueListRes {
    list: IGetAdminIssueListData[];
    total: number;
  }

  export interface IGetAdminCommentData {
    _id: string;
    createdAt: string;
    updatedAt: string;
    sub_comments: number;
    total_like: number;
    source: string;
    source_type: API_ADMIN.TSourceType;
    content: {
      text: string;
      image: string[];
      video: string[];
    };
  }

  export interface IGetAdminCommentListRes {
    total: number;
    list: IGetAdminCommentData[];
  }
}

declare namespace Upload {
  export interface IDeleteParams {
    _id: string;
  }

  export interface ILooadParams {
    load: string;
  }

  export interface UploadParams {
    file: File;
  }

  export type TAuthType = 'PRIVATE' | 'PUBLIC';

  export interface ICheckUploadFileParams {
    'Tus-Resumable': '1.0.0';
    md5: string;
    auth: TAuthType;
    size: number;
    mime: string;
    name?: string;
    chunk: number;
  }

  export interface ICheckUploadFileRes {
    'Tus-Resumable': '1.0.0';
    location: string;
    'Upload-Offset': number;
    'Upload-Length': number;
    'Upload-Id': string;
  }

  export interface UploadRes {
    _id: string;
    url: string;
  }

  export interface IUploadParams {
    md5: string;
    offset: number;
    file: Blob;
  }

  export interface IGetUploadParams {
    _id: string;
    type?: 0 | 1 | 2;
  }
}

declare namespace API_SCHEDULE {
  export interface IGetScheduleListData {
    name: string;
    description: string;
    status: 'CANCEL' | 'SCHEDULING';
    time: string;
    _id: string;
  }

  export interface IPostScheduleDealParams {
    _id: string;
  }

  export interface ICancelScheduleDealParams {
    _id: string;
  }

  export interface IRestartScheduleDealParams {
    _id: string;
  }

  export interface IPutScheduleTimeParams {
    _id: string;
    time: string;
  }
}

declare namespace API_MEDIA {
  type TStatus = 'ERROR' | 'COMPLETE' | 'UPLOADING';
  type TAuth = 'PRIVATE' | 'PUBLIC';

  export interface IGetMediaListParams {
    currPage?: number;
    pageSize?: number;
    content?: string;
    type: 0 | 1 | 2;
    _id?: string;
    origin_type?: API_DATA.IDataSourceType;
    auth?: TAuth;
    status?: TStatus;
    size?: number | string;
  }

  export interface IGetMediaListRes {
    total: number;
    list: IGetMediaListData[];
  }

  export interface IGetMediaListData {
    _id: string;
    src: string;
    name: string;
    file_name: string;
    description: string;
    poster?: string;
    createdAt: string;
    updatedAt: string;
    origin_type: API_DATA.IDataSourceType;
    white_list_count: number;
    origin: {
      name: string;
      _id: string;
    };
    auth: TAuth;
    info: {
      md5: string;
      status: TStatus;
      size: number;
      mime: string;
    };
  }

  export interface IPutMediaParams extends Pick<IGetMediaListParams, 'auth' | 'status' | 'auth'> {
    _id: string;
    type: 0 | 1 | 2;
    name?: string;
  }

  export interface IDeleteMediaParams extends Pick<IPutMediaParams, '_id' | 'type'> {}

  export interface IGetMediaValidParams extends Pick<IPutMediaParams, '_id' | 'type'> {
    isdelete?: boolean;
  }

  export interface IPutVideoPoster {
    _id: string;
    time?: string;
    auth?: 'PRIVATE' | 'PUBLIC';
    origin_type?: 'ORIGIN' | 'USER';
    name?: string;
    overlap?: boolean;
  }

  export type IGetMediaValidData = {
    complete: boolean;
    error: boolean;
    exists: boolean;
    _id: string;
    src: string;
    name: string;
  };

  export type IGetMediaValidRes = IGetMediaValidData[];
}

declare namespace API_CHAT {
  export type TRoomType = 'GROUP_CHAT' | 'CHAT' | 'SYSTEM';

  export type TCreateUser = {
    description: string;
    _id: string;
    username: string;
    avatar: string;
    member: string;
  };

  export type TRoomInfo = {
    name: string;
    description: string;
    avatar: string;
  };

  export interface IGetRoomListParams {
    currPage?: number;
    pageSize?: number;
    _id?: string;
    type: TRoomType;
    origin?: boolean;
    create_user?: string;
    content?: string;
    members?: string;
  }

  export interface IGetRoomListRes {
    total: number;
    list: IGetRoomListResData[];
  }

  export interface IGetRoomListResData {
    _id: string;
    createdAt: string;
    updatedAt: string;
    type: TRoomType;
    origin: string;
    delete_users: number;
    message: number;
    create_user: TCreateUser;
    info: TRoomInfo;
    members: number;
    online_members: number;
    id_delete: boolean;
  }

  export interface IPostRoomParams {
    name: string;
    avatar: string;
    members?: string;
    description?: string;
  }

  export interface IPutRoomParams extends Partial<IPostRoomParams> {
    _id: string;
  }

  export interface IDeleteRoomParams {
    _id: string;
  }

  export interface IGetMessageListParams {
    currPage?: number;
    pageSize?: number;
    _id: string;
  }

  export type TMessageRoom = {
    _id: string;
    createdAt: string;
    updatedAt: string;
    info: TRoomType;
    type: TRoomType;
  };

  export interface IGetMessageRes {
    total: number;
    room: TMessageRoom;
    list: IGetMessageResData[];
  }

  export type TMessageType = 'ORIGIN' | 'USER';

  export type TMessageMediaType = 'IMAGE' | 'AUDIO' | 'TEXT' | 'VIDEO';

  export type TMessageContent = {
    image?: string;
    video?: string;
    text?: string;
    audio?: string;
  };
  export interface IGetMessageResData {
    _id: string;
    createdAt: string;
    updatedAt: string;
    user_info: TCreateUser;
    message_type: TMessageType;
    point_to: string;
    readed_count: number;
    deleted_count: number;
    content: TMessageContent;
    media_type: TMessageMediaType;
    room: string;
  }

  export interface IPostMessageParams {
    content: string;
    media_type: TMessageMediaType;
    _id: string;
    point_to?: string;
  }

  export interface IDeleteMessageParams {
    _id: string;
    type?: 0 | 1;
  }

  export interface IGetMemberListParams {
    currPage?: number;
    pageSize?: number;
    _id?: string;
    room?: string;
  }

  export interface IGetMemberListRes {
    total: number;
    list: IGetMemberListResData[];
  }

  export type TMemberRoom = {
    _id: string;
    name: string;
    description: string;
  };

  export interface IGetMemberListResData {
    _id: string;
    createdAt: string;
    updatedAt: string;
    user: Omit<TCreateUser, 'member'>;
    sid: string;
    temp_user_id: string;
    room: TMemberRoom[];
  }

  export interface IPostMemberParams {
    _id: string;
    room: string;
  }

  export interface IDeleteMemberParams {
    _id: string;
    room: string;
    is_delete?: 0 | 1;
  }
}

declare namespace API_SCREEN {
  export type IGetScreenMockData = {
    data_kind: string;
    _id: string;
    description: string;
    config_type: string;
    config: any;
    user: {
      username: string;
      avatar: string;
      _id: string;
    };
    createdAt: string;
    updatedAt: string;
  };

  export type IPostScreenMockDataParams = {
    data_kind: string;
    description?: string;
    config_type: Required<IGetScreenMockParams['date_type']>;
    config: any;
  };

  export type IPutScreenMockDataParams = IPostScreenMockDataParams & {
    _id: string;
  };

  export type IGetScreenMockRes = {
    total: number;
    list: IGetScreenMockData[];
  };

  export type IGetScreenListParams = {
    currPage?: number;
    pageSize?: number;
    content?: string;
    enable?: '0' | '1';
    createdAt?: [string, string];
  };

  export type IGetScreenListData = {
    _id: string;
    flag: 'PC' | 'H5';
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    user: {
      username: string;
      avatar: string;
      _id: string;
    };
    enable: boolean;
    poster: string;
    version: string;
  };

  export type IGetScreenListRes = {
    total: number;
    list: IGetScreenListData[];
  };

  export type ILeadInScreenParams = {
    _id: string;
    type: 'screen' | 'model';
  };

  export type IGetScreenMockParams = {
    content?: string;
    date_type?:
      | 'color'
      | 'date'
      | 'address'
      | 'web'
      | 'text'
      | 'image'
      | 'number'
      | 'boolean'
      | 'name';
  };
}

declare namespace API_THIRD {
  export type GetThirdListParams = {
    currPage?: number;
    pageSize?: number;
    content?: string;
  };

  export type GetThirdListRes = {
    total: number;
    list: GetThirdListData[];
  };

  export type GetThirdListData = {
    _id: string;
    name: string;
    description: string;
    url: string;
    headers: string;
    getter: string;
    createdAt: string;
    updatedAt: string;
    params: any;
    user: {
      _id: string;
      username: string;
      avatar: string;
    };
    example: string;
    method: string;
  };

  export type PostThirdDataParams = {
    name: string;
    description?: string;
    url: string;
    method: string;
    headers?: string;
    getter?: string;
    params?: any;
  };

  export type PutThirdDataParams = PostThirdDataParams & {
    _id: string;
  };

  export type DeleteThirdDataParams = {
    _id: string;
  };

  export type GetThirdDataParams = {
    _id: string;
    params?: any;
  };
}

declare namespace API_RASPBERRY {
  export type GetListRes = {
    list: GetListData[];
  };

  export type GetListData = {
    _id: string;
    name: string;
    description: string;
    url: string;
    folder: string;
    createdAt: string;
    updatedAt: string;
    user: {
      _id: string;
      username: string;
      avatar: string;
    };
  };

  export type PostDataParams = {
    name: string;
    description?: string;
    url: string;
    folder: string;
  };

  export type PutDataParams = PostDataParams & {
    _id: string;
  };

  export type DeleteDataParams = {
    _id: string;
  };

  export type RebuildParams = {
    _id: string;
  };
}
