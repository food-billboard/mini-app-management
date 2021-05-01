import React, { useCallback, useMemo } from 'react'
import { Select } from 'antd'
import { ROLES_MAP } from '@/utils'

export default ({ value, props }: {value: string, props: any}) => {

  const options = useMemo(() => {
    return Object.entries(ROLES_MAP).map((cur) => {
      const [ value, title ] = cur
      return (
        <Select.Option value={value}>{title}</Select.Option>
      )
    })
  }, [])

  const { onChange } = useMemo(() => {
    const { fieldProps: { onChange } } = props 
    return {
      onChange
    }
  }, [props])

  const onSelectChange = useCallback((value) => {
    onChange(value) 
  }, [onChange])

  return (
    <Select
      mode={"multiple"}
      onChange={onSelectChange}
      value={Array.isArray(value) ? value : (value ? [value] : [])}
    >
      {options}
    </Select>
  )
}