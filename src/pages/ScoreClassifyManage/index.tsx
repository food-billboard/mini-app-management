import { ProPage } from '@/components/ProTable';
import { message } from '@/components/Toast';
import {
  deleteScoreClassify,
  getScoreClassifyList,
  postScoreClassify,
  putScoreClassify
} from '@/services';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-components';
import { memo, useCallback, useRef } from 'react';
import columns from './columns';
import EditForm from './components/Edit';

const ScoreClassifyManage = memo(() => {

  const actionRef = useRef<ActionType>();

  const handleDelete = useCallback(
    async (record: API_SCORE.GetScoreClassifyListData[]) => {
      await deleteScoreClassify({
        _id: record.map((item) => item._id).join(','),
      })
        .then(() => {
          return actionRef.current?.reloadAndRest?.();
        })
        .catch(() => {
          message.info('删除错误');
        });
    },
    [],
  );

  const handleSave = useCallback(async (value) => {
    const { _id } = value
    const values = {
      ...value,
      image: value.image[0] || '',
      max_age: value.age[1],
      min_age: value.age[0]
    }
    return (_id ? putScoreClassify(values) : postScoreClassify(values))
    .then(() => {
      return actionRef.current?.reloadAndRest?.()
    })
  }, [])

  return (
    <ProPage
      action={{
        remove: {
          action: handleDelete,
        },
      }}
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
      scroll={{ x: 'max-content' }}
      headerTitle="积分原因分类管理"
      actionRef={actionRef}
      rowKey="_id"
      tableAlertRender={false}
      pagination={{
        pageSize: 10,
      }}
      request={async ({ current, createdAt=[], ...nextParams }) => {
        const [start_date, end_date] = createdAt as any;
        return getScoreClassifyList({
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

export default ScoreClassifyManage;
