import { Form } from 'antd';
import { FormItemProps } from 'antd/lib/form';
import { merge } from 'lodash';
import React from 'react';

const { Item } = Form;

type TFormState<T> = {
  item?: T;
  wrapper: FormItemProps;
};

function WrapperItem<T>(
  Component: React.FC<any>,
  interState?: Partial<TFormState<T>>,
) {
  return function (outerState: TFormState<T>) {
    const { wrapper = {}, item = {} } = merge({}, interState, outerState);

    return (
      <Item {...wrapper}>
        <Component {...item} />
      </Item>
    );
  };
}

export default WrapperItem;
