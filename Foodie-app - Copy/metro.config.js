const { getDefaultConfig } = require('expo/metro-config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  config.resolver.assetExts = [...config.resolver.assetExts, 'png', 'jpg', 'jpeg', 'svg'];
  config.resolver.alias = {
    '@': __dirname,
  };

  return config;
})();
