import { Upload } from '@/components/Upload';
import { withTry } from '@/utils';
import { pick } from 'lodash';

type TGetOriginData<O, T> = (data: O) => T;

export const fileValidator = (length: number) => (_: any, value: string[]) => {
  return Upload.valid(value, length)
    ? Promise.resolve()
    : Promise.reject(new Error('请先上传或添加文件'));
};

export function localFetchData4Array<T extends object, O = T[], K = any>(
  fetchMethod: () => any,
  ...restArgs: any[]
) {
  return async function filter(
    ...pickParams: [
      ...[keyof T, string][],
      [keyof T, string] | TGetOriginData<O, T[]>,
    ]
  ): Promise<K[]> {
    const [, data] = await withTry<O>(fetchMethod)(...restArgs);
    if (!data) return [];
    const lastParams = pickParams[pickParams.length - 1];
    const getOriginData = typeof lastParams === 'function' ? lastParams : null;
    const realRestPickParams = getOriginData
      ? pickParams.slice(0, -1)
      : pickParams;
    const realData = getOriginData ? getOriginData(data) : data;

    return (
      (realData as T[])?.map((item: T) => {
        const keysMap = (realRestPickParams as [keyof T, string][]).reduce(
          (acc: any, cur: [keyof T, string]) => {
            const [prevKey, newKey] = cur;
            acc[prevKey] = newKey;
            return acc;
          },
          {},
        );
        const newValue: any = pick(item, Object.keys(keysMap));
        return Object.keys(newValue).reduce((acc: any, cur: string) => {
          acc[keysMap[cur]] = newValue[cur];
          return acc;
        }, {});
      }) ?? []
    );
  };
}

export async function localFetchData4Object<T extends object, O = T, K = any>(
  fetchMethod: () => any,
  ...restArgs: any[]
) {
  return async function filter(
    ...pickParams: [
      ...[keyof T, string][],
      [keyof T, string] | TGetOriginData<O, T[]>,
    ]
  ): Promise<K> {
    const [, data] = await withTry<O>(fetchMethod)(...restArgs);
    if (!data) return {} as K;
    const lastParams = pickParams[pickParams.length - 1];
    const getOriginData = typeof lastParams === 'function' ? lastParams : null;
    const realRestPickParams = getOriginData
      ? pickParams.slice(0, -1)
      : pickParams;
    const realData = getOriginData ? getOriginData(data) : data;
    const keysMap = (realRestPickParams as [keyof T, string][]).reduce(
      (acc: any, cur: [keyof T, string]) => {
        const [prevKey, newKey] = cur;
        acc[prevKey] = newKey;
        return acc;
      },
      {},
    );
    const newValue: any = pick(realData, Object.keys(keysMap));
    return Object.keys(newValue).reduce((acc: any, cur: string) => {
      acc[keysMap[cur]] = newValue[cur];
      return acc;
    }, {});
  };
}
