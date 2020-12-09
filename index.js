const SystemJSPublicPathWebpackPlugin = require("systemjs-webpack-interop/SystemJSPublicPathWebpackPlugin");
const StandaloneSingleSpaPlugin = require("standalone-single-spa-webpack-plugin");
const { webpack } = require("webpack");

module.exports = (api, options) => {
  options.css.extract = false;

  const packageJsonPath = api.resolve("package.json");
  const { name } = require(packageJsonPath);
  if (!name) {
    throw Error(
      `vue-cli-plugin-single-spa: could not determine package name -- change your package json name field`
    );
  }

  api.chainWebpack((webpackConfig) => {
    webpackConfig.devServer
      .headers({
        "Access-Control-Allow-Origin": "*",
      })
      .set("disableHostCheck", true);

    webpackConfig.optimization.delete("splitChunks");

    webpackConfig.output.libraryTarget("umd");

    webpackConfig.output.devtoolNamespace(name);

    webpackConfig.set("devtool", "sourcemap");

    webpackConfig
      .plugin("SystemJSPublicPathWebpackPlugin")
      .use(SystemJSPublicPathWebpackPlugin, [
        {
          rootDirectoryLevel: 2,
          systemjsModuleName: name,
        },
      ]);

    webpackConfig
      .plugin("StandaloneSingleSpaPlugin")
      .use(StandaloneSingleSpaPlugin, [
        {
          appOrParcelName: name,
          disabled: process.env.STANDALONE_SINGLE_SPA !== "true",
        },
      ]);
  });
};
