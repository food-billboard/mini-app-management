import React, { memo, FC } from 'react'
import { Row, Col } from 'antd'
import {  } from 'fabric'
import { IBaseProps } from '../types'

interface IProps extends IBaseProps {

}

const Config: FC<IProps> = () => {

  return (
    <Row
      gutter={24}
    >
      
    </Row>
  )

}

export default memo(Config)