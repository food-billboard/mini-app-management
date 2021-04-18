import {
  Form
} from 'antd'
import { FormItemProps } from 'antd/lib/form'
import React from 'react'
import merge from 'lodash/merge'

const { Item } = Form

type TFormState<T> = {
  item?: T
  wrapper: FormItemProps
}

function WrapperItem<T> (Component: React.FC<any>, interState?: Partial<TFormState<T>>) {

  return function(outrState: TFormState<T>) {

    const { wrapper={}, item={} } = merge({}, interState, outrState)

    return (
      <Item {...wrapper}>
        <Component {...item} />
      </Item>
    )

  }

}

export default WrapperItem