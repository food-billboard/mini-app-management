import React, { memo, FC, useMemo } from 'react'
import { Tabs } from 'antd'
import { fabric } from 'fabric'
import Circle from './Circle'
import Rect from './Rect'
import Image from './Image'
import Background from './Background'
import { IBaseProps } from './types'

const { TabPane } = Tabs

interface IProps extends IBaseProps {
  
}

const Config: FC<IProps> = ({
  getInstance
}) => {

  const isActive = useMemo(() => {
    const instance = getInstance()
    return !!instance?.getActiveObjects().length
  }, undefined)

  if(isActive) return <Background getInstance={getInstance} />

  return (
    <Tabs
      tabPosition={"right"}
    > 
      <TabPane tab="circle" key="circle">
        <Circle getInstance={getInstance} />
      </TabPane>
      <TabPane tab="rect" key="rect">
        <Rect getInstance={getInstance} />
      </TabPane>
      <TabPane tab="image" key="image">
        <Image getInstance={getInstance} />
      </TabPane>
    </Tabs>
  )

}

export default memo(Config)


//instance.centerObject(object) 水平垂直居中
//instance.centerObjectH(object) 水平居中
//instance.centerObjectV(object) 垂直居中
//instance.clear() 清空画布
//instance.discardActiveObject() 试试能不能取消选中
//instance.forEachObject(callback, context) 遍历对象数组
//instance.getWidth getHeight getZoom
//isEmpty() 是否为空
//item(index) 获取指定索引的object
//loadFromJSON(json, callback, reviveropt)
//moveTo(object, index)
//remove(…object)
//renderAll()
//setActiveObject(object, eopt) 使指定对象变为选中，其他都不选中
//setBackgroundColor(backgroundColor, callback) setBackgroundImage(image, callback, optionsopt)
//setHeight(value, optionsopt)
//setWidth(value, optionsopt) 
//setZoom(value)
//size()
//toCanvasElement(multiplieropt, croppingopt)
//toDatalessJSON(propertiesToIncludeopt) 
//toDatalessObject(propertiesToIncludeopt)
//toDataURL(optionsopt)
//toJSON(propertiesToIncludeopt)
//toObject(propertiesToIncludeopt)
//toString()
//toSVG(optionsopt, reviveropt) 
