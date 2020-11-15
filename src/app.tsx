// import React from 'react';
// import { BasicLayoutProps, Settings as LayoutSettings } from '@ant-design/pro-layout';
// import { history } from 'umi';
// import RightContent from '@/components/RightContent';
// import Footer from '@/components/Footer';
// import { queryCurrent } from './services/user';
// import defaultSettings from '../config/defaultSettings';

// export async function getInitialState(): Promise<{
//   settings?: LayoutSettings;
//   currentUser?: API.CurrentUser;
//   fetchUserInfo: () => Promise<API.CurrentUser | undefined>;
// }> {
//   const fetchUserInfo = async () => {
//     try {
//       const currentUser = await queryCurrent();
//       return currentUser;
//     } catch (error) {
//       history.push('/user/login');
//     }
//     return undefined;
//   };
//   // 如果是登录页面，不执行
//   if (history.location.pathname !== '/user/login') {
//     const currentUser = await fetchUserInfo();
//     return {
//       fetchUserInfo,
//       currentUser,
//       settings: defaultSettings,
//     };
//   }
//   return {
//     fetchUserInfo,
//     settings: defaultSettings,
//   };
// }

// export const layout = ({
//   initialState,
// }: {
//   initialState: { settings?: LayoutSettings; currentUser?: API.CurrentUser };
// }): BasicLayoutProps => {
//   return {
//     rightContentRender: () => <RightContent />,
//     disableContentMargin: false,
//     footerRender: () => <Footer />,
//     onPageChange: () => {
//       const { currentUser } = initialState;
//       const { location } = history;
//       // 如果没有登录，重定向到 login
//       if (!currentUser && location.pathname !== '/user/login') {
//         history.push('/user/login');
//       }
//     },
//     menuHeaderRender: undefined,
//     ...initialState?.settings,
//   };
// };

import moment from 'moment'
import 'moment/locale/zh-cn'

moment.locale('zh-cn')


export const locale = {
  default: 'zh-CN'
}

export const render = (nextRender: any) => {
  nextRender()
}