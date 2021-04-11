import { Chart, Line, Point, Slider } from 'bizcharts';
import React from 'react';
import autoHeight from '../autoHeight';
import styles from './index.less';

export interface IData {
  x: string
  y: number
}

const TimelineChart = (props: {
  title?: string | React.ReactNode
  height?: number
  padding?: [ number, number, number, number ]
  data: Array<IData>
}) => {
  const {
    title,
    height = 400,
    padding = [60, 20, 40, 40],
    data: sourceData,
  } = props;
  const data = Array.isArray(sourceData)
    ? sourceData
    : [
        {
          x: 0,
          y: 0,
        },
      ];

  return (
    <div
      className={styles.timelineChart}
      style={{
        height: height + 30,
      }}
    >
      <div>
        {title && <h4>{title}</h4>}
        <Chart 
          height={height} 
          padding={padding} 
          data={data}
          autoFit
        >
          <Line position="x*y" />
          <Point position="x*y" />
          <Slider
            height={26}
          />
        </Chart>
      </div>
    </div>
  );
};

export default autoHeight()(TimelineChart);
