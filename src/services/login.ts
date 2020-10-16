import { request } from '@/utils';

export interface LoginParamsType {
  username: string;
  password: string;
  mobile: string;
  captcha: string;
  type: string;
}

export interface RegisterParamsType extends Pick<LoginParamsType, 'username' | 'password' | 'captcha'> {
  email: string
}

export interface ResetParamsType extends Pick<RegisterParamsType, 'email' | 'password' | 'captcha'> {}

//登录
export async function fakeAccountLogin(params: LoginParamsType) {
  return request<API.LoginStateType>('/api/login/account', {
    method: 'POST',
    data: params,
  });
}

//邮箱验证码
export async function getFakeCaptcha(email: string) {
  return request(`/api/login/captcha?email=${email}`);
}

//退出登录
export async function outLogin() {
  return request('/api/login/outLogin');
}

//忘记密码
export async function forgetPassword(params: ResetParamsType) {
  return request('/api/forget', {
    method: 'PUT',
    data: params
  })
}

//注册
export async function register(params: RegisterParamsType) {
  return request('/api/register', {
    method: 'PUT',
    data: params
  })
}
