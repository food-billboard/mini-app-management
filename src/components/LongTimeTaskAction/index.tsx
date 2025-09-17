import { useState, useRef } from 'react'
import type { ActionType } from '@ant-design/pro-components';
import { CloudUploadOutlined } from '@ant-design/icons'
import { FloatButton, Tooltip } from 'antd'
import { Modal } from '../ProModal'
import ProTable from '../ProTable'
import TaskShow from './TaskShow'
import {
  getLongTimeTaskList
} from '@/services';

export default () => {

  const [visible, setVisible] = useState(false)
  const actionRef = useRef<ActionType>();

  return (
    <>
      <FloatButton
        icon={<CloudUploadOutlined />}
        type="primary"
        onClick={() => setVisible(true)}
      ></FloatButton>
      <Modal
        open={visible}
        title="耗时任务列表"
        footer={null}
        onClose={() => setVisible(false)}
        destroyOnClose
        onCancel={() => setVisible(false)}
        width={820}
      >
        <ProTable
          action={{
            remove: false 
          }}
          extraActionRender={record => {
            return (
              <>
                <TaskShow onClose={() => setVisible(false)} value={record as API_MEDIA.IGetLongTimeTaskListData} />
              </>
            )
          }}
          rowSelection={false}
          scroll={{ x: 'max-content' }}
          actionRef={actionRef}
          rowKey="_id"
          toolBarRender={() => []}
          tableAlertRender={false}
          pagination={false}
          request={async ({ current, ...nextParams }) => {
            return getLongTimeTaskList({
              ...nextParams,
              currPage: 0,
              pageSize: 999,
            })
              .then((data) => {
                return { data: data.list, total: data.total };
              })
              .catch(() => ({ data: [], total: 0 }));
          }}
          columns={[
            {
              title: '页面',
              dataIndex: 'page',
            },
            {
              title: '状态',
              dataIndex: 'status',
              valueEnum: {
                SUCCESS: '成功',
                FAIL: '失败',
                PROCESS: '执行中'
              }
            },
            {
              title: '请求地址',
              dataIndex: 'request_url',
              width: 150
            },
            {
              title: '请求方法',
              dataIndex: 'request_method',
            },
            {
              title: '请求数据',
              dataIndex: 'request_data',
              renderText: (value) => {
                if(value.length <= 20) return value 
                return (
                  <Tooltip
                    title={value}
                  >
                    {value.slice(0, 20)}...
                  </Tooltip>
                )
              }
            },
            {
              title: '响应数据',
              dataIndex: 'response',
              renderText: (value='') => {
                if(value.length <= 20) return value 
                return (
                  <Tooltip
                    title={value}
                  >
                    {value.slice(0, 20)}...
                  </Tooltip>
                )
              }
            },
            {
              title: '完成时间',
              dataIndex: 'deal_time',
            },
            {
              title: '创建时间',
              dataIndex: 'createdAt',
            },
            {
              title: '修改时间',
              dataIndex: 'updatedAt',
            },
          ]}
          search={false}
        />
      </Modal>
    </>
  )

}