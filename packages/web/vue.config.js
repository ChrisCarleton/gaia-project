/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();

const { defineConfig } = require('@vue/cli-service');

const ServerUrl = process.env.GP_SERVER_BASE_URL || 'http://localhost:3020/';

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      fallback: {
        crypto: require.resolve('crypto-browserify'),
      },
    },
  },
  devServer: {
    proxy: {
      '^/api': {
        target: ServerUrl,
      },
    },
  },
});
