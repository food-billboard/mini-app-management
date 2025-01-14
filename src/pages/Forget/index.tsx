import { message } from '@/components/Toast';
import { forgetPassword } from '@/services';
import { LoginParamsType } from '@/services/login';
import { useState } from 'react';
import { history } from 'umi';
import LoginForm from '../User/components';
import styles from './index.less';

const { Tab, Password, Captcha, Submit, Email } = LoginForm;

const Register = () => {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: LoginParamsType) => {
    setSubmitting(true);
    const response = await forgetPassword(values as any);
    //重置成功跳转至登录
    if (response.status === 'ok') {
      message.success({
        content: '重置成功',
        duration: 1.5,
        onClose: () => {
          history.replace('/user/login');
        },
      });
    }
    setSubmitting(false);
  };

  return (
    <div className={styles.main}>
      <LoginForm activeKey={'account'} onSubmit={handleSubmit}>
        <Tab key="account" tab="密码重置">
          <Email name="email" placeholder="请输入邮箱，随便输" />
          <Captcha
            name="captcha"
            placeholder="验证码"
            countDown={120}
            getCaptchaButtonText=""
            getCaptchaSecondText="秒"
            captchaStatus={'forget'}
          />
          <Password name="password" placeholder="请输入密码" />
        </Tab>
        <Submit loading={submitting}>重置密码</Submit>
      </LoginForm>
    </div>
  );
};

export default Register;
