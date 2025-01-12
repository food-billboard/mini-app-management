import { ProPage } from '@/components/ProTable';
import { message } from '@/components/Toast';
import { deleteThirdData, getThirdList } from '@/services';
import type { ActionType } from '@ant-design/pro-components';
import { Button } from 'antd';
import { memo, useCallback, useRef } from 'react';
import columns from './columns';
import type { AddModalRef } from './components/AddModal';
import AddModal from './components/AddModal';
import type { TestModalRef } from './components/TestModal';
import TestModal from './components/TestModal';

const ThirdPartyManage = memo(() => {
  const actionRef = useRef<ActionType>();
  const addModalRef = useRef<AddModalRef>(null);
  const testModalRef = useRef<TestModalRef>(null);

  const handleDelete = useCallback(
    async (record: API_THIRD.GetThirdListData[]) => {
      const { _id } = record[0];

      await deleteThirdData({ _id })
        .then(() => {
          return actionRef.current?.reloadAndRest?.();
        })
        .catch(() => {
          message.info('删除错误');
        });
    },
    [],
  );

  const handleUpdate = useCallback(
    async (record: API_THIRD.GetThirdListData) => {
      addModalRef.current?.open(record);
    },
    [],
  );

  const handleAdd = useCallback(async () => {
    addModalRef.current?.open();
  }, []);

  const handleTest = useCallback((record: API_THIRD.GetThirdListData) => {
    testModalRef.current?.open(record);
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
              key="update"
              type="link"
              onClick={handleUpdate.bind(null, record)}
            >
              修改
            </Button>
            <Button
              style={{ padding: 0 }}
              key="test"
              type="link"
              onClick={handleTest.bind(null, record)}
            >
              测试
            </Button>
          </>
        );
      }}
      scroll={{ x: 'max-content' }}
      headerTitle="第三方接口列表"
      actionRef={actionRef}
      rowKey="_id"
      toolBarRender={() => {
        return [
          <Button key="add" type="primary" onClick={handleAdd}>
            新增
          </Button>,
        ];
      }}
      tableAlertRender={false}
      pagination={{
        pageSize: 10,
      }}
      request={async ({ current, ...nextParams }) => {
        return getThirdList({
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
    >
      <AddModal
        ref={addModalRef}
        onConfirm={() => actionRef.current?.reloadAndRest?.()}
      />
      <TestModal ref={testModalRef} />
    </ProPage>
  );
});

export default ThirdPartyManage;
