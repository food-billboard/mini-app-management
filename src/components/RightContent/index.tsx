import { Tag, Space } from 'antd';
import { Settings as ProSettings } from '@ant-design/pro-components';
import React from 'react';
import { ConnectProps } from 'umi';
import Avatar from './AvatarDropdown';
import styles from './index.less';

export type SiderTheme = 'light' | 'dark';

export interface GlobalHeaderRightProps extends Partial<ConnectProps>, Partial<ProSettings> {
  theme?: ProSettings['navTheme'] | 'realDark';
}

const ENVTagColor: any = {
  dev: 'orange',
  test: 'green',
  pre: '#87d068',
  prod: '#87d068',
  'prod-local': '#87d068',
};

const REACT_APP_ENV = process.env.REACT_APP_ENV

const GlobalHeaderRight: React.FC<GlobalHeaderRightProps> = (props) => {
  const { theme, layout } = props;
  let className = styles.right;

  if (theme === 'realDark' && layout === 'top') {
    className = `${styles.right}  ${styles.dark}`;
  }

  return (
    <Space className={className}>
      <Avatar />
      {REACT_APP_ENV && (
        <span>
          <Tag color={ENVTagColor[REACT_APP_ENV]}>{REACT_APP_ENV}</Tag>
        </span>
      )}
    </Space>
  );
};
export default GlobalHeaderRight;
