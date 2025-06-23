const {
  withMinaLiveWebpackConfig,
} = require("@keadex/mina-live/webpack-config");

module.exports = function override(config, env) {
  return withMinaLiveWebpackConfig()(config);
};
