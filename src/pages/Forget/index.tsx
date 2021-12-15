import { Alert } from 'antd';
import React, { Component } from 'react';
import { connect } from 'umi';
import { LoginParamsType } from '@/services/login';
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

const { Tab, Password, Captcha, Submit, Email } = LoginForm;

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
    await dispatch({
      type: 'user/register',
      payload: {
        ...values,
      }
    })
    this.setSubmitting(false);
  };

  public render = () => {

    const { userLoginState, type, submitting } = this.state
    const { status } = userLoginState

    return (
      <div className={styles.main}>
        <LoginForm activeKey={type} onTabChange={this.setType} onSubmit={this.handleSubmit}>
          <Tab key="account" tab="密码重置">
            {status === 'error' && !submitting && (
              <LoginMessage content="验证码错误或密码不合理" />
            )}
            <Email 
              name="email"
              placeholder="请输入邮箱，随便输"
            />
            <Captcha
              name="captcha"
              placeholder="验证码"
              countDown={120}
              getCaptchaButtonText=""
              getCaptchaSecondText="秒"
              captchaStatus={'forget'}
            />
            <Password
              name="password"
              placeholder="请输入密码"
            />
          </Tab>
          <Submit loading={submitting}>重置密码</Submit>
        </LoginForm>
      </div>
    )

  }

}

export default connect(() => ({}))(Register)