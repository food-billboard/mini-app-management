// https://umijs.org/config/
import { defineConfig } from 'umi';
import { merge } from 'lodash';
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';
// import HappyPack from 'happypack'
// import os from 'os'
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routerConfig from './router-config';

// const happyThreadPool = HappyPack.ThreadPool({
//   size: os.cpus().length
// })

const { REACT_APP_ENV } = process.env;

const commonConfig = {
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  history: {
    type: 'hash',
  },
  // layout: {
  //   name: 'Ant Design Pro',
  //   locale: true,
  //   ...defaultSettings,
  // },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: routerConfig,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  proxy: (proxy as any)[REACT_APP_ENV || 'prod'],
  manifest: {
    basePath: '/',
  },
};

const developmentConfig: any = merge({}, commonConfig, {
  define: {
    'process.env.REACT_APP_ENV': 'dev',
    'process.env.REQUEST_API': process.env.REQUEST_API,
  },
  chainWebpack(config: any) {
    config.plugin('monaco-editor').use(MonacoWebpackPlugin, [
      {
        languages: ['javascript', 'json'],
      },
    ]);
  },
});

const productionConfig: any = merge({}, commonConfig, {
  define: {
    'process.env.REACT_APP_ENV': 'prod',
    'process.env.REQUEST_API': process.env.REQUEST_API,
  },
  chunks: ['antdesigns', 'vendors', 'commons', 'umi'],
  //-----打包配置
  base: '/api/backend/',
  publicPath: '/api/backend/',
  chainWebpack(config: any) {
    // config.plugin('HappyPack').use(HappyPack, [
    //   {
    //     id: 'js',
    //     loaders: ['babel-loader'],
    //     threadPool: happyThreadPool,
    //   },
    // ]);

    config.plugin('monaco-editor').use(MonacoWebpackPlugin, [
      {
        languages: ['javascript', 'json'],
      },
    ]);
    // 过滤掉momnet的那些不使用的国际化文件
    config
      .plugin('replace')
      .use(require('webpack').ContextReplacementPlugin)
      .tap(() => {
        return [/moment[/\\]locale$/, /zh-cn/];
      });

    config.merge({
      optimization: {
        minimize: true,
        splitChunks: {
          chunks: 'async',
          minSize: 30000,
          minChunks: 1,
          automaticNameDelimiter: '.',
          cacheGroups: {
            lfpantdesigns: {
              name: 'antdesigns',
              chunks: 'all',
              test: /[\\/]node_modules[\\/](@antv|antd|@ant-design)/,
              priority: 10,
            },
            lfpvendors: {
              name: 'vendors',
              chunks: 'all',
              test: /[\\/]node_modules[\\/](lodash|moment|react|dva|postcss|mapbox-gl|video)/,
              priority: 10,
            },
            // // 最基础的
            // 'async-commons': {
            //   // 其余异步加载包
            //   name: 'async-commons',
            //   chunks: 'async',
            //   minChunks: 2,
            //   priority: 2,
            // },
            lfpcommons: {
              name: 'commons',
              // 其余同步加载包
              chunks: 'all',
              minChunks: 2,
              priority: 1,
              // 这里需要注意下，webpack5会有问题， 需加上这个 enforce: true，
              // refer: https://github.com/webpack-contrib/mini-css-extract-plugin/issues/257#issuecomment-432594711
              enforce: true,
            },
          },
        },
      },
    });
  },
});

const productionLocalConfig: any = merge({}, productionConfig, {
  define: {
    'process.env.REACT_APP_ENV': 'prod-local',
    'process.env.REQUEST_API': process.env.REQUEST_API,
  },
  base: '/api/backend/',
  publicPath: '/api/backend/',
});

let realConfig;

switch (REACT_APP_ENV) {
  case 'prod':
    realConfig = productionConfig;
    break;
  case 'prod-local':
    realConfig = productionLocalConfig;
    break;
  default:
    realConfig = developmentConfig;
}

export default defineConfig(realConfig);
