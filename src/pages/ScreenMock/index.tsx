import { ProPage } from '@/components/ProTable';
import { message } from '@/components/Toast';
import {
  deleteScreenMock,
  getScreenMockList,
  postScreenMock,
  updateScreenMock,
} from '@/services';
import type { ActionType } from '@ant-design/pro-components';
import { Button } from 'antd';
import { memo, useCallback, useRef } from 'react';
import type { IFormRef } from './AddModal';
import AddModal from './AddModal';
import columns from './columns';

const ScreenMockManage = memo(() => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<IFormRef>(null);

  const handleDelete = useCallback(
    async (record: API_SCREEN.IGetScreenMockData[]) => {
      const { _id } = record[0];

      await deleteScreenMock({ _id })
        .then(() => {
          return actionRef.current?.reloadAndRest?.();
        })
        .catch(() => {
          message.info('删除错误');
        });
    },
    [],
  );

  const handleEdit = useCallback((record?: API_SCREEN.IGetScreenMockData) => {
    formRef.current?.open(record);
  }, []);

  const handleConfirm = useCallback(
    async (value: API_SCREEN.IPostScreenMockDataParams & { _id?: string }) => {
      const method = value._id ? updateScreenMock : postScreenMock;
      return method(value as any)
        .then(() => {
          return true;
        })
        .then(() => {
          return actionRef.current?.reloadAndRest?.();
        })
        .catch(() => {
          message.info('操作错误');
          return false;
        });
    },
    [],
  );

  return (
    <ProPage
      action={{
        remove: {
          multiple: false,
          action: handleDelete,
        },
      }}
      extraActionRender={(record) => {
        return (
          <>
            <Button
              style={{ padding: 0 }}
              key="edit"
              type="link"
              onClick={handleEdit.bind(null, record)}
            >
              编辑
            </Button>
          </>
        );
      }}
      scroll={{ x: 'max-content' }}
      headerTitle="大屏Mock数据列表"
      actionRef={actionRef}
      rowKey="_id"
      toolBarRender={() => {
        return [
          <Button key="leadin" type="primary" onClick={() => handleEdit()}>
            新增
          </Button>,
        ];
      }}
      tableAlertRender={false}
      pagination={false}
      request={({ ...nextParams }) => {
        return getScreenMockList({
          ...(nextParams as any),
        })
          .then((data) => {
            return { data: data.list, total: data.total };
          })
          .catch(() => ({ data: [], total: 0 }));
      }}
      columns={columns as any}
      rowSelection={false}
    >
      <AddModal ref={formRef} onSubmit={handleConfirm} />
    </ProPage>
  );
});

export default ScreenMockManage;
