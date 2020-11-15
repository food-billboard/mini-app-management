import React from 'react';
import classNames from 'classnames';
import styles from './index.less';

const NumberInfo = ({ theme, title, subTitle, total, subTotal, status, suffix, gap, ...rest }: {
  theme?: 'lignht',
  title?: string | React.ReactNode,
  subTitle?: string | React.ReactNode,
  total?: string | React.ReactNode,
  subTotal?: string | React.ReactNode,
  status?: React.ReactNode,
  suffix?: React.ReactNode | string,
  gap?: number,
  rest?: Array<any>
}) => (
  <div
    className={classNames(styles.numberInfo, {
      [styles[`numberInfo${theme}`]]: theme,
    })}
    {...rest}
  >
    {title && (
      <div className={styles.numberInfoTitle} title={typeof title === 'string' ? title : ''}>
        {title}
      </div>
    )}
    {subTitle && (
      <div
        className={styles.numberInfoSubTitle}
        title={typeof subTitle === 'string' ? subTitle : ''}
      >
        {subTitle}
      </div>
    )}
    <div
      className={styles.numberInfoValue}
      style={
        gap
          ? {
              marginTop: gap,
            }
          : {}
      }
    >
      <span>
        {total}
        {!!suffix && <em className={styles.suffix}>{suffix}</em>}
      </span>
      {(status || subTotal) && (
        <span className={styles.subTotal}>
          {subTotal}
          {status}
        </span>
      )}
    </div>
  </div>
);

export default NumberInfo;
