import { ProLayoutProps } from '@ant-design/pro-components';

export type DefaultSettings = ProLayoutProps & {
  pwa: boolean;
};

const proSettings: DefaultSettings = {
  navTheme: 'light',
  // 拂晓蓝
  colorPrimary: '#458e83',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: '数据管理后台',
  pwa: false,
  // logo: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
  iconfontUrl: '',
  menu: {
    locale: false
  }
};

export default proSettings
