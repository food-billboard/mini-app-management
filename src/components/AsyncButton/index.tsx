import { Button as AntButton } from 'antd'
import type { ButtonProps } from 'antd'
import { useCallback, useState } from 'react'

const Button = (props: ButtonProps) => {

  const [ loading, setLoading ] = useState(false)

  const { onClick: propsOnClick, ...nextProps } = props 

  const onClick = useCallback(async (e) => {
    setLoading(true)
    try {
      await propsOnClick?.(e)
    }catch{}
    setLoading(false)
  }, [propsOnClick])

  return (
    <AntButton loading={loading} {...nextProps} onClick={onClick} />
  )

}

export default Button