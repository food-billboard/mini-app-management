
// export const API_DOMAIN = 'http://localhost:4000';
export const API_DOMAIN = process.env.REQUEST_API;

export default {
  // 开发环境
  dev: {
    '/api/': {
      target: API_DOMAIN,
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  // 服务器环境
  prod: {
    '/api/': {
      target: API_DOMAIN,
      changeOrigin: true,
      pathRewrite: { '^/api/static': '/static' },
    },
  },
  // 本地树莓派环境
  'prod-local': {
    '/api/': {
      target: API_DOMAIN,
      changeOrigin: true,
      pathRewrite: { '^/api/static': '/static' },
    },
  },
};
