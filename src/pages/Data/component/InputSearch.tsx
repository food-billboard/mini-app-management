import {
  Input,
  Tag,
  message
} from 'antd'
import React, { useEffect, Fragment } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import isEqual from 'lodash/isEqual'
import noop from 'lodash/noop'
import WrapperItem from './WrapperItem'

const COLOR_LIST = [ "magenta", "red", "volcano", "orange", "gold", "lime", "green", "cyan", "blue", "geekblue", "purple" ]

interface IProps {
  value: string[]
  onChange: (value: string[]) => any 
  [key: string]: any
}

const InputSearch: React.FC<IProps> = ({
  value=[],
  onChange=noop
}: IProps) => {

  const onClose = (tagStr: string) => {
    onChange(value.filter((item: string) => item !== tagStr))
  }

  const search = (newValue: string) => {
    if(value.includes(newValue)) {
      message.info('名称已经存在')
      return
    }
    onChange([
      ...value,
      newValue
    ])
  }

  useEffect(() => {
    message.info('添加成功')
  }, [ value ])

  return (
    <Fragment>
      <Input.Search enterButton={<PlusOutlined />} allowClear onSearch={search} onPressEnter={(e: any) => search(e.target.value)} />
      {
        value.map((item: string) => {
          const i = Math.floor(Math.random() * COLOR_LIST.length)
          const color = COLOR_LIST[i]
          return (
            <Tag color={color} closable onClose={() => onClose(item)}>{item}</Tag>
          )
        })
      }
    </Fragment>
  )
}

export default WrapperItem<IProps>(React.memo(InputSearch, (prevProps: IProps, nextProps: IProps) => {
  if(isEqual(prevProps.value, nextProps.value)) return false
  return true
}))