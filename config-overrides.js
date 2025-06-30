const webpack = require('webpack');

module.exports = function override(config) {
  // Fallbacks for webpack 5
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    assert: require.resolve('assert'),
    buffer: require.resolve('buffer'),
    constants: require.resolve('constants-browserify'),
    process: require.resolve('process/browser.js'),
  };

  // Add plugins
  config.plugins = [
    ...(config.plugins || []),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser.js',
    }),
  ];

  // Add aliases
  config.resolve.alias = {
    ...(config.resolve.alias || {}),
    process: 'process/browser.js',
  };

  return config;
};