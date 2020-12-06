import {
  Form
} from 'antd'
import { FormItemProps } from 'antd/lib/form'
import React from 'react'

const { Item } = Form

function WrapperItem<T> (Component: React.FC<any>) {

  return function({
    item,
    wrapper
  }: {
    item?: T
    wrapper: FormItemProps
  }) {

    return (
      <Item {...wrapper}>
        <Component {...item} />
      </Item>
    )

  }

}

export default WrapperItem