import { ProPage } from '@/components/ProTable';
import { message } from '@/components/Toast';
import { getScoreUser, putScoreUser } from '@/services';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-components';
import { Button } from 'antd';
import { createRef, memo, useCallback, useRef } from 'react';
import columns from './columns';
import CreateForm from './components/CreateForm';

const ScoreUserManage = memo(() => {
  const actionRef = useRef<ActionType>();

  const modalRef = createRef<CreateForm>();

  const handleAdd = useCallback(async (fields: any) => {
    const hide = message.loading('正在添加');

    const { _id } = fields;

    const params = {
      _id,
      join_task: true,
    };

    try {
      await putScoreUser(params);
      hide();
      message.success('操作成功');
      return true;
    } catch (error) {
      hide();
      message.error('操作失败请重试！');
      return false;
    }
  }, []);

  const handleRemove = useCallback(
    async (selectedRows: API_USER.IGetUserListResData[]) => {
      try {
        await putScoreUser({
          _id: selectedRows.map((item) => item._id).join(','),
          join_task: false 
        });
      } catch (err) {
        return false;
      }
      actionRef.current?.reloadAndRest?.();
      return true;
    },
    [actionRef],
  );

  const handleModalVisible = () => {
    modalRef.current?.open();
  };

  const onSubmit = useCallback(async (value: any) => {
    const success = await handleAdd(value);

    if (success) {
      actionRef.current?.reload();
      return Promise.resolve();
    }
    return Promise.reject();
  }, []);

  const fetchData = useCallback(async (params: any) => {
    const { current, ...nextParams } = params;
    let newParams = {
      ...nextParams,
      currPage: current - 1,
    };
    return getScoreUser(newParams)
      .then(({ list, total }) => ({ data: list, total }))
      .catch(() => ({ data: [], total: 0 }));
  }, []);

  return (
    <ProPage
      action={{
        remove: {
          action: handleRemove,
          label: '取消参与',
        },
      }}
      scroll={{ x: 'max-content' }}
      headerTitle="参与用户列表"
      actionRef={actionRef}
      pagination={{ defaultPageSize: 10 }}
      rowKey="_id"
      toolBarRender={(action, { selectedRows }) => [
        <Button
          key={'add'}
          icon={<PlusOutlined />}
          type="primary"
          onClick={() => handleModalVisible()}
        >
          新增
        </Button>,
      ]}
      request={fetchData}
      columns={columns as any}
      rowSelection={false}
    >
      <CreateForm onSubmit={onSubmit} ref={modalRef} />
    </ProPage>
  );
});

export default ScoreUserManage;
