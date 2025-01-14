import { defineConfig } from '@umijs/max';
import { merge } from 'lodash';
import * as MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routerConfig from './router-config';

const { REACT_APP_ENV } = process.env;

const commonConfig = {
  hash: true,
  dva: {},
  history: {
    type: 'hash',
  },
  antd: {
    configProvider: {},
    theme: {
      token: {
        colorPrimary: defaultSettings.colorPrimary,
      },
      components: {
        Menu: {
          
        }
      }
    },
  },
  locale: false,
  // locale: {
  //   default: 'zh-CN',
  //   antd: true,
  //   baseNavigator: false,
  // },
  mock: false,
  model: {},
  initialState: {},
  layout: {
    locale: false,
    ...defaultSettings,
  },
  routes: routerConfig,
  theme: {
    '@primary-color': defaultSettings.colorPrimary,
  },
  headScripts: [
    // 解决首次加载时白屏的问题
    { src: '/scripts/loading.js', async: true },
  ],
  proxy: (proxy as any)[REACT_APP_ENV || 'prod'],
};

const developmentConfig: any = merge({}, commonConfig, {
  define: {
    'process.env.REACT_APP_ENV': 'dev',
    'process.env.REQUEST_API': process.env.REQUEST_API,
  },
  // chainWebpack(config: any) {
  //   config.plugin('monaco-editor').use(MonacoWebpackPlugin, [
  //     {
  //       languages: ['javascript', 'json'],
  //     },
  //   ]);
  // },
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
        return [/dayjs[/\\]locale$/, /zh-cn/];
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
              test: /[\\/]node_modules[\\/](lodash|dayjs|react|dva|postcss|mapbox-gl|video)/,
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
