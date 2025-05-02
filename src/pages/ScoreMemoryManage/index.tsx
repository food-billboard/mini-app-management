import { ProPage } from '@/components/ProTable';
import { getScoreMemoryList } from '@/services';
import { Button } from 'antd';
import { history } from 'umi';
import columns from './columns';

const ScoreMemoryManage = () => {
  return (
    <ProPage
      action={{
        show: false,
      }}
      toolBarRender={() => [
        <Button
          key="add"
          type="primary"
          onClick={() => {
            history.push('/score/score-memory/classify');
          }}
        >
          积分原因分类管理
        </Button>,
      ]}
      scroll={{ x: 'max-content' }}
      headerTitle="积分记录管理"
      rowKey="_id"
      tableAlertRender={false}
      pagination={{
        pageSize: 10,
      }}
      request={async ({ current, createdAt = [], ...nextParams }) => {
        const [start_date, end_date] = createdAt as any;
        return getScoreMemoryList({
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
      rowSelection={false}
    />
  );
};

export default ScoreMemoryManage;
