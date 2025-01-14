import { ProPage } from '@/components/ProTable';
import { message } from '@/components/Toast';
import {
  deleteCurrentMenu,
  getCurrentMenuList,
  postCurrentMenu,
  putCurrentMenu,
} from '@/services';
import { withTry } from '@/utils';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-components';
import { Button } from 'antd';
import React, { useCallback, useRef } from 'react';
import columns from './columns';
import type { IFormRef } from './components/form';
import Form from './components/form';

const EatWhatManage: React.FC<any> = () => {
  const actionRef = useRef<ActionType>();

  const modalRef = useRef<IFormRef>(null);

  const handleAdd = useCallback(
    async (values: API.PostEatMenuData | API.PutEatMenuData) => {
      try {
        if ((values as API.PutEatMenuData)['_id']) {
          await putCurrentMenu(values as API.PutEatMenuData);
        } else {
          await postCurrentMenu(values as API.PostEatMenuData);
        }
        message.success('操作成功');
        return Promise.resolve();
      } catch (err) {
        message.error('操作失败');
        return Promise.reject(new Error('false'));
      }
    },
    [],
  );

  const handleModalVisible = useCallback(
    (values?: API.GetEatMenuListData) => {
      modalRef.current?.open(values);
    },
    [modalRef],
  );

  const handleRemove = useCallback(
    async (selectedRows: API.GetEatMenuListData[]) => {
      try {
        await deleteCurrentMenu({
          _id: selectedRows.map((item) => item._id).join(','),
        });
      } catch (err) {
        return false;
      }
      actionRef.current?.reloadAndRest?.();
      return true;
    },
    [],
  );

  return (
    <ProPage
      action={{
        remove: {
          action: handleRemove,
        },
      }}
      extraActionRender={(record) => {
        return (
          <Button
            type="link"
            style={{ paddingLeft: 0 }}
            onClick={() => handleModalVisible(record)}
          >
            编辑
          </Button>
        );
      }}
      headerTitle="今天吃什么菜单列表"
      actionRef={actionRef}
      pagination={{ defaultPageSize: 10 }}
      rowKey="_id"
      scroll={{ x: 'max-content' }}
      toolBarRender={(action, { selectedRows }) => [
        <Button
          key={'add'}
          icon={<PlusOutlined />}
          type="primary"
          onClick={() => handleModalVisible()}
        >
          新建
        </Button>,
      ]}
      request={async (params) => {
        const { current = 1, date = [] } = params;
        return getCurrentMenuList({
          ...params,
          currPage: current - 1,
          date: `${date[0]},${date[1]}`,
        })
          .then(({ list, total }) => ({ data: list, total }))
          .catch(() => ({ data: [], total: 0 }));
      }}
      columns={columns as any}
      rowSelection={{}}
    >
      <Form
        onSubmit={async (value) => {
          await withTry(handleAdd)(value);
          actionRef.current?.reload();
        }}
        ref={modalRef}
      />
    </ProPage>
  );
};

export default EatWhatManage;
