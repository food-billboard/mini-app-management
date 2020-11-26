import {
  Form
} from 'antd'
import { FormItemProps } from 'antd/lib/form'
import React from 'react'

const { Item } = Form

function WrapperItem<T> (Component: React.FC<any>) {

  return function(props: T & FormItemProps) {

    return (
      <Item {...props}>
        <Component {...props} />
      </Item>
    )

  }

}

export default WrapperItem