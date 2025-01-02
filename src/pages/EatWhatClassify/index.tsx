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
import {
  getCurrentMenuClassifyList,
  deleteCurrentMenuClassify,
  postCurrentMenuClassify,
  putCurrentMenuClassify,
} from '@/services';
import { commonDeleteMethod } from '@/utils';

const EatWhatClassifyManage: React.FC<any> = () => {
  const actionRef = useRef<ActionType>();

  const modalRef = useRef<IFormRef>(null);

  const handleAdd = useCallback(
    async (values: API.PostEatMenuClassifyData | API.PutEatMenuClassifyData) => {
      const realValues = {
        ...values,
        menu_type: values.menu_type.join(','),
      };
      try {
        if ((values as API.PutEatMenuData)['_id']) {
          await putCurrentMenuClassify(realValues as API.PutEatMenuClassifyData);
        } else {
          await postCurrentMenuClassify(realValues as API.PostEatMenuClassifyData);
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

  const handleRemove = useCallback(async (selectedRows: API.GetEatMenuClassifyListData[]) => {
    return commonDeleteMethod<API.GetEatMenuClassifyListData>(
      selectedRows.slice(0, 1),
      () => {
        return deleteCurrentMenuClassify({
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
      render: (_: any, record: API.GetEatMenuClassifyListData) => {
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
          selectedRows && selectedRows.length > 0 && (
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'remove',
                    label: '批量删除',
                    onClick: () => {
                      handleRemove(selectedRows);
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
          return getCurrentMenuClassifyList({
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
          await handleAdd(value);
          actionRef.current?.reload();
        }}
        ref={modalRef}
      />
    </PageHeaderWrapper>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(EatWhatClassifyManage);
