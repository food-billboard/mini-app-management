import { message } from '@/components/Toast';
import {
  LoginParamsType,
  RegisterParamsType,
  ResetParamsType,
  accountLogin,
  forgetPassword,
  getUserInfo,
  outLogin,
  register,
} from '@/services';
import { getPageQuery } from '@/utils';
import { stringify } from 'querystring';
import { history } from 'umi';

interface IUserModelState {
  currentUser?: CurrentUser;
  status: any;
}

interface CurrentUser extends API_ADMIN.IGetAdminInfoRes {}

export { CurrentUser, IUserModelState };

export default {
  namespace: 'user',

  state: {
    currentUser: {},
    status: false,
  },

  effects: {
    //获取用户信息
    *fetchCurrent(_: any, { call, put }: { call: any; put: any }) {
      const response = yield call(getUserInfo);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
      return response;
    },

    //登录
    *login(
      { payload }: { payload: LoginParamsType },
      { call, put }: { call: any; put: any },
    ) {
      const response = yield call(accountLogin, payload);

      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });

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
    },

    //退出登录
    *logout(_: any, { call, put }: { call: any; put: any }) {
      try {
        yield call(outLogin);
      } catch (err) {}

      const { redirect } = getPageQuery();
      yield put({
        type: 'saveCurrentUser',
        payload: {},
      });
      yield put({
        type: 'changeLoginStatus',
        payload: {},
      });
      // Note: There may be security issues, please note
      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },

    //注册
    *register(
      { payload }: { payload: RegisterParamsType },
      { call }: { call: any },
    ) {
      const response = yield call(register, payload);

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
    },

    //重置密码
    *forger(
      { payload }: { payload: ResetParamsType },
      { call }: { call: any },
    ) {
      const response = yield call(forgetPassword, payload);
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
    },
  },

  reducers: {
    saveCurrentUser(state: any, action: any) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },

    changeLoginStatus(state: any, { payload }: { payload: any }) {
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
