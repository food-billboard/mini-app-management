import { getDvaApp, history } from 'umi'
import { message, notification } from '@/components/Toast'
import axios from 'axios';
import type { AxiosRequestConfig } from 'axios'
import { stringify } from 'querystring'
import { debounce } from 'lodash'
import { formatQuery } from './utils'

const codeMessage: {[key: string] : string} = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求方法不被允许。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

interface RequestOptions extends AxiosRequestConfig{
  mis?: boolean
  origin?: boolean 
}

// 未登录的多次触发处理
const dispatchLogin = debounce(function(err){
  const app = getDvaApp()
  const dispatch = app._store.dispatch
  const querystring = stringify({
    redirect: window.location.href,
  })
  history.replace(`/user/login?${querystring}`)
  if( dispatch ){
    dispatch({type: 'user/logout'});
  }
  message.error(err.msg || '未登录请先登录');
}, 1000, {'leading': true, 'trailing': false} )

// 处理报错
export const misManage = (error: any) => {
  if( error.messageType === 'body' ){
    const err = error.err || {}

    // 未登录处理
    if( error.errorType === 'system' && err.code === '401' ){
      return dispatchLogin(err);
    }
    message.error(err.msg || '网络错误');
    return
  }
  const { response } = error;
  if( response && response.status === 401 ){
    return dispatchLogin(error);
  }
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;
    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
}

const REACT_APP_ENV = process.env.REACT_APP_ENV
const API_DOMAIN = process.env.REQUEST_API;

const request = async <ResBody>(url: string, setting: RequestOptions = {} as RequestOptions)=>{

  // 过滤URL参数
  const { params, mis=true, origin, headers={}, data={}, method, ...options } = setting

  let body: any
  let error: any

  try{
    // !!! tnnd 不知道为什么代理到后端的ip服务器就一直500，开发环境就自己本地再起个代理服务器吧，如果后端的服务器不是ip的就直接走下面就行 !!!!
    if(false && REACT_APP_ENV === 'dev' && API_DOMAIN?.includes('8002')) {
      body = await axios.request({
        method: 'POST',
        url: '/api/request',
        ...options,
        data: {
          config: {
            data,
            method,
            headers,
            params,
            url
          }
        }
      });
    }else {
      body = await axios.request({
        method,
        url,
        headers,
        ...options,
        ...(params ? { params: formatQuery(params) } : {
          data
        }),
      });
    }
  } catch(err) {
    error = err
  }

  // 报错分为两种，
  // 系统错误，由 httpClient 拦截到的错误 如，4xx，5xx
  if( error ){
    error.errorType = 'system';
    error.messageType = 'response';
    if(mis) misManage(error);
    throw error
  }

  // 业务错误，客户端返回的 statusCode === 200 但是response.body 中的success 返回为 false的错误
  if( body && body.success === false ){
    error = body;
    error.errorType = 'logic';
    error.messageType = 'body';
  }

  // 返回真正的response body res 内容
  if( !error ) {
    if(origin) return body 
    return (body?.data?.res?.data || {}) as ResBody
  }
  error.mis = mis
  if(mis) misManage(error);
  throw error
};

export default request