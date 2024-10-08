const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const webpack = require('webpack');

const pkg = require('../package.json');

const date = (new Date()).toISOString().replace(/:\d+\.\d+Z$/, 'Z');
const banner = `
${pkg.description} v${pkg.version}
https://ryomario.github.io


Copyright 2024 - Mario
Color Picker may be freely distributed under the ${pkg.license} license.

Date: ${date}
`;
const minBanner = `Color Picker v${pkg.version} | (C) 2024 - Mario | ${pkg.license} license`;

module.exports = {
    mode: "production",

    performance: {
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
        assetFilter: (name) => {
            return name.endsWith('.js');
        },
    },

    entry: {
        "color-picker": "./src/color-picker.js",
        "color-picker.min": "./src/color-picker.js",
        "color-picker-style": "./src/assets/css/color-picker.css",
        "color-picker-style.min": "./src/assets/css/color-picker.css",
    },
    experiments: {
        outputModule: true,
    },
    output: {
        publicPath: "/",
        path: path.resolve(__dirname,"../build"),
        module: true,
        libraryTarget: 'module',
        clean: true,
    },

    module: {
        rules: [
            {
                test: /\.js$/i,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'string-replace-loader',
                        options: {
                            search: '@@VERSION@@',
                            replace: pkg.version,
                        },
                    },
                    {
                        loader: "babel-loader",
                    },
                ],
            },
            {
                test: /\.(sa|sc|c)ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [
                                    require('autoprefixer'),
                                    require('postcss-escape-generated-content-string'),
                                ],
                            },
                        },
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            implementation: require("sass"),
                            sassOptions: {
                                indentWidth: 4,
                                outputStyle: 'expanded',
                            },
                        },
                    },
                ],
            },
            {
                test: /\.(png|svg|jpe?g|gif)$/i,
                type: 'asset/resource',
                generator: {
                    filename: "images/[name][ext]",
                },
            },
            {
                test: /\.(woff|woff2|ttf|otf|eot)$/i,
                type: 'asset/resource',
                generator: {
                    filename: "font/[name][ext]",
                },
            },
        ],
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          test: /\.min\.js$/i,
          extractComments: false,
          terserOptions: {
            ecma: 8,
            compress: {
              warnings: false,
            },
          },
        }),
        new CssMinimizerPlugin({
          test: /\.min\.css$/i,
          minimizerOptions: {
            preset: [
              'default',
              {
                discardComments: { removeAll: true },
              },
            ],
          },
        }),
      ],
    },
  
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.BannerPlugin({
            banner: ({filename}) => {
                return filename.includes('.min.') ? minBanner : banner;
            },
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
        new webpack.SourceMapDevToolPlugin({
          filename: '[file].map',
          exclude: /\.min\./,
        }),
    ],
    devtool: false,
    resolve: {
        roots: [path.resolve('./src')],
        alias: {
            "@": path.resolve(__dirname,"../src/"),
        },
    },
};