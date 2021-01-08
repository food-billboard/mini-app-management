import {
  Input,
  Tag,
  message,
  Tooltip
} from 'antd'
import React, { useEffect, Fragment, useRef, useState, useMemo } from 'react'
import { PlusOutlined, InfoCircleOutlined } from '@ant-design/icons'
import isEqual from 'lodash/isEqual'
import noop from 'lodash/noop'
import WrapperItem from '@/components/WrapperItem'

const COLOR_LIST = [ "magenta", "red", "volcano", "orange", "gold", "lime", "green", "cyan", "blue", "geekblue", "purple" ]

interface IProps {
  value?: string[]
  onChange?: (value: string[]) => any 
  [key: string]: any
}

const generateColor = () => COLOR_LIST[Math.floor(Math.random() * COLOR_LIST.length)]

const InputSearch: React.FC<IProps> = ({
  value=[],
  onChange=noop
}: IProps) => {

  const [ colorList, setColorList ] = useState<string[]>(value.map(_ => generateColor()))

  const inputRef = useRef<Input | null>(null)

  const onClose = (tagStr: string) => {
    onChange(value.filter((item: string) => item !== tagStr))
  }

  const search = (newValue: string) => {
    let _value = newValue.slice(0, 20)
    if(value.includes(_value)) {
      message.info('名称已经存在')
      return
    }
    onChange([
      ...value,
      _value
    ])
    inputRef.current?.setValue('')
  }

  useEffect(() => {
    // message.info('添加成功')
    const len = value.length - colorList.length
    if(len > 0) {
      setColorList([
        ...colorList,
        ...new Array(len).fill(0).map(_ => generateColor())
      ])
    }
  }, [ value ])

  return (
    <Fragment>
      <Input.Search 
        // addonBefore={
        //   <Tooltip title="超出20个字符会自动截断">
        //     <InfoCircleOutlined />
        //   </Tooltip>
        // } 
        style={{marginBottom: 20}} 
        ref={inputRef} 
        enterButton={<PlusOutlined />} 
        allowClear onSearch={search} 
        onPressEnter={(e: any) => search(e.target.value)} 
      />
      {
        value.map((item: string, index: number) => {
          return (
            <Tag style={{marginBottom: 8}} key={item} color={colorList[index]} closable onClose={() => onClose(item)}>{item}</Tag>
          )
        })
      }
    </Fragment>
  )
}

export default WrapperItem<IProps>(React.memo(InputSearch, (prevProps: IProps, nextProps: IProps) => {
  if(isEqual(prevProps.value, nextProps.value)) return true
  return false
}))