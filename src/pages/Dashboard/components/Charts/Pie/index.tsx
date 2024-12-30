import React, { memo, useMemo } from 'react';
import { Chart, Interval, Tooltip, Axis, Coordinate, Interaction, getTheme } from 'bizcharts';
import type { ScaleOption } from '@antv/g2/lib/interface';

interface IProps {
  data: { x: string; y: number }[];
  height?: number;
  autoFit?: boolean;
  scale?: {
    [field: string]: ScaleOption;
  };
  lineWidth?: number;
}

export default memo((props: IProps) => {
  const {
    data,
    height,
    autoFit = true,
    scale,
    lineWidth,
  } = useMemo(() => {
    const { scale: propsScale, ...nextProps } = props;
    const newScale = propsScale || {
      percent: {
        formatter: (val) => {
          return val * 100 + '%';
        },
      },
    };
    return {
      ...nextProps,
      scale: newScale,
    };
  }, [props]);

  return (
    <Chart height={height} data={data} scale={scale} autoFit={!!autoFit}>
      <Coordinate type="theta" radius={0.75} />
      <Tooltip showTitle={false} />
      <Axis visible={false} />
      <Interval
        position="y"
        adjust="stack"
        color="x"
        style={{
          lineWidth: lineWidth || 1,
          stroke: '#fff',
        }}
        label={[
          'value',
          {
            content: (labelData: any) => {
              return `${labelData.x}: ${labelData.value}`;
            },
          },
        ]}
        state={{
          selected: {
            style: (t) => {
              const res = getTheme().geometries.interval.rect.selected.style(t);
              return {
                ...res,
                fill: `rgb(${new Array(3)
                  .fill(0)
                  .map(() => Math.floor(Math.random() * 255))
                  .join(',')})`,
              };
            },
          },
        }}
      />
      <Interaction type="element-single-selected" />
    </Chart>
  );
});
