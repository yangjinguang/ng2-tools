'use strict';
import {WebpackCommonConfig} from "./webpack.common";
import {Helpers} from "../utils/helpers";
import {SysConfig} from "../models/sys-config.model";

const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
// const ENV = process.env.NODE_ENV = process.env.ENV = 'production';
const sysConfig = new SysConfig();
const appModuleMockDir = sysConfig.appModuleMockDir;
const tmpDir = sysConfig.tmpDir;

export const WebpackDevConfig = webpackMerge(WebpackCommonConfig, {
    devtool: 'cheap-module-eval-source-map',
    entry: {
        polyfills: Helpers.root(appModuleMockDir, 'polyfills.ts'),
        app: [
            Helpers.root(appModuleMockDir, 'main.ts')
        ]
    },
    output: {
        path: Helpers.root('dist'),
        publicPath: 'http://localhost:4000/',
        filename: '[name].js',
        chunkFilename: '[name].chunk.js'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loaders: [
                    'awesome-typescript-loader',
                    'angular2-template-loader',
                    'angular-router-loader'
                ]
            },
            {
                test: /\.(png|jpe?g|gif)$/,
                loader: 'file-loader?name=assets/[name].[ext]'
            },
            {
                test: /\.(svg|woff|woff2|ttf|eot|ico)$/,
                loader: 'file-loader?name=assets/[name].[ext]'
            },
        ]
    },
    plugins: [
        new webpack.ContextReplacementPlugin(
            // The (\\|\/) piece accounts for path separators in *nix and Windows
            /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
            Helpers.root('./src'), // location of your src
            {} // a map of your routes
        )
    ]
});