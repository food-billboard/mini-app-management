import { ProPage } from '@/components/ProTable';
import { message } from '@/components/Toast';
import {
  deleteInstanceInfo,
  getInstanceInfoList,
  postInstanceInfo,
  putInstanceInfo,
} from '@/services';
import { withTry } from '@/utils';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-components';
import { Button } from 'antd';
import { pick } from 'lodash';
import React, { useCallback, useRef } from 'react';
import columns from './columns';
import type { IFormRef } from './components/form';
import Form from './components/form';

const InstanceManage: React.FC<any> = () => {
  const actionRef = useRef<ActionType>();

  const modalRef = useRef<IFormRef>(null);

  const handleAdd = useCallback(
    async (
      values:
        | API_INSTANCE.IPostInstanceInfoParams
        | API_INSTANCE.IPutInstanceInfoParams,
    ) => {
      try {
        if ((values as API_INSTANCE.IPutInstanceInfoParams)['_id']) {
          await putInstanceInfo(values as API_INSTANCE.IPutInstanceInfoParams);
        } else {
          await postInstanceInfo(
            values as API_INSTANCE.IPostInstanceInfoParams,
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

  const putInfo = useCallback(
    async (value: boolean, record: API_INSTANCE.IGetInstanceInfoData) => {
      await handleAdd({
        ...pick(record, ['info', 'notice', '_id']),
        valid: value,
      });
      actionRef.current?.reloadAndRest?.();
    },
    [actionRef, handleAdd],
  );

  const handleModalVisible = useCallback(
    (values?: API_INSTANCE.IGetInstanceInfoData) => {
      modalRef.current?.open(values);
    },
    [modalRef],
  );

  const handleRemove = useCallback(
    async (selectedRows: API_INSTANCE.IGetInstanceInfoData[]) => {
      try {
        await deleteInstanceInfo({
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
        const { valid } = record;
        const commonProps: any = {
          style: {
            paddingLeft: 0,
          },
          type: 'link',
        };
        return (
          <>
            <Button {...commonProps} onClick={() => handleModalVisible(record)}>
              编辑
            </Button>
            {valid && (
              <Button
                {...commonProps}
                onClick={putInfo.bind(null, false, record)}
                danger
              >
                禁用
              </Button>
            )}
            {!valid && (
              <Button
                {...commonProps}
                onClick={putInfo.bind(null, true, record)}
              >
                启用
              </Button>
            )}
          </>
        );
      }}
      search={false}
      headerTitle="实例列表"
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
      request={async () => {
        return getInstanceInfoList()
          .then(({ list, total }) => ({ data: list, total }))
          .catch(() => ({ data: [], total: 0 }));
      }}
      columns={columns}
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

export default InstanceManage;
