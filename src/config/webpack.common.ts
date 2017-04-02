'use strict';
import {Helpers} from "../utils/helpers";
import {SysConfig} from "../models/sys-config.model";

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const sysConfig = new SysConfig();
const srcDir = sysConfig.srcDir;
const appModuleMockDir = sysConfig.appModuleMockDir;
const culModule = sysConfig.module;
const tmpDir = sysConfig.tmpDir;
import {StableChunkId} from "../utils/stable-chunk-id";


export const WebpackCommonConfig = {
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                loader: 'html-loader',
                exclude: Helpers.root(srcDir, 'index.html')
            },

            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ['to-string-loader', "css-loader?sourceMap"]
                })
            },
            {
                test: /\.(scss|css)$/,
                loaders: ['to-string-loader', 'css-loader?sourceMap', 'sass-loader'] // sass-loader not scss-loader
            }
        ]
    },

    plugins: [
        // Workaround for angular/angular#11580
        new webpack.optimize.CommonsChunkPlugin({
            name: [
                'app',
                'polyfills'
            ]
        }),
        new ExtractTextPlugin({filename: '[name].css'}),
        new webpack.HashedModuleIdsPlugin(),
        new StableChunkId(),
        new HtmlWebpackPlugin({
            template: Helpers.root(appModuleMockDir, 'index.html')
        })
    ]
};