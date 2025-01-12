import Footer from '@/components/Footer';
import type { ConnectState } from '@/models/connect';
import { MenuDataItem } from '@ant-design/pro-components';
import React from 'react';
import { connect, ConnectProps, Link, Outlet } from 'umi';
import logo from '../assets/logo.svg';
import styles from './UserLayout.less';

export interface UserLayoutProps extends Partial<ConnectProps> {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
}

const UserLayout: React.FC<UserLayoutProps> = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.lang}></div>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <Link to="/">
              <img alt="logo" className={styles.logo} src={logo} />
              <span className={styles.title}>数据管理后台</span>
            </Link>
          </div>
        </div>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default connect(({ settings }: ConnectState) => ({ ...settings }))(
  UserLayout,
);
