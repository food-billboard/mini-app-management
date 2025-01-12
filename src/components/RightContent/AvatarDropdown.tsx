import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Spin } from 'antd';
import { parse } from 'querystring'
import { history, connect } from 'umi';
import { stringify } from 'querystring';
import HeaderDropdown from '../HeaderDropdown';
import { ConnectState } from '@/models/connect'
import styles from './index.less';

export interface GlobalHeaderRightProps {
  menu?: boolean;
}

/**
 * 退出登录，并且将当前的 url 保存
 */
const loginOut = async () => {
  // await outLogin();
  const { search, pathname } = window.location;
  const { redirect } = parse(search) || {};
  // Note: There may be security issues, please note
  if (window.location.pathname !== '/user/login' && !redirect) {
    history.replace({
      pathname: '/user/login',
      search: stringify({
        redirect: pathname,
      }),
    });
  }
};

const AvatarDropdown = (props: any) => {
  
  const { dispatch, userInfo, menu } = props 

  const onMenuClick = async (event: {
    key: React.Key;
    keyPath: React.Key[];
    item: React.ReactInstance;
    domEvent: React.MouseEvent<HTMLElement>;
  }) => {
    const { key } = event;
    if (key === 'logout') {
      await dispatch({
        type: 'user/logout'
      })
      loginOut()
      return
    }
    if(key === 'settings') {
      return history.push(`/admin/setting`)
    }
    if(key === 'center') {
      return history.push('/admin')
    }
  }

  if (!userInfo || !userInfo.username) {
    return (
      <span className={`${styles.action} ${styles.account}`}>
        <Spin
          size="small"
          style={{
            marginLeft: 8,
            marginRight: 8,
          }}
        />
      </span>
    )
  }

  return (
    <HeaderDropdown 
      menu={{
        className: styles.menu, 
        selectedKeys: [],
        onClick: onMenuClick as any,
        items: [
          {
            icon: <UserOutlined />,
            label: '个人中心',
            key: 'center'
          },
          {
            icon: <SettingOutlined />,
            label: '个人设置',
            key: 'settings'
          },
          ...menu ? [
            {
              type: 'divider'
            }
          ] as any : [],
          {
            icon: <LogoutOutlined />,
            label: '退出登录',
            key: 'logout'
          }
        ]
      }}
    >
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar size="small" className={styles.avatar} src={userInfo.avatar} alt="avatar" />
        <span className={`${styles.name} anticon`}>{userInfo.username}</span>
      </span>
    </HeaderDropdown>
  )

}

export default connect(({ user }: ConnectState) => {
  return {
    userInfo: user.currentUser
  }
})(AvatarDropdown)
