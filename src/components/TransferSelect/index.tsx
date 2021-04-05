import React, { memo, forwardRef, useEffect, useCallback, useState, useMemo } from 'react'
import { Transfer } from 'antd'
import { TransferItem, TransferProps } from 'antd/es/transfer'
import { omit } from 'lodash'
import Wrapper from '../WrapperItem'

export interface IMovieSelectRef {

}

export interface ISelectItem extends TransferItem {
  title: string
  key: string
}

interface IProps extends Partial<TransferProps> {
  placeholder?: string
  fetchData: (value?: string) => Promise<ISelectItem[]>
  fetchSelectData?: () => Promise<string[]>
  onChange?: (value: string[]) => any
  value?: string[]
  onSearch?: (direction: string, value: string) => void 
}

export default Wrapper<IProps>(memo(forwardRef<IMovieSelectRef, IProps>((props, ref) => {

  const [ originData, setOriginData ] = useState<ISelectItem[]>([])
  const [ targetKeys, setTargetKeys ] = useState<string[]>([])

  const { 
    value=[], 
    fetchSelectData, 
    fetchData: fetchOriginData, 
    onChange: propsChange,
    onSearch: propsOnSearch,
    ...comProps
  } = useMemo(() => {
    const { ...nextProps } = props 
    return {
      ...nextProps,
    }

  }, [props])

  const internalFetchOriginData = useCallback(async (value?: string) => {
    const data = await fetchOriginData(value)
    setOriginData(data)
  }, [fetchOriginData])

  const internalFetchTargetKeysData = useCallback(async () => {
    let selected = value
    if(fetchSelectData) selected = await fetchSelectData()
    setTargetKeys(selected)
  }, [value, fetchSelectData])

  const fetchData = useCallback(async () => {
    await internalFetchOriginData()
    await internalFetchTargetKeysData()
  }, [internalFetchOriginData, internalFetchTargetKeysData])

  const onChange = useCallback((newTargetKeys: string[], direction: string, moveKeys: string[]) => {
    setTargetKeys(newTargetKeys)
    propsChange && propsChange(newTargetKeys)
  }, [propsChange])

  const onSearch = useCallback((direction: string, value: string) => {
    propsOnSearch && propsOnSearch(direction, value)
    if(direction == 'left') {
      internalFetchOriginData(value)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Transfer
      dataSource={originData}
      targetKeys={targetKeys}
      onChange={onChange}
      oneWay
      pagination
      operations={['添加', '删除']}
      showSearch
      {...omit(comProps, ['dataSource'])}
    />
  )

})))