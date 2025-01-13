import { ProPage } from '@/components/ProTable';
import { message } from '@/components/Toast';
import { deleteUser, getUserList, postUser, putUser } from '@/services';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-components';
import { Button } from 'antd';
import { identity, omit, pickBy } from 'lodash';
import { createRef, memo, useCallback, useRef } from 'react';
import { connect, history } from 'umi';
import columns from './columns';
import CreateForm from './components/CreateForm';
import { mapDispatchToProps, mapStateToProps } from './connect';

const MemberManage = memo(() => {
  const actionRef = useRef<ActionType>();

  const modalRef = createRef<CreateForm>();

  /**
   * 添加节点
   * @param fields
   */
  const handleAdd = useCallback(async (fields: any) => {
    const hide = message.loading('正在添加');
    const method = fields['_id'] ? putUser : postUser;

    const { avatar, roles, ...nextFields } = fields;

    const params = {
      ...nextFields,
      avatar: Array.isArray(avatar) ? avatar[0] : avatar,
      roles: (Array.isArray(roles) ? roles : [roles]).join(','),
    };

    try {
      await method(params);
      hide();
      message.success('操作成功');
      return true;
    } catch (error) {
      hide();
      message.error('操作失败请重试！');
      return false;
    }
  }, []);

  /**
   *  删除节点
   * @param selectedRows
   */

  const handleRemove = useCallback(
    async (selectedRows: API_USER.IGetUserListResData[]) => {
      try {
        await deleteUser({
          _id: selectedRows.map(item => item._id).join(','),
        })
      } catch (err) {
        return false;
      }
      actionRef.current?.reloadAndRest?.();
      return true;
    },
    [actionRef],
  );

  const handleModalVisible = (id?: string) => {
    modalRef.current?.open(id);
  };

  const onSubmit = useCallback(async (value: any) => {
    const { avatar } = value;
    const newParams = omit(value, ['avatar']);
    if (Array.isArray(avatar) && avatar.length) [newParams.avatar] = avatar;
    if (typeof avatar === 'string') newParams.avatar = avatar;
    const success = await handleAdd(newParams);

    if (success) {
      actionRef.current?.reload();
      return Promise.resolve();
    }
    return Promise.reject();
  }, []);

  const fetchData = useCallback(async (params: any) => {
    const { current, ...nextParams } = params;
    let newParams = {
      ...nextParams,
      currPage: current - 1,
    };
    newParams = pickBy(newParams, identity);
    return getUserList(newParams)
      .then(({ list, total }) => ({ data: list, total }))
      .catch(() => ({ data: [], total: 0 }));
  }, []);

  return (
    <ProPage
      action={{
        remove: {
          action: handleRemove,
        },
      }}
      extraActionRender={(record) => {
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
              onClick={() => handleModalVisible(record['_id'])}
            >
              编辑
            </Button>
            <Button
              {...commonProps}
              onClick={() => history.push(`/member/${record['_id']}`)}
            >
              详情
            </Button>
          </>
        );
      }}
      scroll={{ x: 'max-content' }}
      headerTitle="用户列表"
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
      request={fetchData}
      columns={columns as any}
      rowSelection={{}}
    >
      <CreateForm onSubmit={onSubmit} ref={modalRef} />
    </ProPage>
  );
});

export default connect(mapStateToProps, mapDispatchToProps)(MemberManage);
