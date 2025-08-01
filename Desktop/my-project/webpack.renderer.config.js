const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/renderer/app/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist/renderer/app'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src/renderer'),
    },
    fallback: {
      "path": require.resolve("path-browserify"),
      "fs": false,
      "crypto": false,
      "stream": false,
      "util": false,
    }
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            compilerOptions: {
              module: 'esnext',
              target: 'es2020',
              jsx: 'react-jsx',
            },
          },
        },
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'node_modules/@remix-run'),
          path.resolve(__dirname, 'node_modules/react-router'),
          path.resolve(__dirname, 'node_modules/react-router-dom'),
          path.resolve(__dirname, 'node_modules/reselect'),
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/renderer/app/index.html',
    }),
  ],
  devServer: {
    static: [
      {
        directory: path.join(__dirname, 'dist/renderer/app'),
      },
      {
        directory: path.join(__dirname, 'public'),
        publicPath: '/',
      },
    ],
    port: 4000,
    hot: true,
    open: false,
  },
  experiments: {
    topLevelAwait: true,
  },
  ignoreWarnings: [
    /Failed to parse source map/,
    /Module not found/,
  ],
}; 