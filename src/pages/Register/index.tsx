import { message } from '@/components/Toast';
import { register } from '@/services';
import type { LoginParamsType } from '@/services/login';
import { useState } from 'react';
import { history } from 'umi';
import LoginForm from '../User/components';
import styles from './index.less';

const { Tab, Username, Password, Captcha, Submit, Email, Mobile } = LoginForm;

const Register = () => {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: LoginParamsType) => {
    setSubmitting(true);
    try {
      const response = await register(values as any);

      //注册成功跳转至登录
      if (!!response.token) {
        message.success({
          content: '注册成功',
          duration: 1.5,
          onClose: () => {
            history.replace('/user/login');
          },
        });
      }
    } catch (err) {
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.main}>
      <LoginForm activeKey={'account'} onSubmit={handleSubmit}>
        <Tab key="account" tab="账户密码注册">
          <Mobile name="mobile" placeholder="请输入手机号" />
          <Username name="username" placeholder="请输入用户名" />
          <Password name="password" placeholder="请输入密码" />
          <Email name="email" placeholder="请输入邮箱" />
          <Captcha
            name="captcha"
            placeholder="验证码"
            countDown={120}
            getCaptchaButtonText=""
            getCaptchaSecondText="秒"
            captchaStatus={'register'}
          />
        </Tab>
        <Submit loading={submitting}>注册</Submit>
      </LoginForm>
    </div>
  );
};

export default Register;
