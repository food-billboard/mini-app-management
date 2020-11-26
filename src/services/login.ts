import { request } from '@/utils';

export interface LoginParamsType {
  username: string;
  password: string;
  mobile: string;
  captcha: string;
  type: string;
}

export interface RegisterParamsType extends Pick<LoginParamsType, 'mobile' | 'password' | 'captcha'> {
  email: string
}

export interface ResetParamsType extends Pick<RegisterParamsType, 'email' | 'password' | 'captcha'> {}

//登录
export async function fakeAccountLogin(params: Pick<LoginParamsType, 'mobile' | 'password'>) {
  return request<API.LoginStateType>('/api/login/account', {
    method: 'POST',
    data: params,
  });
}

//邮箱验证码
export async function getFakeCaptcha(email: string, type: 'register' | 'forget') {
  return request(`/api/user/logon/sendmail`, {
    method: 'GET',
    params: {
      email,
      type
    }
  });
}

//退出登录
export async function outLogin() {
  return request('/api/user/logon/signout', {
    method: 'POST'
  });
}

//忘记密码
export async function forgetPassword(params: ResetParamsType) {
  return request('/api/user/logon/forget', {
    method: 'PUT',
    data: params
  })
}

//注册
export async function register(params: RegisterParamsType) {
  return request('/api/user/logon/register', {
    method: 'POST',
    data: params
  })
}
