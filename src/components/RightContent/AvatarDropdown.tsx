import React, { Component } from 'react';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
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
  const { query, pathname } = history.location;
  const { redirect } = query || {};
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

class AvatarDropdown extends Component<any> {

  public onMenuClick = async (event: {
    key: React.Key;
    keyPath: React.Key[];
    item: React.ReactInstance;
    domEvent: React.MouseEvent<HTMLElement>;
  }) => {
    const { key } = event;
    if (key === 'logout') {
      const { dispatch } = this.props
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

  readonly loading = (
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

  readonly menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick as any}>
      {/* {this.props.menu && (
        <Menu.Item key="center">
          <UserOutlined />
          个人中心
        </Menu.Item>
      )}
      {this.props.menu && (
        <Menu.Item key="settings">
          <SettingOutlined />
          个人设置
        </Menu.Item>
      )} */}
      <Menu.Item key="center">
        <UserOutlined />
        个人中心
      </Menu.Item>
      <Menu.Item key="settings">
        <SettingOutlined />
        个人设置
      </Menu.Item>
      {this.props.menu && <Menu.Divider />}

      <Menu.Item key="logout">
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  )

  public render = () => {
    
    const { userInfo } = this.props
    if (!userInfo || !userInfo.username) {
      return this.loading
    }

    return (
      <HeaderDropdown overlay={this.menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="small" className={styles.avatar} src={userInfo.avatar} alt="avatar" />
          <span className={`${styles.name} anticon`}>{userInfo.username}</span>
        </span>
      </HeaderDropdown>
    )

  }

}

export default connect(({ user }: ConnectState) => {
  return {
    userInfo: user.currentUser
  }
})(AvatarDropdown)
