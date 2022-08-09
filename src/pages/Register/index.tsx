import { Alert } from 'antd';
import React, { Component } from 'react';
import { connect } from 'umi';
import type { LoginParamsType } from '@/services/login';
import LoginForm from '../User/components';
import styles from './index.less';

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const { Tab, Username, Password, Captcha, Submit, Email, Mobile } = LoginForm;

class Register extends Component<any> {

  public state: any = {
    userLoginState: {},
    type: 'account',
    submitting: false
  }

  public setType = (type: string) => {
    this.setState({ type })
  }

  public setSubmitting = (submitting: boolean) => {
    this.setState({
      submitting
    })
  }

  public handleSubmit = async (values: LoginParamsType) => {
    this.setSubmitting(true)
    const { dispatch } = this.props
    try {
      await dispatch({
        type: 'user/register',
        payload: {
          ...values,
        }
      })
    }catch(err) {

    }finally {
      this.setSubmitting(false);
    }
  };

  public render = () => {

    const { userLoginState, type, submitting } = this.state
    const { status } = userLoginState

    return (
      <div className={styles.main}>
        <LoginForm activeKey={type} onTabChange={this.setType} onSubmit={this.handleSubmit}>
          <Tab key="account" tab="账户密码注册">
            {status === 'error' && !submitting && (
              <LoginMessage content="账户或密码不合理（admin/ant.design）" />
            )}
            <Mobile
              name="mobile"
              placeholder="请输入手机号"
            />
            <Username
              name="username"
              placeholder="请输入用户名"
            />
            <Password
              name="password"
              placeholder="请输入密码"
            />
            <Email 
              name="email"
              placeholder="请输入邮箱"
            />
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
    )

  }

}

export default connect(() => ({}))(Register)