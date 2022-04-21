/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */

//  export const API_DOMAIN = "http://localhost:4000"
export const API_DOMAIN = 'http://47.97.27.23';

export default {
  dev: {
    '/api/': {
      target: API_DOMAIN,
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  prod: {
    '/api/': {
      target: API_DOMAIN,
      changeOrigin: true,
      pathRewrite: { '^/api/static': '/static' },
    },
  },
  // dev: {
  //   '/api/': {
  //     target: 'https://preview.pro.ant.design',
  //     changeOrigin: true,
  //     pathRewrite: { '^': '' },
  //   },
  // },
  test: {
    '/api/': {
      target: 'https://preview.pro.ant.design',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
