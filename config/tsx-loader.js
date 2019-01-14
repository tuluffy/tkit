const tsImportPluginFactory = require('ts-import-plugin');

const paths = require('./paths');

module.exports = function(configFile) {
  return {
    // Compile .tsx?
    test: /\.(ts|tsx)$/,
    include: paths.appSrc,
    use: [
      {
        loader: require.resolve('ts-loader'),
        options: {
          // disable type checker - we will use it in fork plugin
          transpileOnly: true,
          configFile: configFile,
          getCustomTransformers: () => ({
            before: [
              tsImportPluginFactory({ libraryName: 'antd', libraryDirectory: 'es', style: true })
            ]
          })
        }
      }
    ]
  };
};
