import React, { useState, useCallback, memo } from 'react'
import type {  FC } from 'react'
import { Button } from 'antd'
import { FileImageOutlined } from '@ant-design/icons'
import type { AffixProps } from 'antd/es/affix'

import styles from './affix.less'

interface IProps extends Partial<AffixProps> {
  onClick?: () => void
}

const Affix: FC<IProps> = (props) => {

  const [ position, setPosition ] = useState<number>(50)

  const handleShow = useCallback(() => {
    setPosition(0)
  }, [])

  const handleHide = useCallback(() => {
    setPosition(50)
  }, [])

  return (
    <div
      className={styles["image-viewer-affix"]}
      style={{
        transform: `translateX(${(position)}%)`
      }}
    >
      <Button 
        shape="circle"
        onMouseEnter={handleShow}
        onMouseLeave={handleHide}
        onClick={props.onClick}
        icon={<FileImageOutlined />} 
        type="text"
      ></Button>
    </div>
  )
  
}

export default memo(Affix)