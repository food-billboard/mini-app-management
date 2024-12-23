const { REACT_APP_ENV } = process.env;

export default [
  {
    path: '/user',
    // layout: false,
    component: '@/layouts/UserLayout',
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
    component: '@/layouts/SecurityLayout',
    wrappers: ['@/layouts/Authority'],
    routes: [
      {
        path: '/',
        component: '@/layouts/BasicLayout',
        routes: [
          {
            path: '/',
            redirect: '/home',
          },
          {
            path: '/home',
            component: '@/pages/Dashboard',
            name: 'home',
            icon: 'home',
            title: '首页',
            // authority: [ 'admin'], //如果用户的权限不在这里面的话就不显示当前路由
          },
          {
            path: '/member',
            name: 'member',
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
                name: 'memberdetail',
                hideInMenu: true,
              },
            ],
          },
          {
            path: '/eat-what',
            name: 'eat_what',
            icon: 'coffee',
            title: '今天吃什么管理',
            component: '@/pages/EatWhat',
          },
          {
            path: '/media',
            name: 'media',
            icon: 'picture',
            title: '媒体资源管理',
            routes: [
              {
                path: '/media',
                component: '@/pages/Media',
              },
              {
                path: '/media/video/list',
                component: '@/pages/VideoList',
                title: '视频列表',
                name: 'mediadetailvideolist',
                hideInMenu: true,
              },
              {
                path: '/media/video',
                component: '@/pages/Video',
                title: '视频详情',
                name: 'mediadetailvideo',
                hideInMenu: true,
              },
              {
                path: '/media/image',
                component: '@/pages/Image',
                title: '图片详情',
                name: 'mediadetailimage',
                hideInMenu: true,
              },
            ],
          },
          {
            path: '/chat',
            name: 'chat',
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
                name: 'message',
                hideInMenu: true,
              },
              {
                path: '/chat/member/:room',
                component: '@/pages/ChatMembers',
                title: '成员管理',
                name: 'member',
                hideInMenu: true,
              },
            ],
          },
          {
            path: '/feedback',
            component: '@/pages/Feedback',
            name: 'feedback',
            icon: 'tool',
            title: '反馈管理',
          },
          {
            path: '/schedule',
            component: '@/pages/Schedule',
            name: 'schedule',
            icon: 'clock-circle',
            title: '定时任务管理',
          },
          ...(REACT_APP_ENV === 'prod-local'
            ? [
                {
                  path: '/raspberry',
                  component: '@/pages/RaspberryPiPackage',
                  name: 'raspberry',
                  icon: 'reddit',
                  title: '树莓派本地仓库管理',
                },
              ]
            : []),
          {
            path: '/instance',
            component: '@/pages/instance',
            title: '实例管理',
            name: 'instance',
            icon: 'global',
          },
          {
            path: '/data',
            name: 'data',
            title: '数据管理',
            icon: 'database',
            routes: [
              {
                path: '/data/main',
                title: '数据信息管理',
                name: 'datainfo',
                routes: [
                  {
                    path: '/data/main',
                    component: '@/pages/Data',
                  },
                  {
                    path: '/data/main/edit',
                    component: '@/pages/DataEdit',
                    title: '数据修改',
                    name: 'datainfoedit',
                    hideInMenu: true,
                  },
                  {
                    path: '/data/main/:id',
                    component: '@/pages/DataDetail',
                    title: '数据详情',
                    name: 'datainfodetail',
                    hideInMenu: true,
                  },
                ],
              },
              {
                path: '/data/special',
                title: '数据专题管理',
                name: 'special',
                routes: [
                  {
                    path: '/data/special',
                    component: '@/pages/DataSpecial',
                  },
                  {
                    path: '/data/special/:name',
                    component: '@/pages/DataSpecialDetail',
                    title: '数据专题详情',
                    name: 'specialdetail',
                    hideInMenu: true,
                  },
                ],
              },
              {
                path: '/data/tag',
                title: '数据标签管理',
                name: 'tag',
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
                name: 'dataabout',
                routes: [
                  {
                    path: '/data/about',
                    component: '@/pages/DataAbout',
                  },
                  {
                    path: '/data/about/:name',
                    component: '@/pages/DataAboutDetail',
                    title: '数据相关详情',
                    name: 'dataaboutdetail',
                    hideInMenu: true,
                  },
                ],
              },
              // {
              //   path: '/data/image/edit',
              //   component: '@/pages/ImageEditor',
              //   title: '图片编辑',
              //   hideInMenu: true
              // }
            ],
          },
          // {
          //   path: '/error',
          //   component: '@/pages/Error',
          //   name: 'error',
          //   icon: 'meh',
          //   title: '错误管理',
          // },
          {
            path: '/screen',
            name: 'screen',
            title: '大屏管理',
            icon: 'fund',
            routes: [
              {
                path: '/screen/list',
                title: '实例管理',
                name: 'list',
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
                name: 'model',
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
                name: 'mock',
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
            name: 'third',
            title: '第三方接口',
            icon: 'api',
            component: '@/pages/ThirdParty',
          },
          {
            path: '/admin',
            name: 'admin',
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
    ],
  },
  {
    component: './404',
  },
];
