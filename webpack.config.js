'use strict';

/* eslint no-console: "off" */
const webpackConfigs = require('./config/webpack');
const defaultConfig = 'test';

module.exports = (configName) => {

  console.log(configName)

  // 如果没有给定环境，默认dev
  const requestedConfig = configName || defaultConfig;

  // 如果给定的环境不存在，默认dev
  let LoadedConfig = defaultConfig;

  if (webpackConfigs[requestedConfig] !== undefined) {
    LoadedConfig = webpackConfigs[requestedConfig];
  } else {
    console.warn(`
      Provided environment "${configName}" was not found.
      Please use one of the following ones:
      ${Object.keys(webpackConfigs).join(' ')}
    `);
    LoadedConfig = webpackConfigs[defaultConfig];
  }

  const loadedInstance = new LoadedConfig();

  // Set the global environment
  process.env.NODE_ENV = loadedInstance.env;

  console.log(loadedInstance)
  return loadedInstance.config;
};
