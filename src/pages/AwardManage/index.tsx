import { ProPage } from '@/components/ProTable';
import { message } from '@/components/Toast';
import {
  deleteScoreAward,
  getScoreAward,
  postScoreAward,
  putScoreAward,
} from '@/services';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-components';
import { memo, useCallback, useRef } from 'react';
import columns from './columns';
import EditForm from './components/Edit';
import { postScoreExchangeMemory, postScoreMemory } from '/src/services/score';

const ScoreAwardManage = memo(() => {
  const actionRef = useRef<ActionType>();

  const handleDelete = useCallback(
    async (record: API_SCORE.GetScoreAwardData[]) => {
      await deleteScoreAward({ _id: record.map((item) => item._id).join(',') })
        .then(() => {
          return actionRef.current?.reloadAndRest?.();
        })
        .catch(() => {
          message.info('删除错误');
        });
    },
    [],
  );

  const handleSave = useCallback((value) => {
    const { _id } = value;
    return (_id ? putScoreAward(value) : postScoreAward(value)).then(() => {
      return actionRef.current?.reloadAndRest?.();
    });
  }, []);

  return (
    <ProPage
      action={{
        remove: {
          action: handleDelete,
        },
      }}
      rowSelection={{}}
      extraActionRender={(record) => {
        return (
          <EditForm
            extraButtonProps={{
              type: 'link',
              style: { paddingLeft: 0 },
            }}
            onSubmit={handleSave}
            value={record}
          >
            编辑
          </EditForm>
        );
      }}
      scroll={{ x: 'max-content' }}
      headerTitle="积分奖品管理"
      actionRef={actionRef}
      rowKey="_id"
      toolBarRender={() => [
        <EditForm
          key="add"
          extraButtonProps={{
            type: 'primary',
            icon: <PlusOutlined />,
          }}
          onSubmit={handleSave}
        >
          新增
        </EditForm>,
      ]}
      tableAlertRender={false}
      pagination={{
        pageSize: 10,
      }}
      request={async ({ current, createdAt, ...nextParams }) => {
        const [start_date, end_date] = createdAt || [];
        return getScoreAward({
          currPage: (current || 1) - 1,
          start_date,
          end_date,
          ...nextParams,
        })
          .then((data) => {
            return { data: data.list, total: data.total };
          })
          .catch(() => ({ data: [], total: 0 }));
      }}
      columns={columns as any}
    />
  );
});

export default ScoreAwardManage;
