const { REACT_APP_ENV } = process.env;

export default [
  {
    path: '/user',
    layout: false,
    wrappers: ['@/layouts/UserLayout'],
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: '@/pages/User',
      },
      {
        name: 'register',
        path: '/user/register',
        component: '@/pages/Register',
        title: '注册',
      },
      {
        name: 'forget',
        path: '/user/forget',
        component: '@/pages/Forget',
        title: '忘记密码',
      },
    ],
  },
  {
    path: '/',
    wrappers: ['@/layouts/BaseLayout'],
    routes: [
      {
        path: '/',
        redirect: '/home',
      },
      {
        path: '/home',
        component: '@/pages/Dashboard',
        name: '首页',
        icon: 'home',
        title: '首页',
      },
      {
        path: '/member',
        name: '用户管理',
        icon: 'team',
        title: '用户管理',
        routes: [
          {
            path: '/member',
            component: '@/pages/Member',
          },
          {
            path: '/member/:id',
            component: '@/pages/MemberDetail',
            title: '用户详情',
            name: '用户详情',
            hideInMenu: true,
          },
        ],
      },
      {
        path: '/eat-what',
        name: '今天吃什么管理',
        icon: 'coffee',
        title: '今天吃什么管理',
        routes: [
          {
            path: '/eat-what/main',
            component: '@/pages/EatWhat',
            title: '菜单管理',
            name: '菜单管理',
          },
          {
            path: '/eat-what/classify',
            component: '@/pages/EatWhatClassify',
            title: '菜单分类管理',
            name: '菜单分类管理',
          },
        ],
      },
      {
        path: '/media',
        name: '媒体管理',
        icon: 'picture',
        title: '媒体管理',
        routes: [
          {
            title: '资源管理',
            path: '/media/source',
            component: '@/pages/Media',
            name: '资源管理',
          },
          {
            title: '视频处理',
            path: '/media/video-deal',
            component: '@/pages/VideoDeal',
            name: '视频处理',
          },
          {
            title: '图片水印',
            path: '/media/image-watermark',
            component: '@/pages/ImageWatermark',
            name: '图片水印',
          },
          {
            path: '/media/video/list',
            component: '@/pages/VideoList',
            title: '视频列表',
            name: '视频列表',
            hideInMenu: true,
          },
          {
            path: '/media/image',
            component: '@/pages/Image',
            title: '图片详情',
            name: '图片详情',
            hideInMenu: true,
          },
        ],
      },
      {
        path: '/chat',
        name: '聊天管理',
        icon: 'message',
        title: '聊天管理',
        routes: [
          {
            path: '/chat',
            component: '@/pages/Room',
            // title: '聊天室管理',
            // name: 'room'
          },
          {
            path: '/chat/message/:room',
            component: '@/pages/Message',
            title: '消息管理',
            name: '消息管理',
            hideInMenu: true,
          },
          {
            path: '/chat/member/:room',
            component: '@/pages/ChatMembers',
            title: '成员管理',
            name: '成员管理',
            hideInMenu: true,
          },
        ],
      },
      {
        path: '/feedback',
        component: '@/pages/Feedback',
        name: '反馈管理',
        icon: 'tool',
        title: '反馈管理',
      },
      {
        path: '/schedule',
        component: '@/pages/Schedule',
        name: '定时任务管理',
        icon: 'HistoryOutlined',
        title: '定时任务管理',
      },
      ...(REACT_APP_ENV === 'prod-local'
        ? [
            {
              path: '/raspberry',
              component: '@/pages/RaspberryPiPackage',
              name: '树莓派本地仓库管理',
              icon: 'reddit',
              title: '树莓派本地仓库管理',
            },
          ]
        : []),
      {
        path: '/instance',
        component: '@/pages/instance',
        title: '实例管理',
        name: '实例管理',
        icon: 'global',
      },
      {
        path: '/data',
        name: '数据管理',
        title: '数据管理',
        icon: 'database',
        routes: [
          {
            path: '/data/main',
            title: '数据信息管理',
            name: '数据信息管理',
            routes: [
              {
                path: '/data/main',
                component: '@/pages/Data',
              },
              {
                path: '/data/main/edit',
                component: '@/pages/DataEdit',
                title: '数据修改',
                name: '数据修改',
                hideInMenu: true,
              },
              {
                path: '/data/main/:id',
                component: '@/pages/DataDetail',
                title: '数据详情',
                name: '数据详情',
                hideInMenu: true,
              },
            ],
          },
          {
            path: '/data/special',
            title: '数据专题管理',
            name: '数据专题管理',
            routes: [
              {
                path: '/data/special',
                component: '@/pages/DataSpecial',
              },
              {
                path: '/data/special/:name',
                component: '@/pages/DataSpecialDetail',
                title: '数据专题详情',
                name: '数据专题详情',
                hideInMenu: true,
              },
            ],
          },
          {
            path: '/data/tag',
            title: '数据标签管理',
            name: '数据标签管理',
            routes: [
              {
                path: '/data/tag',
                component: '@/pages/DataTag',
              },
            ],
          },
          {
            path: '/data/about',
            title: '数据相关管理',
            name: '数据相关管理',
            routes: [
              {
                path: '/data/about',
                component: '@/pages/DataAbout',
              },
              {
                path: '/data/about/:name',
                component: '@/pages/DataAboutDetail',
                title: '数据相关详情',
                name: '数据相关详情',
                hideInMenu: true,
              },
            ],
          },
        ],
      },
      {
        path: '/score',
        name: '积分管理',
        title: '积分管理',
        icon: 'AccountBookOutlined',
        routes: [
          {
            path: '/score/award',
            title: '奖品管理',
            name: '奖品管理',
            routes: [
              {
                path: '/score/award',
                component: '@/pages/AwardManage',
              }
            ],
          },
          {
            path: '/score/score-memory',
            title: '积分记录',
            name: '积分记录',
            routes: [
              {
                path: '/score/score-memory',
                component: '@/pages/ScoreMemoryManage',
              },
              {
                path: '/score/score-memory/classify',
                component: '@/pages/ScoreClassifyManage',
                title: '积分原因分类管理',
                name: '积分原因分类管理',
                hideInMenu: true,
              }
            ],
          },
          {
            path: '/score/exchange-manage',
            title: '兑换记录',
            name: '兑换记录',
            component: '@/pages/ExchangeMemoryManage',
          },
          {
            path: '/score/score-user-manage',
            title: '人员管理',
            name: '人员管理',
            component: '@/pages/ScoreUserManage',
          },
          {
            path: '/score/holiday',
            title: '假期管理',
            name: '假期管理',
            component: '@/pages/HolidayManage',
          },
        ],
      },
      {
        path: '/screen',
        name: '大屏管理',
        title: '大屏管理',
        icon: 'fund',
        routes: [
          {
            path: '/screen/list',
            title: '实例管理',
            name: '实例管理',
            routes: [
              {
                path: '/screen/list',
                component: '@/pages/Screen',
              },
            ],
          },
          {
            path: '/screen/model',
            title: '模板管理',
            name: '模板管理',
            routes: [
              {
                path: '/screen/model',
                component: '@/pages/ScreenModel',
              },
            ],
          },
          {
            path: '/screen/mock',
            title: 'mock数据管理',
            name: 'mock数据管理',
            routes: [
              {
                path: '/screen/mock',
                component: '@/pages/ScreenMock',
              },
            ],
          },
        ],
      },
      {
        path: '/third',
        name: '第三方接口',
        title: '第三方接口',
        icon: 'api',
        component: '@/pages/ThirdParty',
      },
      {
        path: '/admin',
        name: '个人中心',
        title: '个人中心',
        icon: 'setting',
        routes: [
          {
            path: '/admin',
            component: '@/pages/Admin',
          },
          {
            path: '/admin/setting',
            component: '@/pages/Setting',
            title: '个人设置',
          },
        ],
      },
    ],
  },
  {
    component: './404',
  },
];
