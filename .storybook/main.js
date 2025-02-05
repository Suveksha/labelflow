const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

module.exports = {
  stories: [
    "../typescript/**/__stories__/*.tsx",
    "../typescript/**/*.stories.tsx",
  ],
  core: {
    builder: "webpack5",
  },
  addons: [
    "storybook-addon-next-router",
  ],
  typescript: { reactDocgen: "react-docgen" },
  webpackFinal: async (config) => {
    return {
      ...config ?? {},
      resolve: {
        ...config?.resolve ?? {},
        alias: {
          ...config?.resolve?.alias ?? {},
          "@emotion/core": "@emotion/react",
          "emotion-theming": "@emotion/react",
        },
        fallback: {
          ...config?.resolve?.fallback ?? {},
          child_process: false,
          dgram: false,
          dns: false,
          fs: false,
          http2: false,
          module: false,
          net: false,
          tls: false,
        },
      },
      plugins: [
        ...config?.plugins ?? [],
        new NodePolyfillPlugin({
          excludeAliases: ["console"]
        })
      ]
    };
  },
};
