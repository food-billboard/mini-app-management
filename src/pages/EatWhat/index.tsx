import React, { useRef, useCallback } from 'react';
import { Button, Dropdown, message, Space } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import type { ActionType } from '@ant-design/pro-table';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import Form from './components/form';
import type { IFormRef } from './components/form';
import { mapStateToProps, mapDispatchToProps } from './connect';
import column from './columns';
import { getCurrentMenuList, deleteCurrentMenu, postCurrentMenu, putCurrentMenu } from '@/services';
import { commonDeleteMethod, withTry } from '@/utils';

const EatWhatManage: React.FC<any> = () => {
  const actionRef = useRef<ActionType>();

  const modalRef = useRef<IFormRef>(null);

  const handleAdd = useCallback(async (values: API.PostEatMenuData | API.PutEatMenuData) => {
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
  }, []);

  const handleModalVisible = useCallback(
    (values?: API.GetEatMenuListData) => {
      modalRef.current?.open(values);
    },
    [modalRef],
  );

  const handleRemove = useCallback(async (selectedRows: API.GetEatMenuListData[]) => {
    return commonDeleteMethod<API.GetEatMenuListData>(
      selectedRows.slice(0, 1),
      () => {
        return deleteCurrentMenu({
          _id: selectedRows.map((item) => item._id).join(','),
        });
      },
      actionRef.current?.reloadAndRest,
    );
  }, []);

  const columns: any[] = [
    ...column,
    {
      title: '操作',
      key: 'opera',
      dataIndex: 'opera',
      valueType: 'option',
      fixed: 'right',
      render: (_: any, record: API.GetEatMenuListData) => {
        return (
          <Space>
            <a onClick={() => handleModalVisible(record)}>编辑</a>
            <a style={{ color: 'red' }} onClick={() => handleRemove([record])}>
              删除
            </a>
          </Space>
        );
      },
    },
  ];

  return (
    <PageHeaderWrapper>
      <ProTable
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
          selectedRows && selectedRows.length > 0 && (
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'remove',
                    onClick: () => {
                      handleRemove(selectedRows);
                    },
                    label: '批量删除',
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
        tableAlertRender={({
          selectedRowKeys,
        }: {
          selectedRowKeys: React.ReactText[];
          selectedRows: any[];
        }) => (
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
        columns={columns}
        rowSelection={{}}
      />
      <Form
        onSubmit={async (value) => {
          await withTry(handleAdd)(value);
          actionRef.current?.reload();
        }}
        ref={modalRef}
      />
    </PageHeaderWrapper>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(EatWhatManage);
