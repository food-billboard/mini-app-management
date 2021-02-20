import {
  
} from '@ant-design/pro-form'
import { Transfer } from 'antd'
import { unstable_batchedUpdates } from 'react-dom'
import { TransferDirection, TransferItem } from 'antd/es/transfer'
import React, { useState, useEffect } from 'react'
import WrapperItem from '@/components/WrapperItem'

interface IProps {
  placeholder?: string
  fetchData: () => Promise<ISelectItem[]>
  fetchSelectData?: () => Promise<string[]>
  onChange?: (value: string[]) => any
  value?: string[]
}

export interface ISelectItem extends TransferItem {
  title: string
  key: string
}

const SearchSelect: React.FC<IProps> = ({
  fetchData,
  fetchSelectData,
  onChange:propsChange,
  value: propsValue = []
}) => {

  const [ list, setList ] = useState<Array<ISelectItem>>([])
  const [ selected, setSelected ] = useState<Array<string>>([])

  const onChange = (newTargetKeys: string[], direction:TransferDirection, moveKeys: string[]) => {
    setSelected(newTargetKeys)
    propsChange && propsChange(newTargetKeys)
  }

  const getData = async () => {
    const data = await fetchData()
    let selected = propsValue
    if(fetchSelectData) selected = await fetchSelectData()
    unstable_batchedUpdates(() => {
      setList(data)
      setSelected(selected)
    })
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <Transfer
      showSearch
      dataSource={list}
      targetKeys={selected}
      onChange={onChange}
      render={item => item.title}
      oneWay
      pagination
      operations={['添加', '删除']}
    />
  )

}

export default WrapperItem<IProps>(SearchSelect)