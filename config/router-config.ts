export default [
  {
    path: '/user',
    layout: false,
    component: '../layouts/UserLayout',
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/login',
      },
    ],
  },
  {
    path: '/',
    // component: '',
    routes: [
      {
        path: '/',
        component: '',
        routes: [
          {
            path: '/',
            redirect: '/home'
          },
          {
            path: '/home',
            component: '@/pages/Dashboard',
            name: 'home',
            icon: 'home',
            title: '首页'
          },
          {
            path: '/member',
            component: '@/pages/Member',
            name: 'member',
            icon: 'team',
            title: '用户管理',
            routes: [
              {
                path: 'member/:id',
                component: '@pages/MemberDetail',
                title: '用户详情'
              }
            ]
          },
          {
            path: '/data',
            component: '@pages/Data',
            name: 'data',
            title: '数据管理',
            icon: 'database',
            routes: [
              {
                path: 'data/:id',
                component: '@pages/DataDetail',
                title: '数据详情'
              }
            ]
          },
          {
            path: '/error',
            component: '@pages/Error',
            name: 'error',
            icon: 'meh',
            title: '错误管理',
          },
          {
            path: '/admin',
            component: '@pages/Admin',
            name: 'admin',
            title: '个人中心',
            icon: 'setting',
            routes: [
              {
                path: '/admin/setting',
                component: '@pages/Setting',
                title: '个人设置'
              }
            ]
          }
        ]
      }
    ]
  },
  // {
  //   path: '/',
  //   name: 'home',
  //   icon: 'home',
  //   component: './Welcome',
  // },
  // {
  //   path: '/admin',
  //   name: 'admin',
  //   icon: 'crown',
  //   access: 'canAdmin',
  //   component: './Admin',
  //   routes: [
  //     {
  //       path: '/admin/sub-page',
  //       name: 'sub-page',
  //       icon: 'smile',
  //       component: './Welcome',
  //     },
  //   ],
  // },
  // {
  //   name: 'list.table-list',
  //   icon: 'table',
  //   path: '/list',
  //   component: './ListTableList',
  // },
  // {
  //   path: '/',
  //   redirect: '/welcome',
  // },
  {
    component: './404',
  },
]