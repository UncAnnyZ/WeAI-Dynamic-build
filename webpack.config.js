const path = require("path");

const SloveCss = require("./pluging/SloveCss");

const astBuild = require("./pluging/astBuild");

module.exports = (env) => {
  const srcPath = env.srcPath;

  const status = env.status;

  return {
    entry: [path.join(srcPath, "./.weDynamic/srcBuild/index.tsx")],
    plugins: [new SloveCss(srcPath), new astBuild(srcPath, status)],
    stats: 'verbose',
    externals: {
      react: "we",
      "react-dom": "ReactDOM",
      ToXml: "ToXml",
    },
    output: {
      path: path.join(srcPath, "./.weDynamic/dist"),
      filename: "index.js",
    },
    resolve: {
      extensions: [".tsx", ".js", ".jsx"],
    },
    module: {
      rules: [
        {
          test: /\.(jsx|js|css|tsx)?$/,
          exclude: /node_modules\/(?!(@babel\/runtime))/,
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env"], ["@babel/preset-typescript"]],
            plugins: [
              "@babel/plugin-transform-react-jsx",
              [
                "babel-plugin-transform-react-jsx-to-rn-stylesheet",
                { enableMultipleClassName: false, enableCSSModule: false },
              ],
            ],
          },
        },
      ],
    },
  };
};
