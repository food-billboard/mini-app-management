import pick from 'lodash/pick'
import { withTry } from '@/utils'
import { Upload } from '@/components/Upload'

type TGetOriginData<O, T> = (data: O) => T

export const fileValidator = (length: number ) => (_: any, value: Array<string>) => {
  return Upload.valid(value, length) ? Promise.resolve() : Promise.reject('请先上传或添加文件')
}

export function localFetchData4Array<T extends object, O=T[], K=any>(fetchMethod: Function, ...restArgs: any[]) {

  return async function(
    ...pickParams: [...([keyof T, string][]), ([keyof T, string] | TGetOriginData<O, T[]>)]
  ): Promise<K[]> {
    let [ , data ] = await withTry<O>(fetchMethod)(...restArgs)
    if(!data) return []
    const lastParams = pickParams[pickParams.length - 1]
    let getOriginData = typeof lastParams === 'function' ? lastParams : null
    let realRestPickParams = getOriginData ? pickParams.slice(0, -1) : pickParams
    const realData = getOriginData ? getOriginData(data) : data

    return (realData as T[])?.map((item: T) => {
      const keysMap = (realRestPickParams as [keyof T, string][]).reduce((acc:any, cur: [ keyof T, string ]) => {
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

export async function localFetchData4Object<T extends object, O=T, K=any>(fetchMethod: Function, ...restArgs: any[]) {

  return async function(
    ...pickParams: [...([keyof T, string][]), ([keyof T, string] | TGetOriginData<O, T[]>)]
  ): Promise<K> {
    let [ , data ] = await withTry<O>(fetchMethod)(...restArgs)
    if(!data) return {} as K
    const lastParams = pickParams[pickParams.length - 1]
    let getOriginData = typeof lastParams === 'function' ? lastParams : null
    let realRestPickParams = getOriginData ? pickParams.slice(0, -1) : pickParams
    const realData = getOriginData ? getOriginData(data) : data
    const keysMap = (realRestPickParams as [keyof T, string][]).reduce((acc:any, cur: [ keyof T, string ]) => {
      const [ prevKey, newKey ] = cur
      acc[prevKey] = newKey
      return acc
    }, {})
    const newValue = pick(realData, Object.keys(keysMap))
    return Object.keys(newValue).reduce((acc: any, cur: string) => {
      acc[keysMap[cur]] = newValue[cur]
      return acc
    }, {})
  }

}