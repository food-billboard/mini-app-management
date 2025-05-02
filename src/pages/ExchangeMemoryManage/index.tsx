import { ProPage } from '@/components/ProTable';
import { getScoreExchangeMemoryList } from '@/services';
import columns from './columns';

const ExchangeMemoryManage = () => {
  return (
    <ProPage
      action={{
        show: false 
      }}
      scroll={{ x: 'max-content' }}
      headerTitle="兑换记录管理"
      rowKey="_id"
      tableAlertRender={false}
      pagination={{
        pageSize: 10,
      }}
      request={async ({ current, createdAt = [], check_date = [], ...nextParams }) => {
        const [start_date, end_date] = createdAt as any;
        const [check_start_date, check_end_date] = check_date as any;
        return getScoreExchangeMemoryList({
          currPage: (current || 1) - 1,
          start_date,
          end_date,
          check_start_date, 
          check_end_date,
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

export default ExchangeMemoryManage;
