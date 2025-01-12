import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import type { RuntimeConfig } from '@umijs/max';
import { history, useModel } from '@umijs/max';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import "dayjs/locale/zh-cn.js";
import PageLoading from '@/components/PageLoading'
import Footer from '@/components/Footer'
import RightContent from '@/components/RightContent'
import defaultSettings from '../config/defaultSettings';
import { getUserInfo } from './services';

const loginPath = '/user/login';
const authPathList = [loginPath, '/user/register', '/user/forget']

dayjs.extend(relativeTime)

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg = await getUserInfo();
      return msg;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果不是登录页面，执行
  const { location } = history;
  if (!authPathList.includes(location.pathname)) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings as Partial<LayoutSettings>,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

const AvatarName = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  return <span className="anticon">{currentUser?.name}</span>;
};

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RuntimeConfig['layout'] = ({ initialState, setInitialState }) => {
  return {
    token: {
      header: {
        colorBgHeader: '#292f33',
        colorHeaderTitle: '#fff',
        colorTextMenu: '#dfdfdf',
        colorTextMenuSecondary: '#dfdfdf',
        colorTextMenuSelected: '#fff',
        colorBgMenuItemSelected: '#22272b',
        colorTextRightActionsItem: '#dfdfdf',
      },
      sider: {
        colorMenuBackground: '#fff',
        colorMenuItemDivider: '#dfdfdf',
        colorTextMenu: '#595959',
        colorTextMenuSelected: 'var(--primary-color)',
        colorBgMenuItemSelected: '#e6f4ff',
      },
    },
    contentStyle: {
      paddingBlock: 8,
      paddingInline: 8
    },
    avatarProps: {
      src: initialState?.currentUser?.avatar,
      title: <AvatarName />,
      render: (_, avatarChildren) => {
        return (
          <RightContent />
        )
      },
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && !authPathList.includes(location.pathname)) {
        history.push(loginPath);
      }
    },
    bgLayoutImgList: [
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      console.log(initialState)
      if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
        </>
      );
    },
    locale: 'zh-CN',
    menuDataRender: (menuData) => {
      return menuData[0]?.children || []
    },
    ...initialState?.settings,
  };
};