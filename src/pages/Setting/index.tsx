import { GridContent } from '@ant-design/pro-components';
import { Menu } from 'antd';
import React, { Component } from 'react';
import { connect } from 'umi';
import BaseView from './components/base';
import { mapDispatchToProps, mapStateToProps } from './connect';
import styles from './index.less';

const { Item } = Menu;

interface IProps {
  getUserInfo: () => Promise<API_ADMIN.IGetAdminInfoRes>;
  userInfo: API_ADMIN.IGetAdminInfoRes;
  loading: boolean;
}

interface IState {
  mode: any;
  selectKey: 'base';
  menuMap: {
    [key: string]: React.ReactElement;
  };
}

class Settings extends Component<IProps> {
  main = React.createRef<HTMLDivElement>();

  state: IState = {
    mode: 'inline',
    menuMap: {
      base: <span>基本设置</span>,
    },
    selectKey: 'base',
  };

  async componentDidMount() {
    const { getUserInfo } = this.props;
    if (getUserInfo) await getUserInfo();
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  getRightTitle = () => {
    const { selectKey, menuMap } = this.state;
    return menuMap[selectKey];
  };

  selectKey = (key: string) => {
    this.setState({
      selectKey: key,
    });
  };

  resize = () => {
    if (!this.main) {
      return;
    }

    requestAnimationFrame(() => {
      if (!this.main) {
        return;
      }

      let mode = 'inline';
      const offsetWidth = this.main.current?.offsetWidth || 0;

      if (offsetWidth < 641 && offsetWidth > 400) {
        mode = 'horizontal';
      }

      if (window.innerWidth < 768 && offsetWidth > 400) {
        mode = 'horizontal';
      }

      this.setState({
        mode,
      });
    });
  };

  renderChildren = () => {
    const { selectKey } = this.state;

    switch (selectKey) {
      case 'base':
        return <BaseView />;
      default:
        break;
    }

    return null;
  };

  render() {
    const { userInfo } = this.props;

    if (!userInfo._id) {
      return '';
    }

    const { mode, selectKey, menuMap } = this.state;
    return (
      <GridContent>
        <div className={styles.main} ref={this.main}>
          <div className={styles.leftMenu}>
            <Menu
              mode={mode}
              selectedKeys={[selectKey]}
              onClick={({ key }) => this.selectKey(key as string)}
              items={Object.keys(menuMap).map((item) => {
                return {
                  key: item,
                  label: menuMap[item],
                };
              })}
            />
          </div>
          <div className={styles.right}>
            <div className={styles.title}>{this.getRightTitle()}</div>
            {this.renderChildren()}
          </div>
        </div>
      </GridContent>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
