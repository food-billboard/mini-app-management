import { Alert } from 'antd';
import React, { Component } from 'react';
import { Link, history, History, connect } from 'umi';
import logo from '@/assets/logo.svg';
import { LoginParamsType } from '@/services/login';
import Footer from '@/components/Footer';
import LoginFrom from './components/Login';
import styles from './style.less';
import { getLocalStorage } from '@/utils'

const { Tab, Username, Password, Submit } = LoginFrom;

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
      history.replace('/');
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
    const token = getLocalStorage('token')
    if(!!token) {
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
    const { dispatch } = this.props
    await dispatch({
      type: 'user/login',
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
      <div className={styles.container}>
        <div className={styles.lang}>
          {/* <SelectLang /> */}
        </div>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>数据管理后台</span>
              </Link>
            </div>
            <div className={styles.desc}>小程序数据管理系统</div>
          </div>

          <div className={styles.main}>
            <LoginFrom activeKey={type} onTabChange={this.setType} onSubmit={this.handleSubmit}>
              <Tab key="account" tab="账户密码登录">
                {status === 'error' && !submitting && (
                  <LoginMessage content="账户或密码错误（admin/ant.design）" />
                )}

                <Username
                  name="username"
                  placeholder="请输入用户名: admin or user"
                  rules={[
                    {
                      required: true,
                      message: '请输入用户名!',
                    },
                  ]}
                />
                <Password
                  name="password"
                  placeholder="请输入密码: ant.design"
                  rules={[
                    {
                      required: true,
                      message: '请输入密码！',
                    },
                  ]}
                />
              </Tab>
              {/* <Tab key="mobile" tab="手机号登录">
                {status === 'error' && loginType === 'mobile' && !submitting && (
                  <LoginMessage content="验证码错误" />
                )}
                <Mobile
                  name="mobile"
                  placeholder="手机号"
                  rules={[
                    {
                      required: true,
                      message: '请输入手机号！',
                    },
                    {
                      pattern: /^1\d{10}$/,
                      message: '手机号格式错误！',
                    },
                  ]}
                />
                <Captcha
                  name="captcha"
                  placeholder="验证码"
                  countDown={120}
                  getCaptchaButtonText=""
                  getCaptchaSecondText="秒"
                  rules={[
                    {
                      required: true,
                      message: '请输入验证码！',
                    },
                  ]}
                />
              </Tab> */}
              {/* <div>
                <Checkbox checked={autoLogin} onChange={(e) => setAutoLogin(e.target.checked)}>
                  自动登录
                </Checkbox>
                <a
                  style={{
                    float: 'right',
                  }}
                >
                  忘记密码
                </a>
              </div> */}
              <Submit loading={submitting}>登录</Submit>
              <div className={styles.other}>
                {/* 其他登录方式
                <AlipayCircleOutlined className={styles.icon} />
                <TaobaoCircleOutlined className={styles.icon} />
                <WeiboCircleOutlined className={styles.icon} /> */}
                <Link className={styles.register} to="/user/register">
                  注册账户
                </Link>
              </div>
            </LoginFrom>
          </div>
        </div>
        <Footer />
      </div>
    )

  }

}

export default connect(() => ({}))(Login)
