import { Card } from 'antd';
import { noop } from 'lodash';
import React, { useEffect, useMemo } from 'react';
import { connect } from 'umi';
import { IVisitStatisticsData } from '../../service';
import { TimelineChart } from '../Charts';
import { mapDispatchToProps, mapStateToProps } from './connect';
import styles from './index.less';

interface IProps {
  loading: boolean;
  data: Array<IVisitStatisticsData>;
  fetchData: (params?: {
    date_type?: 'year' | 'month' | 'week' | 'day';
    start_date?: string;
    end_date?: string;
  }) => any;
}

const UserVisit: React.FC<IProps> = ({
  loading,
  data = [],
  fetchData = noop,
}) => {
  const chartData = useMemo(() => {
    return data.map((item: IVisitStatisticsData) => ({
      x: item.day,
      y: item.count,
    }));
  }, [data]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Card
      loading={loading}
      className={styles.offlineCard}
      bordered={false}
      style={{
        marginTop: 32,
      }}
    >
      <div
        style={{
          padding: '0 24px',
        }}
      >
        <TimelineChart height={400} data={chartData} />
      </div>
    </Card>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(UserVisit);
