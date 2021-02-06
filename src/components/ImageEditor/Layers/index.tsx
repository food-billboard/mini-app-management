import { List, Typography, Button, Checkbox, Tooltip } from 'antd'
import React, { FC, useMemo, Fragment, useState, useCallback, useEffect, memo } from 'react'
import { fabric } from 'fabric'
import { EditOutlined, FormOutlined, CloseSquareOutlined } from '@ant-design/icons'

interface IProps {
  getInstance: () => fabric.Canvas
}

const Layers: FC<IProps> = ({
  getInstance
}) => {

  const [ disabled, setDisabled ] = useState<boolean>(true)
  const [ editable, setEditable ] = useState<boolean>(false)

  const list = useMemo(() => {
    const instance = getInstance()
    return instance?.getObjects() || []
  }, undefined)
  const selectedList = useMemo(() => {
    const instance = getInstance()
    return instance?.getActiveObjects() || []
  }, undefined)

  //删除
  const onRemove = useCallback(() => {
    const instance = getInstance()
    selectedList.forEach(obj => {
      instance?.remove(obj) //动画 fxremove
    })
  }, [list, selectedList])

  //复制
  const onClone = useCallback(async () => {
    const instance = getInstance()
    selectedList.forEach(obj => {
      const cloneObj = fabric.util.object.clone(obj)
      instance?.add(cloneObj)
    })
  }, [selectedList])

  //设置编辑状态
  const setEditableStatus = useCallback((status: boolean) => {
    setEditable(status)
  }, [])

  //选中
  const onSelectChange = useCallback((isSelect: boolean, item: fabric.Object) => {
    const instance = getInstance()
    // const activeGroup = instance.discardActiveObject()
    console.log('选中状态修改')
  }, [getInstance])

  const onEdit = useCallback((item: fabric.Object) => {
    console.log('打开编辑')
  }, [])

  useEffect(() => {
    setDisabled(!selectedList.length)
  }, [selectedList])

  return (
    <Fragment>
      <List
        header={
            <div
              style={{textAlign: 'right'}}
            >
              <Tooltip
                title="选择图层"
              >
                {
                  editable ? 
                  <CloseSquareOutlined style={{cursor: 'pointer'}} onClick={setEditableStatus.bind(this, false)} />
                  :
                  <FormOutlined style={{cursor: 'pointer'}} onClick={setEditableStatus.bind(this, true)} />
                }
              </Tooltip>
            </div>
        }
        dataSource={list}
        footer={
          <div
            style={{display: editable ? 'flex' : 'none', justifyContent: 'space-evenly', flexWrap: 'wrap'}}
          >
            <Button danger disabled={disabled} onClick={onRemove} style={{marginBottom: 10}}>删除</Button>
            <Button type="primary" disabled={disabled} onClick={onClone}>复制</Button>
          </div>
        }
        bordered={false}
        renderItem={(item, index) => {
          
          return (
            <List.Item>
              <Typography.Text>
                <Checkbox checked={!!selectedList.find(obj => obj == item)} onChange={(e) => onSelectChange.call(this, e.target.checked, item)} />
                <EditOutlined style={{cursor: 'pointer'}} onClick={onEdit.bind(this, item)} />
              </Typography.Text> 图层-{index + 1}
            </List.Item>
          )
        }}
      >
      </List>
    </Fragment> 
  )

}

export default memo(Layers)