import { Modal } from 'antd';
import { parse } from 'querystring';
import { message } from '@/components/Toast'
import { API_DOMAIN } from '../../config/proxy';

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

export const getLocalStorage = (key: string) => {
  const data = localStorage.getItem(key);
  if (!data) return undefined;
  const realData: any = JSON.parse(data);
  const { timestamp, data: target } = realData;
  const now = Date.now();
  if (timestamp) {
    if (now >= timestamp) {
      localStorage.removeItem(key);
      return undefined;
    }
    return target;
  }
  return target;
};

export const setLocalStorage = (key: string, value: any, timestamp: false | number = false) => {
  const data = JSON.stringify({
    data: value,
    ...(!timestamp ? {} : { timestamp: timestamp + Date.now() }),
  });
  localStorage.setItem(key, data);
};

export const removeLocalStorage = (key: string) => {
  localStorage.removeItem(key);
};

// 处理query 传参的时候导致的空字符串查询问题（后端不愿意给处理）
export const formatQuery = (query: any = {}) => {
  const ret: any = {};
  Object.keys(query).forEach((key) => {
    if (query[key] !== null && query[key] !== undefined && query[key] !== '') {
      ret[key] = query[key];
    }
  });
  return ret;
};

export function withTry<T = any>(func: (...args: any[]) => any) {
  return async function (...args: any[]): Promise<[any, T | null]> {
    try {
      const data = await func(...args);
      return [null, data];
    } catch (err) {
      return [err, null];
    }
  };
}

export function formatUrl(url: string) {
  if (typeof url !== 'string') return url;
  return url.startsWith('http')
    ? url
    : url.startsWith('/')
    ? `${API_DOMAIN}${url}`
    : `${API_DOMAIN}/${url}`;
}

export async function sleep(time: number = 1000) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, time)
  });
}

export function fileSize(size: number) {
  if (Number.isNaN(+size) || size < 0) return 0;
  const unitMap = ['b', 'kb', 'mb', 'g'];
  const realSize = +size;
  function cal(internalSize: number, index: number = 0): string {
    if (internalSize < 1024 || index === unitMap.length - 1) return internalSize + unitMap[index];
    return cal(Math.ceil(internalSize / 1024), index + 1);
  }
  return cal(realSize);
}

export async function commonDeleteMethod<T = any>(
  items: T[],
  action: (item: T) => Promise<any>,
  reload?: any,
): Promise<boolean | null> {
  const res = await new Promise((resolve) => {
    Modal.confirm({
      cancelText: '取消',
      centered: true,
      content: '是否确定删除',
      okText: '确定',
      title: '提示',
      onCancel(close) {
        close();
        resolve(false);
      },
      onOk(close) {
        close();
        resolve(true);
      },
    });
  });

  if (!res) return null;

  const hide = message.loading('正在删除');
  if (!items) return true;

  const response = await Promise.all(items.map(action))
    .then(() => {
      hide();
      message.success('删除成功，即将刷新');
      reload?.();
      return true;
    })
    .catch(() => {
      hide();
      message.error('删除失败，请重试');
      return false;
    });

  return response;
}
