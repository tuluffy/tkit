const paths = require('./paths');

module.exports = {
  test: /\.(js|jsx|mjs)$/,
  loader: require.resolve('source-map-loader'),
  enforce: 'pre',
  include: paths.appSrc
};
