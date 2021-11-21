import React, { useRef, useCallback, memo, useMemo, useState } from 'react'
import { Button, message, Input, Modal } from 'antd'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import ProTable from '@ant-design/pro-table'
import type { ActionType } from '@ant-design/pro-table'
import column from './columns'
import { getScheduleList, putScheduleDealTime, restartScheduleDeal, cancelScheduleDeal, invokeScheduleDeal } from '@/services'

const ScheduleManage = memo(() => {

  const [ time, setTime ] = useState<string>("")

  const actionRef = useRef<ActionType>()

  const handleCancel = useCallback(async (record: API_SCHEDULE.IGetScheduleListData) => {
    const { name } = record

    await cancelScheduleDeal({ name })
    .then(_ => {
      return actionRef.current?.reloadAndRest?.()
    })
    .catch(err => {
      message.info("取消任务失败")
    })

  }, [])

  const restartSchedule = useCallback(async (record: API_SCHEDULE.IGetScheduleListData) => {
    const { name } = record

    await restartScheduleDeal({ name })
    .then(_ => {
      return actionRef.current?.reloadAndRest?.()
    })
    .catch(err => {
      message.info("重新启动任务失败")
    })
  }, [])

  const handleInvokeSchedule = useCallback(async (record: API_SCHEDULE.IGetScheduleListData) => {
    const { name } = record

    await invokeScheduleDeal({ name })
    .then(_ => {
      return actionRef.current?.reloadAndRest?.()
    })
    .catch(err => {
      message.info("立即执行任务失败")
    })
  }, [])

  const handlePutScheduleTime = useCallback(async (record: API_SCHEDULE.IGetScheduleListData) => {
    setTime("")
    Modal.confirm({
      title: "请设置需要执行的时间",
      content: (
        <Input value={time} onChange={e => setTime(e.target.value)} placeholder="* * * * * *" />
      ),
      onOk: () => {
        if(!time) {
          message.info("请设置正确的执行时间格式")
          return Promise.reject()
        }
        return putScheduleDealTime({
          name: record.name,
          time
        })
        .then(_ => {
          setTime("")
        })
        .catch(_ => {
          message.info("修改时间失败")
        }) 
      }
    })
  }, [time])

  const columns: any[] = useMemo(() => {
    return [
      ...column ,
      {
        title: '操作',
        key: 'option',
        dataIndex: 'option',
        valueType: 'option',
        render: (_: any, record: API_SCHEDULE.IGetScheduleListData) => {
          const { status } = record
          return (
            <>
              <Button
                type="link"
                danger={status === "SCHEDULING"}
                onClick={status === "SCHEDULING" ? handleCancel.bind(null, record) : restartSchedule.bind(null, record)}
              >
                {
                  status === "SCHEDULING" ? "取消执行" : "重新启动"
                }
              </Button>
              <Button type="link" onClick={handleInvokeSchedule.bind(null, record)}>立即执行</Button>
              <Button type="link" onClick={handlePutScheduleTime.bind(null, record)}>修改执行时间</Button>
            </>
          )
        }
      }
    ]
  
  }, [handleCancel, restartSchedule, handleInvokeSchedule, handlePutScheduleTime])

  const fetchData = useCallback(async () => {
    return getScheduleList()
    .then((data) => ({ data, total: data.length }) )
    .catch(() => ({ data: [], total: 0 }))
  }, [])

  return (
    <PageHeaderWrapper>
      <ProTable
        scroll={{ x: 'max-content' }}
        headerTitle="用户反馈列表"
        actionRef={actionRef}
        pagination={false}
        rowKey="_id"
        toolBarRender={false}
        tableAlertRender={false}
        search={false}
        request={fetchData}
        columns={columns}
        rowSelection={false}
      />
    </PageHeaderWrapper>
  )
})

export default ScheduleManage