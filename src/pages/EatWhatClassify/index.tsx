import { ProPage } from '@/components/ProTable';
import { message } from '@/components/Toast';
import {
  deleteCurrentMenuClassify,
  getCurrentMenuClassifyList,
  postCurrentMenuClassify,
  putCurrentMenuClassify,
} from '@/services';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-components';
import { Button } from 'antd';
import React, { useCallback, useRef } from 'react';
import columns from './columns';
import type { IFormRef } from './components/form';
import Form from './components/form';

const EatWhatClassifyManage: React.FC<any> = () => {
  const actionRef = useRef<ActionType>();

  const modalRef = useRef<IFormRef>(null);

  const handleAdd = useCallback(
    async (
      values: API.PostEatMenuClassifyData | API.PutEatMenuClassifyData,
    ) => {
      const realValues = {
        ...values,
        menu_type: values.menu_type.join(','),
      };
      try {
        if ((values as API.PutEatMenuData)['_id']) {
          await putCurrentMenuClassify(
            realValues as API.PutEatMenuClassifyData,
          );
        } else {
          await postCurrentMenuClassify(
            realValues as API.PostEatMenuClassifyData,
          );
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
    async (values?: API.GetEatMenuClassifyListData) => {
      modalRef.current?.open(values);
    },
    [modalRef],
  );

  const handleRemove = useCallback(
    async (selectedRows: API.GetEatMenuClassifyListData[]) => {
      try {
        await deleteCurrentMenuClassify({
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
      headerTitle="今天吃什么菜单分类"
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
        return getCurrentMenuClassifyList({
          ...params,
          currPage: current - 1,
          date: `${date[0]},${date[1]}`,
        })
          .then(({ list, total }) => ({ data: list, total }))
          .catch(() => ({ data: [], total: 0 }));
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
      columns={columns}
      rowSelection={{}}
    >
      <Form
        onSubmit={async (value) => {
          await handleAdd(value);
          actionRef.current?.reload();
        }}
        ref={modalRef}
      />
    </ProPage>
  );
};

export default EatWhatClassifyManage;
