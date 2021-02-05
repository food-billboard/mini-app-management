import React, { memo, FC } from 'react'
import {  } from 'antd'
import { fabric } from 'fabric'
import Circle from './Circle'
import Image from './Image'

interface IProps {
  getInstance: () => fabric.Canvas
}

let i = 1

const Config: FC<IProps> = ({
  getInstance
}) => {

  return (
    <div
      onClick={() => {
        const instance = getInstance()
        // var rect = new fabric.Rect({
        //   left: 100,
        //   top: 100,
        //   fill: 'red',
        //   width: 20,
        //   height: 20
        // })
        // instance?.add(rect)
        instance?.setZoom(++i)
      }}
    >1111</div>
  )

}

export default memo(Config)