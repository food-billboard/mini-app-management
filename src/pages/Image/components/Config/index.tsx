import React, { useImperativeHandle, useState, forwardRef, useCallback, memo } from 'react'
import { Drawer, Result, InputNumber, Button, Descriptions } from 'antd'
import type { DrawerProps } from 'antd/es/drawer'
import ViewerInstance from 'viewerjs'

export interface IImageConfigRef {
  open: () => void
  close: (e: any) => void
}

interface IProps extends Partial<DrawerProps> {
  instance: ViewerInstance
}

const { Item: DescriptionItem } = Descriptions

const Config = forwardRef<IImageConfigRef, IProps>((props, ref) => {

  const [ visible, setVisible ] = useState<boolean>(false)

  const close = useCallback((e) => {
    setVisible(false)
    props.onClose?.(e)
  }, [props])

  useImperativeHandle(ref, () => ({
    open: () => setVisible(true),
    close
  }))

  const moveTop: () => ViewerInstance = useCallback(() => {
    return props.instance?.move(0, -5)
  }, [props.instance])

  const moveLeft: () => ViewerInstance = useCallback(() => {
    return props.instance?.move(-5, 0)
  }, [props.instance])

  const moveRight: () => ViewerInstance = useCallback(() => {
    return props.instance?.move(5, 0)
  }, [props.instance])

  const moveBottom: () => ViewerInstance = useCallback(() => {
    return props.instance?.move(0, 5)
  }, [props.instance])

  const rotate: (val: string | number | undefined) => ViewerInstance = useCallback((val) => {
    let value = typeof val === 'number' ? val : parseFloat(val ?? '0')
    value = (Number.isNaN(value)) ? 0 : value
    return props.instance?.rotate(value)
  }, [props.instance])

  const rotateTo: (val: string | number | undefined) => ViewerInstance = useCallback((val) => {
    let value = typeof val === 'number' ? val : parseFloat(val ?? '0')
    value = (Number.isNaN(value)) ? 0 : value
    return props.instance?.rotateTo(value)
  }, [props.instance])

  // const zoom = useCallback(() => {
    
  // }, [props.instance])

  // const zoomTo = useCallback(() => {
    
  // }, [props.instance])

  const reset = useCallback(() => {
    props.instance?.reset()
  }, [props.instance])

  return (
    <Drawer
      visible={visible}
      title={'图片操作'}
      {...props}
      onClose={close}
    >
      {
        !props.instance && (
          <Result
            status="404"
            title="404"
            subTitle="对不起，未知原因导致无法启动图片预览功能"
          />
        )
      }
      {
        !!props.instance && (
          <Descriptions
            bordered
            column={1}
            extra={<Button type="primary" onClick={reset}>重置</Button>}
            size={'small'}
          >
            <DescriptionItem 
              label="移动"
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-evenly'
                }}
              >
                <Button type="primary" onClick={moveTop}>上</Button>
                <Button type="primary" onClick={moveBottom}>下</Button>
                <Button type="primary" onClick={moveLeft}>左</Button>
                <Button type="primary" onClick={moveRight}>右</Button>
              </div>
            </DescriptionItem>
            <DescriptionItem
              label="旋转"
            >
              <InputNumber
                defaultValue={90} 
                onChange={rotate} 
                style={{width: '100%'}}
              />
            </DescriptionItem>
            <DescriptionItem
              label="旋转至"
            >
              <InputNumber 
                defaultValue={270} 
                onChange={rotateTo} 
                style={{width: '100%'}}
              />
            </DescriptionItem>
          </Descriptions>
        )
      }
    </Drawer>
  )

})

export const ImageConfig = memo(Config)