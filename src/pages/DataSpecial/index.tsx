import { ProPage } from '@/components/ProTable';
import { message } from '@/components/Toast';
import {
  deleteInstanceSpecial,
  getInstanceSpecialList,
  postInstanceSpecial,
  putInstanceSpecial,
} from '@/services';
import { commonDeleteMethod } from '@/utils';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-components';
import { Button } from 'antd';
import { pick } from 'lodash';
import React, { memo, useCallback, useMemo, useRef } from 'react';
import { connect, history } from 'umi';
import column from './columns';
import type { IFormRef } from './components/form';
import Form from './components/form';
import { mapDispatchToProps, mapStateToProps } from './connect';

const InstanceManage: React.FC<any> = () => {
  const actionRef = useRef<ActionType>();

  const modalRef = useRef<IFormRef>(null);

  const handleAdd = useCallback(
    async (
      values:
        | API_INSTANCE.IPostInstanceSpecialParams
        | API_INSTANCE.IPutInstanceSpecialParams,
    ) => {
      try {
        if ((values as API_INSTANCE.IPutInstanceInfoParams)['_id']) {
          await putInstanceSpecial(
            values as API_INSTANCE.IPutInstanceSpecialParams,
          );
        } else {
          await postInstanceSpecial(
            values as API_INSTANCE.IPostInstanceSpecialParams,
          );
        }
        message.success('操作成功');
        return true;
      } catch (err) {
        message.error('操作失败');
        return false;
      }
    },
    [],
  );

  const putInfo = useCallback(
    async (value: boolean, record: API_INSTANCE.IGetInstanceSpecialData) => {
      await handleAdd({
        ...pick(record, ['name', '_id', 'description', 'poster']),
        movie: record.movie.map((item) => item['_id']),
        valid: value,
      });
      actionRef.current?.reload();
    },
    [],
  );

  const handleModalVisible = useCallback(
    (values?: API_INSTANCE.IGetInstanceSpecialData) => {
      modalRef.current?.open(values);
    },
    [modalRef],
  );

  const handleRemove = useCallback(
    async (selectedRows: API_INSTANCE.IGetInstanceSpecialData[]) => {
      try {
        await deleteInstanceSpecial({
          _id: selectedRows.map(item => item._id).join(','),
        });
      }catch(err) {
        return false 
      }
      actionRef.current?.reloadAndRest?.()
      return true 
    },
    [],
  );

  const toolbarRender: any = useMemo(() => {
    return (
      action: any,
      {
        selectedRows,
      }: { selectedRows: API_INSTANCE.IGetInstanceSpecialData[] },
    ) => [
      <Button
        key={'add'}
        icon={<PlusOutlined />}
        type="primary"
        onClick={() => handleModalVisible()}
      >
        新建
      </Button>
    ];
  }, []);

  const columns: any[] = useMemo(() => {
    return [
      ...column,
      {
        title: '操作',
        key: 'option',
        dataIndex: 'option',
        valueType: 'option',
        render: (_: any, record: API_INSTANCE.IGetInstanceSpecialData) => {
          const { valid } = record;
          const commonProps: any = {
            style: {
              paddingLeft: 0,
            },
            type: 'link',
          };
          return (
            <>
              <Button
                {...commonProps}
                onClick={() => handleModalVisible(record)}
              >
                编辑
              </Button>
              <Button
                {...commonProps}
                onClick={() => {
                  history.push(`/data/special/${record['_id']}`);
                }}
              >
                详情
              </Button>
              {valid ? (
                <Button
                  {...commonProps}
                  onClick={putInfo.bind(null, false, record)}
                >
                  禁用
                </Button>
              ) : (
                <Button
                  {...commonProps}
                  onClick={putInfo.bind(null, true, record)}
                >
                  启用
                </Button>
              )}
            </>
          );
        },
      },
    ];
  }, [putInfo, handleRemove, handleModalVisible]);

  const onSearchChange = useCallback(async (params: any) => {
    let realParams: any = {};
    const { valid, current, ...nextParams } = params;
    realParams = {
      ...nextParams,
      currPage: current - 1,
    };
    if (valid !== undefined) realParams.valid = !Number(valid);
    return getInstanceSpecialList(realParams)
      .then(({ list, total }) => ({ data: list, total }))
      .catch(() => ({ data: [], total: 0 }));
  }, []);

  return (
    <ProPage
      headerTitle="专题列表"
      scroll={{ x: 'max-content' }}
      actionRef={actionRef}
      rowKey="_id"
      toolBarRender={toolbarRender}
      request={onSearchChange}
      columns={columns}
      rowSelection={{}}
      pagination={{ defaultPageSize: 10 }}
      action={{
        remove: handleRemove as any,
      }}
    >
      <Form
        onSubmit={async (value) => {
          const success = await handleAdd(value);
          if (success) {
            actionRef.current?.reload();
            return Promise.resolve();
          }
          return Promise.reject();
        }}
        ref={modalRef}
      />
    </ProPage>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(memo(InstanceManage));
