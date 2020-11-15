import React from 'react';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons'
import classNames from 'classnames';
import styles from './index.less';

const Trend = ({ colorful = true, reverseColor = false, flag, children, className, ...rest }: {
  colorful?: boolean,
  reverseColor?: boolean,
  flag?: string | React.ReactNode,
  children?: any[],
  className?: string,
  style?: React.CSSProperties
  // rest?: any
}) => {
  const classString = classNames(
    styles.trendItem,
    {
      [styles.trendItemGrey]: !colorful,
      [styles.reverseColor]: reverseColor && colorful,
    },
    className,
  );
  return (
    <div {...rest} className={classString} title={typeof children === 'string' ? children : ''}>
      <span>{children}</span>
      {flag}
    </div>
  );
};

Trend.flag = (flag: any) => {
  if(typeof flag !== 'number' || flag == 0) return ''
  return (
    <span className={styles[flag]}>
      {
        flag > 0 ? 
        <CaretUpOutlined />
        :
        <CaretDownOutlined />
      }
    </span>
  )
}

export default Trend;
