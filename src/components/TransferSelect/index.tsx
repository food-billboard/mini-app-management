import React, { memo, forwardRef, useEffect, useCallback, useState, useMemo } from 'react'
import { Transfer } from 'antd'
import { TransferItem, TransferProps, RenderResult } from 'antd/es/transfer'
import { omit } from 'lodash'
import Wrapper from '../WrapperItem'

export interface ISelectItem extends TransferItem {
  title: string
  key: string
}

type IProps = Partial<TransferProps<any>> & {
  placeholder?: string
  fetchData: (value?: any) => Promise<ISelectItem[]>
  fetchSelectData?: () => Promise<string[]>
  onChange?: (value: string[]) => any
  value?: string[]
  onSearch?: (direction: string, value: string) => void 
}

export default Wrapper<IProps>(memo(forwardRef<any, IProps>((props) => {

  const [ originData, setOriginData ] = useState<ISelectItem[]>([])

  const { 
    value=[], 
    fetchSelectData, 
    fetchData: fetchOriginData, 
    onChange: propsChange,
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
    if(fetchSelectData) {
      const data = await fetchSelectData()
      propsChange?.(data)
    }
  }, [value, fetchSelectData])

  const fetchData = useCallback(async () => {
    await internalFetchOriginData()
    await internalFetchTargetKeysData()
  }, [internalFetchOriginData, internalFetchTargetKeysData])

  const onChange = useCallback((newTargetKeys: React.Key[]) => {
    propsChange?.(newTargetKeys as string[])
  }, [propsChange])

  const renderItem = useMemo(() => {
    return (item: TransferItem) => {
      return item.title as RenderResult
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Transfer
      dataSource={originData}
      targetKeys={value}
      onChange={onChange}
      oneWay
      pagination
      operations={['添加', '删除']}
      showSearch
      render={renderItem}
      {...omit(comProps, ['dataSource'])}
    />
  )

})))