const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.blockList = [
  ...(Array.isArray(config.resolver.blockList) ? config.resolver.blockList : []),
  /node_modules\/@msgpackr-extract\/.*/,
];

config.watchFolders = [path.resolve(__dirname)];

module.exports = config;
