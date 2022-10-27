module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    "babel-plugin-transform-typescript-metadata",
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    [
      "module-resolver",
      {
        root: ["."],
        extensions: [".ios.js", ".android.js", ".js", ".ts", ".tsx", ".json"],
        alias: {},
      },
    ],
  ],
};
