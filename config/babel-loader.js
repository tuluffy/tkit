const paths = require('./paths');

module.exports = {
  test: /\.(js|jsx|mjs)$/,
  include: [paths.appSrc],
  loader: require.resolve('babel-loader'),
  options: {
    compact: true
  }
};
