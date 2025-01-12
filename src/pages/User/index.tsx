import { accountLogin, LoginParamsType } from '@/services/login';
import { getPageQuery } from '@/utils';
import { flushSync } from 'react-dom'
import { useState } from 'react';
import { history, Link, useModel } from 'umi';
import LoginFrom from './components';
import styles from './style.less';

const { Tab, Password, Submit, Mobile } = LoginFrom;

const Login = (props: any) => {

  const [submitting, setSubmitting] = useState(false);
  const { initialState, setInitialState } = useModel('@@initialState');

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };

  const handleSubmit = async (values: LoginParamsType) => {
    await accountLogin(values)

    await fetchUserInfo();

    // Login successfully
    const urlParams = new URL(window.location.href);
    const params = getPageQuery();
    let { redirect } = params as { redirect: string };
    if (redirect) {
      const redirectUrlParams = new URL(redirect);
      if (redirectUrlParams.origin === urlParams.origin) {
        redirect = redirect.substr(urlParams.origin.length);
        if (redirect.match(/^\/.*#/)) {
          redirect = redirect.substr(redirect.indexOf('#') + 1);
        }
      } else {
        window.location.href = '/';
        return;
      }
    }
    history.replace(redirect || '/home');
  };

  return (
    <div className={styles.main}>
      <LoginFrom activeKey={'account'} onSubmit={handleSubmit}>
        <Tab key="account" tab="账户密码登录">
          <Mobile name="mobile" placeholder="请输入手机号" />
          <Password name="password" placeholder="请输入密码" />
        </Tab>
        <Submit loading={submitting}>登录</Submit>
        <div className={styles.other}>
          <Link className={styles.register} to="/user/forget">
            忘记密码
          </Link>
          <Link className={styles.register} to="/user/register">
            注册账户
          </Link>
        </div>
      </LoginFrom>
    </div>
  );
};

export default Login;
