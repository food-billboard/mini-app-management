import { ProPage } from '@/components/ProTable';
import { message } from '@/components/Toast';
import { deleteScreenModel, getScreenModelList } from '@/services';
import type { ActionType } from '@ant-design/pro-components';
import { Button } from 'antd';
import { memo, useCallback, useRef } from 'react';
import { exportData, LeadIn } from '../Screen/utils';
import columns from './columns';

const ScreenManage = memo(() => {
  const actionRef = useRef<ActionType>();

  const handleDelete = useCallback(
    async (record: API_SCREEN.IGetScreenListData[]) => {
      const { _id } = record[0];

      await deleteScreenModel({ _id })
        .then(() => {
          return actionRef.current?.reloadAndRest?.();
        })
        .catch(() => {
          message.info('删除错误');
        });
    },
    [],
  );

  const handleExport = useCallback(
    async (record: API_SCREEN.IGetScreenListData) => {
      const { _id } = record;

      await exportData({ _id, type: 'model' }).catch(() => {
        message.info('导出失败');
      });
    },
    [],
  );

  const handleLeadIn = useCallback(async () => {
    LeadIn('model', () => {
      return actionRef.current?.reloadAndRest?.();
    });
  }, []);

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
              key="export"
              type="link"
              onClick={handleExport.bind(null, record)}
            >
              导出
            </Button>
          </>
        );
      }}
      scroll={{ x: 'max-content' }}
      headerTitle="模板列表"
      actionRef={actionRef}
      rowKey="_id"
      toolBarRender={() => {
        return [
          <Button key="leadin" type="primary" onClick={handleLeadIn}>
            导入
          </Button>,
        ];
      }}
      tableAlertRender={false}
      pagination={{
        pageSize: 10,
      }}
      request={({ current, ...nextParams }) => {
        return getScreenModelList({
          currPage: (current || 1) - 1,
          ...nextParams,
        })
          .then((data) => {
            return { data: data.list, total: data.total };
          })
          .catch(() => ({ data: [], total: 0 }));
      }}
      columns={columns as any}
      rowSelection={false}
    />
  );
});

export default ScreenManage;
