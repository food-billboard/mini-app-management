import pick from 'lodash/pick'
import { withTry } from '@/utils'
import { Upload } from './Upload'

export const fileValidator = (length: number) => (_: any, value: Array<string>) => {
  return Upload.valid(value, length) ? Promise.resolve() : Promise.reject('请先上传或添加文件')
}

export function localFetchData4Array<T extends object, K=any>(fetchMethod: Function, ...restArgs: any[]) {

  return async function(...pickParams: Array<[keyof T, string]>): Promise<K[]> {
    let [ , data ] = await withTry<Array<T>>(fetchMethod)(...restArgs)
    if(!data) data = []
    return data?.map((item: T) => {
      const keysMap = pickParams.reduce((acc:any, cur: [ keyof T, string ]) => {
        const [ prevKey, newKey ] = cur
        acc[prevKey] = newKey
        return acc
      }, {})
      const newValue = pick(item, Object.keys(keysMap))
      return Object.keys(newValue).reduce((acc: any, cur: string) => {
        acc[keysMap[cur]] = newValue[cur]
        return acc
      }, {})
    }) ?? []
  }

}

export async function localFetchData4Object<T extends object, K=any>(fetchMethod: Function, ...restArgs: any[]) {

  return async function(...pickParams: Array<[keyof T, string]>): Promise<K> {

    let [ , data ] = await withTry<T>(fetchMethod)(...restArgs)
    if(!data) data = {} as T

    const keysMap = pickParams.reduce((acc:any, cur: [ keyof T, string ]) => {
      const [ prevKey, newKey ] = cur
      acc[prevKey] = newKey
      return acc
    }, {})
    const newValue = pick(data, Object.keys(keysMap))
    return Object.keys(newValue).reduce((acc: any, cur: string) => {
      acc[keysMap[cur]] = newValue[cur]
      return acc
    }, {})
  }

}