import React from 'react';
import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';

export default () => (
  <DefaultFooter
    copyright="2020 傻瓜技术部抄袭"
    links={[
      {
        key: 'github',
        title: <GithubOutlined />,
        href: 'https://github.com/food-billboard?tab=repositories',
        blankTarget: true,
      },
    ]}
  />
);
