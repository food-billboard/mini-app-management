import {
  
} from '@ant-design/pro-form'
import { Transfer } from 'antd'
import { TransferDirection, TransferItem } from 'antd/es/transfer'
import React, { useState, useEffect } from 'react'
import WrapperItem from './WrapperItem'

interface IProps {
  placeholder?: string
  fetchData: () => Promise<ISelectItem[]>
  fetchSelectData?: () => Promise<string[]>
  onChange?: (value: string[]) => any
  value?: string[]
}

interface ISelectItem extends TransferItem {
  title: string
  id: string
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
    console.log(newTargetKeys, direction, moveKeys)
    setSelected(newTargetKeys)
    console.log(newTargetKeys)
    propsChange && propsChange(newTargetKeys)
  }

  const getData = async () => {
    const data = await fetchData()
    let selected = propsValue
    if(fetchSelectData) selected = await fetchSelectData()
    setList(data)
    setSelected(selected)
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