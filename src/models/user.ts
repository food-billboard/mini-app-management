import { stringify } from 'querystring'
import { queryCurrent, forgetPassword, register, LoginParamsType, fakeAccountLogin, RegisterParamsType, ResetParamsType } from '@/services'
import { setAuthority } from '@/utils/authority'
import { getPageQuery, setLocalStorage, removeLocalStorate, getLocalStorage } from '@/utils'
import { history } from 'umi'
import { message } from 'antd'

interface IUserModelState {
  currentUser?: CurrentUser
  status: any
}

interface CurrentUser {
  avatar?: string;
  name?: string;
  title?: string;
  group?: string;
  signature?: string;
  tags?: {
    key: string;
    label: string;
  }[];
  userid?: string;
  unreadCount?: number;
}

export {
  IUserModelState,
  CurrentUser
}

export default {
  namespace: 'user',

  state: {
    currentUser: {},
    status: false,
  },

  effects: {

    //获取用户信息
    * fetchCurrent(_: any, { call, put }: { call: any, put: any }) {
      const token = getLocalStorage('token')
      let data 
      if(!token) {
        data = {}
      }else {
        data = yield call(queryCurrent)
      }
      yield put({
        type: 'saveCurrentUser',
        payload: data
      })
      return data
    },

    //登录
    * login({ payload }: { payload: LoginParamsType }, { call, put }: { call: any, put: any }) {
      const response = yield call(fakeAccountLogin, payload);

      //加入缓存
      const { currentAuthority } = response
      setLocalStorage('token', currentAuthority, 24 * 60 * 60 * 1000)

      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.status === 'ok') {
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
        history.replace(redirect || '/');
      }
    },

    //退出登录
    * logout(_: any, { put }: { put: any }) {
      const { redirect } = getPageQuery();
      removeLocalStorate('token')
      yield put({
        type: 'saveCurrentUser',
        payload: {}
      })
      yield put({
        type: 'changeLoginStatus',
        payload: {}
      })
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
    * register({ payload }: { payload: RegisterParamsType }, { call }: { call: any }) {
      const response = yield call(register, payload)

      //注册成功跳转至登录
      if (response.status === 'ok') {
        message.success({
          content: '注册成功',
          duration: 1.5,
          onClose: () => {
            history.replace('/user/login');
          }
        })
      }
    },

    //重置密码
    * forger({ payload }: { payload: ResetParamsType }, { call }: { call: any }) {
      const response = yield call(forgetPassword, payload)

      //重置成功跳转至登录
      if (response.status === 'ok') {
        message.success({
          content: '重置成功',
          duration: 1.5,
          onClose: () => {
            history.replace('/user/login');
          }
        })
      }
    }

  },

  reducers: {

    saveCurrentUser(state: any, action: any) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },

    changeLoginStatus(state: any, { payload }: { payload: any }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },

  }

}