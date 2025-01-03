import React, { useRef, useCallback, useState, useEffect } from 'react';
import { Button, Dropdown, message, Space } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ActionType } from '@ant-design/pro-table';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { connect, history } from 'umi';
import pickBy from 'lodash/pickBy';
import identity from 'lodash/identity';
import omit from 'lodash/omit';
import Form, { IFormRef } from './components/CreateForm';
import { mapStateToProps, mapDispatchToProps } from './connect';
import column from './columns';
import { deleteMessage, getMessageList, postMessage } from '@/services';
import { commonDeleteMethod } from '@/utils';

interface IProps {
  role: any;
}

const CardList: React.FC<IProps> = () => {
  const [roomId, setRoomId] = useState<string>('');

  const actionRef = useRef<ActionType>();

  const formRef = useRef<IFormRef>(null);

  const handleRemove = async (selectedRows: API_CHAT.IGetMessageResData[]) => {
    return commonDeleteMethod<API_CHAT.IGetMessageResData>(
      selectedRows,
      (row: API_CHAT.IGetMessageResData) => {
        const { _id } = row;
        return deleteMessage({
          _id,
        });
      },
      actionRef.current?.reloadAndRest,
    );
  };

  const columns: any[] = [
    ...column,
    {
      title: '操作',
      key: 'option',
      dataIndex: 'option',
      valueType: 'option',
      render: (_: any, record: API_CHAT.IGetMessageResData) => {
        return (
          <Space>
            {/* <a
              onClick={() => handleModalVisible(record)}
            >
              编辑
            </a> */}
            <a style={{ color: 'red' }} onClick={() => handleRemove([record])}>
              删除
            </a>
          </Space>
        );
      },
    },
  ];

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
    <PageHeaderWrapper>
      <ProTable
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
          selectedRows && selectedRows.length > 0 && (
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'remove',
                    label: '批量删除',
                    onClick: () => {
                      handleRemove(selectedRows as any);
                    },
                  },
                ],
              }}
            >
              <Button key="many">
                批量操作 <DownOutlined />
              </Button>
            </Dropdown>
          ),
        ]}
        tableAlertRender={({ selectedRowKeys }: { selectedRowKeys: React.ReactText[] }) => (
          <div>
            已选择{' '}
            <a
              style={{
                fontWeight: 600,
              }}
            >
              {selectedRowKeys.length}
            </a>{' '}
            项&nbsp;&nbsp;
            <span>
              {/* 服务调用次数总计 {selectedRows.reduce((pre, item) => pre + item.callNo, 0)} 万 */}
            </span>
          </div>
        )}
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
        columns={columns}
        rowSelection={{}}
      />
      <Form ref={formRef} onSubmit={onSubmit} />
    </PageHeaderWrapper>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(CardList);
