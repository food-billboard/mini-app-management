import { ProPage } from '@/components/ProTable';
import { message } from '@/components/Toast';
import {
  deleteUserFeedback,
  getUserFeedbackList,
  putUserFeedback,
} from '@/services';
import type { ActionType } from '@ant-design/pro-components';
import { Button } from 'antd';
import { identity, merge, pick, pickBy } from 'lodash';
import { memo, useCallback, useRef } from 'react';
import { connect } from 'umi';
import columns from './columns';
import type {
  IFeedbackModalRef,
  TFeedbackEditData,
} from './components/FeedbackModal';
import FeedbackModal from './components/FeedbackModal';
import { mapDispatchToProps, mapStateToProps } from './connect';

const FeedbackManage = memo(() => {
  const actionRef = useRef<ActionType>();
  const feedbackRef = useRef<IFeedbackModalRef>(null);

  /**
   * 添加节点
   * @param fields
   */
  const handleAdd = useCallback(async (fields: TFeedbackEditData) => {
    const hide = message.loading('正在修改');
    const params = pick(fields, [
      '_id',
      'status',
      'description',
    ]) as API_USER.IPutFeedbackParams;

    return putUserFeedback(params)
      .then(() => {
        message.success('操作成功');
        hide();
        actionRef.current?.reload();
      })
      .catch(() => {
        message.success('操作失败，请重试');
        hide();
      });
  }, []);

  const edit = useCallback((data: API_USER.IGetFeedbackData) => {
    feedbackRef.current?.open(merge({}, data, { description: '' }));
  }, []);

  /**
   *  删除节点
   * @param selectedRows
   */

  const handleRemove = useCallback(
    async (selectedRows: API_USER.IGetFeedbackData[]) => {
      try {
        await deleteUserFeedback({
          _id: selectedRows.map(item => item._id).join(','),
        });
      } catch (err) {
        return false;
      }
      actionRef.current?.reloadAndRest?.();
      return true;
    },
    [],
  );

  const fetchData = useCallback(async (params: any) => {
    const { current, ...nextParams } = params;
    let newParams = {
      ...nextParams,
      currPage: current - 1,
    };
    newParams = pickBy(newParams, identity);
    return getUserFeedbackList(newParams)
      .then(({ list, total }) => ({ data: list, total }))
      .catch(() => ({ data: [], total: 0 }));
  }, []);

  const onInputOk = useCallback(
    (value: TFeedbackEditData) => {
      return handleAdd(value)
        .then(() => true)
        .catch(() => false);
    },
    [handleAdd],
  );

  return (
    <ProPage
      action={{
        remove: {
          action: handleRemove,
        },
      }}
      extraActionRender={(record) => {
        return (
          <>
            {record.status === 'DEALING' && (
              <Button
                type="link"
                style={{ paddingLeft: 0 }}
                onClick={edit.bind(null, record)}
              >
                完成处理
              </Button>
            )}
          </>
        );
      }}
      scroll={{ x: 'max-content' }}
      headerTitle="用户反馈列表"
      actionRef={actionRef}
      pagination={{ defaultPageSize: 10 }}
      rowKey="_id"
      request={fetchData}
      columns={columns as any}
      rowSelection={{}}
    >
      <FeedbackModal ref={feedbackRef} onOk={onInputOk} />
    </ProPage>
  );
});

export default connect(mapStateToProps, mapDispatchToProps)(FeedbackManage);
