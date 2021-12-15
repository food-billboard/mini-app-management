import { Alert } from 'antd';
import React, { Component } from 'react';
import { Link, history, History, connect } from 'umi';
import { LoginParamsType } from '@/services/login';
import LoginFrom from './components';
import { mapStateToProps, mapDispatchToProps } from './connect'
import styles from './style.less';
import { withTry } from '@/utils'

const { Tab, Password, Submit, Mobile } = LoginFrom;

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

/**
 * 此方法会跳转到 redirect 参数所在的位置
 */
const replaceGoto = () => {
  setTimeout(() => {
    const { query } = history.location;
    const { redirect } = query as { redirect: string };
    if (!redirect) {
      history.replace('/home');
      return;
    }
    (history as History).replace(redirect);
  }, 10);
};

class Login extends Component<any> {

  public state: any = {
    userLoginState: {},
    type: 'account',
    submitting: false
  }

  public componentDidMount = () => {
    if(!!this.props.isLogin) {
      replaceGoto()
    }
  }

  public setType = (type: string) => {
    this.setState({ type })
  }

  public setSubmitting = (submitting:boolean) => {
    this.setState({
      submitting
    })
  }

  public handleSubmit = async (values: LoginParamsType) => {
    this.setSubmitting(true)
    await withTry(this.props.login)(values)
    this.setSubmitting(false);
  };

  public render = () => {

    const { userLoginState, type, submitting } = this.state
    const { status } = userLoginState

    return (
      <div className={styles.main}>
        <LoginFrom activeKey={type} onTabChange={this.setType} onSubmit={this.handleSubmit}>
          <Tab key="account" tab="账户密码登录">
            {status === 'error' && !submitting && (
              <LoginMessage content="账户或密码错误（admin/ant.design）" />
            )}

            <Mobile
              name="mobile"
              placeholder="请输入手机号"
            />
            <Password
              name="password"
              placeholder="请输入密码"
            />
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
    )

  }

}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
