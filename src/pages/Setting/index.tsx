import useUserInfo from '@/hooks/useUserInfo';
import { GridContent } from '@ant-design/pro-components';
import { Menu } from 'antd';
import { useMemo, useRef, useState } from 'react';
import BaseView from './components/base';
import styles from './index.less';

const Settings = () => {
  const [mode, setMode] = useState('inline');
  const [selectKey, setSelectKey] = useState('base');

  const menuMap = {
    base: <span>基本设置</span>,
  };

  useUserInfo();

  const main = useRef<HTMLDivElement>(null);

  // async componentDidMount() {
  //   const { getUserInfo } = this.props;
  //   if (getUserInfo) await getUserInfo();
  //   window.addEventListener('resize', this.resize);
  //   this.resize();
  // }

  // componentWillUnmount() {
  //   window.removeEventListener('resize', this.resize);
  // }

  const getRightTitle = useMemo(() => {
    return (menuMap as any)[selectKey];
  }, [selectKey]);

  // resize = () => {
  //   if (!this.main) {
  //     return;
  //   }

  //   requestAnimationFrame(() => {
  //     if (!this.main) {
  //       return;
  //     }

  //     let mode = 'inline';
  //     const offsetWidth = this.main.current?.offsetWidth || 0;

  //     if (offsetWidth < 641 && offsetWidth > 400) {
  //       mode = 'horizontal';
  //     }

  //     if (window.innerWidth < 768 && offsetWidth > 400) {
  //       mode = 'horizontal';
  //     }

  //     this.setState({
  //       mode,
  //     });
  //   });
  // };

  const renderChildren = useMemo(() => {
    switch (selectKey) {
      case 'base':
        return <BaseView />;
      default:
        break;
    }

    return null;
  }, [selectKey]);

  return (
    <GridContent>
      <div className={styles.main} ref={main}>
        <div className={styles.leftMenu}>
          <Menu
            mode={mode as any}
            selectedKeys={[selectKey]}
            onClick={({ key }) => setSelectKey(key)}
            items={Object.keys(menuMap).map((item) => {
              return {
                key: item,
                label: (menuMap as any)[item],
              };
            })}
          />
        </div>
        <div className={styles.right}>
          <div className={styles.title}>{getRightTitle}</div>
          {renderChildren}
        </div>
      </div>
    </GridContent>
  );
};

export default Settings;
