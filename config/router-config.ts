export default [
  {
    path: '/user',
    // layout: false,
    component: '@/layouts/UserLayout',
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './User/login',
      },
      {
        name: 'register',
        path: '/user/register',
        component: './User/register',
        title: '注册'
      },
      {
        name: 'forget',
        path: '/user/forget',
        component: './User/forget',
        title: '忘记密码'
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
            redirect: '/home'
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
            component: '@/pages/Member',
            name: 'member',
            icon: 'team',
            title: '用户管理',
            routes: [
              {
                path: 'member/:id',
                component: '@/pages/MemberDetail',
                title: '用户详情'
              }
            ]
          },
          {
            path: '/data',
            component: '@/pages/Data',
            name: 'data',
            title: '数据管理',
            icon: 'database',
            routes: [
              {
                path: 'data/:id',
                component: '@/pages/DataDetail',
                title: '数据详情'
              },
              {
                path: 'about',
                component: '@/pages/DataAbout',
                title: '数据相关'
              },
              {
                path: 'about/:name',
                component: '@/pages/DataAboutDetail',
                title: '数据相关详情',
                hideInMenu: true
              },
            ]
          },
          {
            path: '/error',
            component: '@/pages/Error',
            name: 'error',
            icon: 'meh',
            title: '错误管理',
          },
          {
            path: '/admin',
            component: '@/pages/Admin',
            name: 'admin',
            title: '个人中心',
            icon: 'setting',
            routes: [
              {
                path: '/admin/setting',
                component: '@/pages/Setting',
                title: '个人设置'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    component: './404',
  },
]