import { ProPage } from '@/components/ProTable';
import { message } from '@/components/Toast';
import { deleteMessage, getMessageList, postMessage } from '@/services';
import { PlusOutlined } from '@ant-design/icons';
import { ActionType } from '@ant-design/pro-components';
import { Button } from 'antd';
import { identity, omit, pickBy } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { history } from 'umi';
import columns from './columns';
import Form, { IFormRef } from './components/CreateForm';

interface IProps {
  role: any;
}

const CardList: React.FC<IProps> = () => {
  const [roomId, setRoomId] = useState<string>('');

  const actionRef = useRef<ActionType>();

  const formRef = useRef<IFormRef>(null);

  const handleRemove = async (selectedRows: API_CHAT.IGetMessageResData[]) => {
    try {
      await deleteMessage({
        _id: selectedRows.map((item) => item._id).join(','),
      });
    } catch (err) {
      return false;
    }
    actionRef.current?.reloadAndRest?.();
    return true;
  };

  const onSubmit = useCallback(async (value: API_CHAT.IPostMessageParams) => {
    try {
      await postMessage(value as API_CHAT.IPostMessageParams);
      message.info('操作成功');
      actionRef.current?.reloadAndRest?.();
      return Promise.resolve();
    } catch (err) {
      message.info('操作失败，请重试');
      return Promise.reject();
    }
  }, []);

  const handleModalVisible = () => {
    return formRef.current?.open(roomId);
  };

  useEffect(() => {
    const {
      location: { pathname },
    } = history;
    const [target] = pathname.split('/').slice(-1) || [];
    setRoomId(target);
  }, []);

  useEffect(() => {
    if (roomId) actionRef.current?.reloadAndRest?.();
  }, [roomId]);

  return (
    <ProPage
      action={{
        remove: {
          action: handleRemove,
        },
      }}
      scroll={{ x: 'max-content' }}
      search={false}
      headerTitle="消息列表"
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
          新建
        </Button>,
      ]}
      request={async (params: any) => {
        if (!roomId)
          return {
            data: [],
            total: 0,
          };
        const { current, ...nextParams } = params;
        let newParams: any = {
          ...omit(nextParams, ['createdAt']),
          currPage: current - 1,
          _id: roomId,
        };
        newParams = pickBy(newParams, identity);
        return getMessageList(newParams)
          .then(({ list, total }) => {
            return { data: list, total };
          })
          .catch(() => ({ data: [], total: 0 }));
      }}
      columns={columns as any}
      rowSelection={{}}
    >
      <Form ref={formRef} onSubmit={onSubmit} />
    </ProPage>
  );
};

export default CardList;
