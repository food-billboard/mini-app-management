import { Chart, Tooltip, Interval } from 'bizcharts';
import React from 'react';
import autoHeight from '../autoHeight';
import styles from '../index.less';

const MiniBar = props => {
  const { height = 40, forceFit = true, color = '#1890FF', data = [] } = props;
  const scale = {
    x: {
      type: 'cat',
    },
    y: {
      min: 0,
    },
  };
  const padding = [36, 5, 30, 5];
  const tooltip = [
    'x*y',
    (x, y) => ({
      name: x,
      value: y,
    }),
  ]; // for tooltip not to be hide

  const chartHeight = height + 54;

  return (
    <div
      className={styles.miniChart}
      style={{
        height,
      }}
    >
      <div className={styles.chartContent}>
        <Chart scale={scale} height={chartHeight} autoFit={forceFit} data={data} interactions={['active-region']} padding={padding}>
          <Interval position="x*y" />
          <Tooltip shared />
        </Chart>
      </div>
    </div>
  )
};

export default autoHeight()(MiniBar);
