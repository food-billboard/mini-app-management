import React, { FC, Fragment, memo, useCallback, useRef, useState } from 'react'
import { Button, message, Result, Modal } from 'antd'
import { history } from 'umi'
import { DataAbout } from './component/List'
import { AboutInfo, TPath, TEditActionType, TDeleteActionType, TAddActionType } from './component/Item'
import { Edit, IEditRef } from './component/Edit' 

const CardList: FC<any> = () => {

  const path: TPath = history.location.path.split('/').slice(-1)

  const [ formState, setFormState ] = useState<'add' | 'edit'>('add')

  const editRef = useRef<IEditRef>(null)

  const goBack = useCallback(() => {
    history.go(-1)
  }, [])

  const addItem: TAddActionType = useCallback(() => {
    editRef.current?.open()
    setFormState('add')
  }, [])
  
  const deleteItem: TDeleteActionType = useCallback((id: string) => {
    Modal.confirm({
      cancelText: '取消',
      okText: '确定',
      title: '提示',
      content: '是否确定删除',
      onOk() {
        return AboutInfo[path].delete({
          _id: id
        })
      }
    })
  }, [])
  
  const editItem: TEditActionType = useCallback((id: string) => {
    editRef.current?.open({
      id
    })
    setFormState('edit')
  }, [])

  const confirm = useCallback(async () => {

    try {
      await AboutInfo[path][formState]
    }catch(err) {
      console.log(err)
      message.error('操作失败，请重试')
    }

  }, [formState])

  if(!Object.keys(AboutInfo).every(key => key === path)) return <Result
    status="404"
    title="404"
    subTitle="没有找到对应的页面"
    extra={<Button type="primary" onClick={goBack}>返回</Button>}
  />

  return (
    <Fragment>
      <DataAbout
        fetchData={AboutInfo[path].fetchData}
        headerContent={null}
        headerExtra={null}
        renderItem={AboutInfo[path].renderItem({
          addItem,
          deleteItem,
          editItem
        })}
      />
      <Edit
        ref={editRef}
        renderForm={AboutInfo[path].renderForm}
        fetchData={AboutInfo[path].fetchData}
        onConfirm={confirm}
      />
    </Fragment>
  )

}

export default memo(CardList)