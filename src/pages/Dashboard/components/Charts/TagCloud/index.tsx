// import { Chart, Coord, Geom, Shape, Tooltip, goord } from 'bizcharts';
import {
  Chart,
  Geom,
  Tooltip,
  registerShape,
  Legend,
  Axis,
  Interaction,
  G2,
  Coordinate
} from 'bizcharts'
import React, { Component } from 'react';
import DataSet from '@antv/data-set';
import Debounce from 'lodash/debounce';
import assign from 'lodash/assign'
import classNames from 'classnames';
import autoHeight from '../autoHeight';
import styles from './index.less';
/* eslint no-underscore-dangle: 0 */

/* eslint no-param-reassign: 0 */

const imgUrl = 'https://gw.alipayobjects.com/zos/rmsportal/gWyeGLCdFFRavBGIDzWk.png';

export interface ICloudData {
  name: string,
  text: string,
  value: number
}

interface IProps {
  data: Array<ICloudData>
  className?: string
  height?: number
  onClick?: (...args: any[]) => any
}

interface IState {
  dv: any
  height: number
  width: number
}

class TagCloud extends Component<IProps, IState> {

  public state: IState = {
    dv: null,
    height: 0,
    width: 0,
  };

  isUnmount = false;

  requestRef = 0;

  root: any = undefined;

  imageMask: any = undefined;

  componentDidMount() {
    requestAnimationFrame(() => {
      this.initTagCloud();
      this.renderChart(this.props);
    });
    window.addEventListener('resize', this.resize, {
      passive: true,
    });
  }

  componentDidUpdate(preProps: IProps) {
    const { data } = this.props;

    if (preProps && JSON.stringify(preProps.data) !== JSON.stringify(data)) {
      this.renderChart(this.props);
    }
  }

  componentWillUnmount() {
    this.isUnmount = true;
    window.cancelAnimationFrame(this.requestRef);
    window.removeEventListener('resize', this.resize);
  }

  resize = () => {
    this.requestRef = requestAnimationFrame(() => {
      this.renderChart(this.props);
    });
  };

  saveRootRef = (node: React.ReactNode) => {
    this.root = node;
  };

  initTagCloud = () => {
    function getTextAttrs(cfg: any) {
			return assign(
				{},
				cfg.style,
				{
					fontSize: cfg.data.size,
					text: cfg.data.text,
					textAlign: 'center',
					fontFamily: cfg.data.font,
					fill: cfg.color,
					textBaseline: 'Alphabetic'
				}
			);
		}

    registerShape('point', 'cloud', {
      draw(cfg: any, container) {
				const attrs = getTextAttrs(cfg);
				const textShape = container.addShape("text", {
					attrs: assign(attrs, {
						x: cfg.x,
						y: cfg.y
					})
				});
				if (cfg.data.rotate) {
					G2.Util.rotate(textShape, cfg.data.rotate * Math.PI / 180);
				}
				return textShape;
      },
    });
  };

  renderChart = Debounce(nextProps => {
    // const colors = ['#1890FF', '#41D9C7', '#2FC25B', '#FACC14', '#9AE65C'];
    const { data, height } = nextProps || this.props;

    if (data.length < 1 || !this.root) {
      return;
    }

    const h = height;
    const w = this.root && this.root.offsetWidth;

    const onload = () => {
      const dv = new DataSet.View().source(data);
      const range = dv.range('value');
      const [min, max] = range;
      dv.transform({
        type: 'tag-cloud',
        fields: ['name', 'value'],
        imageMask: this.imageMask,
        font: 'Verdana',
        size: [w, h],
        // 宽高设置最好根据 imageMask 做调整
        padding: 0,
        timeInterval: 5000,

        // max execute time
        rotate() {
          return 0;
        },

        fontSize(d) {
          const size = ((d.value - min) / (max - min)) ** 2;
          return size * (17.5 - 5) + 5;
        },
      });

      if (this.isUnmount) {
        return;
      }

      this.setState({
        dv,
        width: w,
        height: h,
      });
    };

    if (!this.imageMask) {
      this.imageMask = new Image();
      this.imageMask.crossOrigin = '';
      this.imageMask.src = imgUrl;
      this.imageMask.onload = onload;
    } else {
      onload();
    }
  }, 500);

  render() {
    const { className, height } = this.props;
    const { dv, width, height: stateHeight } = this.state;
    return (
      <div
        className={classNames(styles.tagCloud, className)}
        style={{
          width: '100%',
          height,
        }}
        ref={this.saveRootRef}
        onClick={this.props?.onClick}
      >
        {dv && (
          <Chart
            width={width}
            height={stateHeight}
            data={dv}
            padding={0}
            scale={{
              x: {
                nice: false,
              },
              y: {
                nice: false,
              },
            }}
          >
						<Tooltip showTitle={false} />
						<Coordinate reflect="y" />
						<Axis name='x' visible={false} />
						<Axis name='y' visible={false} />
						<Legend visible={false} />
						<Geom
              type="point"
              position="x*y"
              color="text"
              shape="cloud"
              tooltip={[
                'text*value',
                function trans(text, value) {
                  return {
                    name: text,
                    value,
                  };
                },
              ]}
            />
						<Interaction type='element-active' />
          </Chart>
        )}
      </div>
    );
  }
}

export default autoHeight()(TagCloud);
