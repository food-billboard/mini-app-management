import { ProPage } from '@/components/ProTable';
import { message } from '@/components/Toast';
import { deleteMember, getMemberList, postMember } from '@/services';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-components';
import { Button } from 'antd';
import { identity, omit, pickBy } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { connect, history } from 'umi';
import columns from './columns';
import type { IFormRef } from './components/CreateForm';
import Form from './components/CreateForm';
import { mapDispatchToProps, mapStateToProps } from './connect';

interface IProps {
  role: any;
}

const CardList: React.FC<IProps> = () => {
  const [roomId, setRoomId] = useState<string>('');

  const actionRef = useRef<ActionType>();

  const formRef = useRef<IFormRef>(null);

  const handleRemove = async (
    selectedRows: API_CHAT.IGetMemberListResData[],
  ) => {
    try {
      for(let i = 0; i < selectedRows.length; i ++) {
        const { _id } = selectedRows[i]
        await deleteMember({
          _id,
          room: roomId,
        });
      }
    }catch(err) {
      return false 
    }
    actionRef.current?.reloadAndRest?.()
    return true 
  };

  const onSubmit = useCallback(async (value: API_CHAT.IPostMemberParams) => {
    try {
      await postMember(value as API_CHAT.IPostMemberParams);
      message.info('操作成功');
      actionRef.current?.reloadAndRest?.();
    } catch (err) {
      message.info('操作失败，请重试');
    }
  }, []);

  const handleModalVisible = () => {
    return formRef.current?.open(roomId);
  };

  useEffect(() => {
    const {
      location: { pathname },
    } = history;
    const [id] = pathname.split('/').slice(-1) || [];
    setRoomId(id);
  }, []);

  useEffect(() => {
    if (roomId) actionRef.current?.reloadAndRest?.();
  }, [roomId]);

  return (
    <ProPage
      action={{
        remove: {
          action: handleRemove
        }
      }}
      search={false}
      headerTitle="成员列表"
      actionRef={actionRef}
      scroll={{ x: 'max-content' }}
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
        </Button>
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
          room: roomId,
        };
        newParams = pickBy(newParams, identity);
        return getMemberList(newParams)
          .then(({ list, total }) => ({ data: list, total }))
          .catch(() => ({ data: [], total: 0 }));
      }}
      columns={columns}
      rowSelection={{}}
    >
      <Form ref={formRef} onSubmit={onSubmit} />
    </ProPage>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(CardList);
