import { parse } from 'querystring';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

export const getLocalStorage = (key: string) => {
  const data = localStorage.getItem(key)
  if(!data) return undefined
  const realData: any = JSON.parse(data)
  const { timestamp, data: target } = realData
  const now = Date.now()
  if(!!timestamp) {
    if(now >= timestamp) {
      localStorage.removeItem(key)
      return undefined
    }
    return target
  }
  return target
}

export const setLocalStorage = (key: string, value: any, timestamp: false | number=false) => {
  const data = JSON.stringify({
    data: value,
    ...(!timestamp ? {} : { timestamp: timestamp + Date.now() })
  })
  localStorage.setItem(key, data)
}

export const removeLocalStorate = (key: string) => {
  localStorage.removeItem(key)
}

// 处理query 传参的时候导致的空字符串查询问题（后端不愿意给处理）
export const formatQuery = (query: any ={})=>{
  let ret = {}
  Object.keys(query).map((key)=>{
    if( query[key] !== null && query[key] !== undefined && query[key]!=='' ){
      ret[key] = query[key]
    }
  })
  return ret;
}

export function withTry<T=any> (func: Function) {
  return async function(...args: any[]): Promise<[any, T | null]> {
    try {
      const data = await func(...args)
      return [null, data]
    }catch(err) {
      return [err, null]
    }
  }
}

const NEETWORK = 'http://47.111.229.250:4000'
// const NEETWORK = 'http://localhost:4000'

export function formatUrl(url: string) {
  if(typeof url !== 'string') return url
  return url.startsWith('http') ? url : (url.startsWith('/') ? `${NEETWORK}${url}` : `${NEETWORK}/${url}`)
}

