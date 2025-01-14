import Footer from '@/components/Footer';
import { MenuDataItem } from '@ant-design/pro-components';
import { App } from 'antd';
import React from 'react';
import { ConnectProps, Link, Outlet } from 'umi';
import logo from '../assets/logo.svg';
import useToast from '../components/Toast';
import styles from './UserLayout.less';

export interface UserLayoutProps extends Partial<ConnectProps> {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
}

const UserLayout: React.FC<UserLayoutProps> = () => {
  useToast();
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

const Wrapper = (props: any) => {
  return (
    <App>
      <UserLayout {...props} />
    </App>
  );
};

export default Wrapper;
