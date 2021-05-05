import { Avatar, Tooltip } from 'antd'
import { AvatarProps } from 'antd/es/avatar'
import React, { useMemo, ReactElement, JSXElementConstructor, ReactChildren } from 'react'
import classNames from 'classnames'
import styles from './index.less'

const avatarSizeToClassName = (size: AvatarProps["size"]) =>
  classNames(styles.avatarItem, {
    [styles.avatarItemLarge]: size === 'large',
    [styles.avatarItemSmall]: size === 'small',
    [styles.avatarItemMini]: size === 'mini',
  })

const AvatarItem = ({ src, size, tips, onClick = () => {} }: {
  src: string 
  size: AvatarProps["size"]
  tips?: React.ReactNode | string 
  onClick?: any
}) => {
  const cls = avatarSizeToClassName(size);
  return (
    <li className={cls} onClick={onClick}>
      {tips ? (
        <Tooltip title={tips}>
          <Avatar
            src={src}
            size={size}
            style={{
              cursor: 'pointer',
            }}
          />
        </Tooltip>
      ) : (
        <Avatar src={src} size={size} />
      )}
    </li>
  );
}

interface IProps {
  children: ReactChildren | ReactElement[]
  size: AvatarProps["size"]
  maxLength?: number
  excessItemsStyle?: React.CSSProperties
}
const AvatarList = (props: IProps) => {

  const { children, size, maxLength = 5, excessItemsStyle={}, ...other } = useMemo(() => {
    return props 
  }, [props])

  const numOfChildren = React.Children.count(children)
  const numToShow = maxLength >= numOfChildren ? numOfChildren : maxLength
  const childrenArray = React.Children.toArray(children)
  const childrenWithProps = childrenArray.slice(0, numToShow).map(child =>
    React.cloneElement(child as ReactElement<any, string | JSXElementConstructor<any>>, {
      size,
    }),
  )

  if (numToShow < numOfChildren) {
    const cls = avatarSizeToClassName(size);
    childrenWithProps.push(
      <li key="exceed" className={cls}>
        <Avatar size={size} style={excessItemsStyle}>{`+${numOfChildren - maxLength}`}</Avatar>
      </li>,
    )
  }

  return (
    <div {...other} className={styles.avatarList}>
      <ul> {childrenWithProps} </ul>
    </div>
  )
}

AvatarList.Item = AvatarItem
export default AvatarList
