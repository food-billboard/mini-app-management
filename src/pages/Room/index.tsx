import { ProPage } from '@/components/ProTable';
import { message } from '@/components/Toast';
import { deleteRoom, getRoomList, postRoom, putRoom } from '@/services';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-components';
import { Button } from 'antd';
import { identity, pickBy } from 'lodash';
import React, { useCallback, useRef } from 'react';
import { connect } from 'umi';
import columns from './columns';
import type { IFormRef } from './components/CreateForm';
import Form from './components/CreateForm';
import { mapDispatchToProps, mapStateToProps } from './connect';

interface IProps {
  role: any;
}

const CardList: React.FC<IProps> = () => {
  const actionRef = useRef<ActionType>();

  const formRef = useRef<IFormRef>(null);

  const handleModalVisible = (data?: API_CHAT.IGetRoomListResData) => {
    return formRef.current?.open(data);
  };

  const handleRemove = async (selectedRows: API_CHAT.IGetRoomListResData[]) => {
    try {
      for (let i = 0; i < selectedRows.length; i++) {
        const { _id } = selectedRows[i];
        await deleteRoom({
          _id,
        });
      }
    } catch (err) {
      return false;
    }
    actionRef.current?.reloadAndRest?.();
    return true;
  };

  const onSubmit = useCallback(async (value: API_CHAT.IPutRoomParams) => {
    try {
      if (value._id) {
        await putRoom(value);
      } else {
        await postRoom(value as API_CHAT.IPostRoomParams);
      }
      message.info('操作成功');
      actionRef.current?.reloadAndRest?.();
      return Promise.resolve();
    } catch (err) {
      message.info('操作失败，请重试');
      return Promise.reject();
    }
  }, []);

  return (
    <ProPage
      action={{
        remove: {
          action: handleRemove,
          multiple: false 
        },
      }}
      extraActionRender={(record) => {
        return (
          <>
            <Button style={{paddingLeft: 0}} type="link" onClick={() => handleModalVisible(record)}>
              编辑
            </Button>
          </>
        );
      }}
      headerTitle="聊天室列表"
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
        </Button>,
      ]}
      request={async (params: any) => {
        const { createdAt, current, ...nextParams } = params;
        let newParams = {
          ...nextParams,
          currPage: current - 1,
        };
        newParams = pickBy(newParams, identity);
        return getRoomList(newParams)
          .then(({ list, total }) => ({ data: list, total }))
          .catch(() => ({ data: [], total: 0 }));
      }}
      columns={columns as any}
    >
      <Form ref={formRef} onSubmit={onSubmit} />
    </ProPage>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(CardList);
