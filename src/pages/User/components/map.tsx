import { LockTwoTone, MailTwoTone, MobileTwoTone, UserOutlined, MessageOutlined } from '@ant-design/icons';
import React from 'react';
import styles from './index.less';

export default {
  Username: {
    props: {
      size: 'large',
      id: 'username',
      prefix: (
        <UserOutlined
          style={{
            color: '#1890ff',
          }}
          className={styles.prefixIcon}
        />
      ),
      placeholder: 'admin',
    },
    rules: [
      {
        required: true,
        message: '请输入用户名!',
      },
      {
        min: 1,
        message: '用户名长度不能小于8!',
      },
      {
        max: 20,
        message: '用户名长度不能超过20!'
      },
      {
        whitespace: true,
        message: '用户名不能为空!'
      },
    ],
  },
  Password: {
    props: {
      size: 'large',
      prefix: <LockTwoTone className={styles.prefixIcon} />,
      type: 'password',
      id: 'password',
      placeholder: '888888',
    },
    rules: [
      {
        required: true,
        message: '请输入密码!',
      },
      {
        min: 1,
        message: '密码长度不能低于8!'
      },
      {
        max: 20,
        message: '密码长度不能超过20!'
      },
      {
        whitespace: true,
        message: '密码不能为空!'
      },
    ],
  },
  Mobile: {
    props: {
      size: 'large',
      prefix: <MobileTwoTone className={styles.prefixIcon} />,
      placeholder: 'mobile number',
    },
    rules: [
      {
        required: true,
        message: '请输入手机号',
      },
      {
        pattern: /^1\d{10}$/,
        message: '不正确的手机格式',
      },
    ],
  },
  Captcha: {
    props: {
      size: 'large',
      prefix: <MessageOutlined style={{
          color: '#1890ff',
        }}
        className={styles.prefixIcon} 
      />,
      placeholder: 'captcha',
    },
    rules: [
      {
        required: true,
        message: '请输入验证码!',
      },
      {
        min: 6,
        message: '验证码长度不正确!'
      },
    ],
  },
  Email: {
    props: {
      size: 'large',
      prefix: <MailTwoTone className={styles.prefixIcon} />,
      placeholder: 'email',
    },
    rules: [
      {
        required: true,
        message: '请输入邮箱!',
      },
      {
        type: 'email',
        message: '邮箱格式不正确!',
      },
    ],
  },
};
