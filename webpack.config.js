const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const devMode = process.env.NODE_ENV !== "production";

module.exports = {
  entry: "./src/index.tsx",
  output: {
    path: __dirname + "/public/dist/",
    filename: "main.js",
    publicPath: "/dist"
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"]
  },
  mode: devMode ? "development" : "production",
  devtool: "inline-source-map",
  devServer: {
    port: 4001
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        use: {
            loader: "ts-loader",
            options: {
                transpileOnly: true,
            },
        },
        exclude: /node_modules/,
      },
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader"
      },
      {
        test: /\.pcss$/,
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: true,
              localIdentName: "[local].[hash:base64:5]",
            },
          },
          {
            loader: "postcss-loader",
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|gif|ttf|mp3|wav|tar\.gz\.obj)$/,
        loader: "file-loader",
        options: {
          name: "assets/[name].[hash:base64:5].[ext]",
        },
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
    })
  ],
};