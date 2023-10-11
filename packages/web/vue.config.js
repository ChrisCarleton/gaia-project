/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();

const { defineConfig } = require('@vue/cli-service');

const ServerUrl = process.env.GP_SERVER_BASE_URL || 'http://localhost:3020/';

const ParsedDevServerPort = parseInt(process.env.GP_WEB_SERVER_PORT);
const DevServerPort = isNaN(ParsedDevServerPort) ? 3021 : ParsedDevServerPort;

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
    port: DevServerPort,
    proxy: {
      '^/api': {
        target: ServerUrl,
      },
    },
  },

  // Required to prevent errors while building the Docker container.
  // Feel free to enhance this so that it is only false when containerized.
  parallel: false,
});
