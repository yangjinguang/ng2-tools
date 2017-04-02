'use strict';
import {WebpackCommonConfig} from "./webpack.common";
import {Helpers} from "../utils/helpers";
import {SysConfig} from "../models/sys-config.model";

const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const ENV = process.env.NODE_ENV = process.env.ENV = 'production';
const sysConfig = new SysConfig();
const appModuleMockDir  = sysConfig.appModuleMockDir;
const tmpDir = sysConfig.tmpDir;

export const WebpackProdConfig = webpackMerge(WebpackCommonConfig, {
    devtool: 'source-map',
    entry: {
        'polyfills': Helpers.root(appModuleMockDir, 'polyfills.ts'),
        'app': Helpers.root(tmpDir, 'main-aot.ts')
    },
    output: {
        path: Helpers.root(sysConfig.distDir, 'app'),
        publicPath: './',
        filename: '[name].js',
        chunkFilename: '../[name]/[name].module.js'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loaders: [
                    'awesome-typescript-loader',
                    // 'angular2-template-loader',
                    require.resolve('../utils/angular-aot-assets-loader'),
                    'angular-router-loader?aot=true&genDir=.tmp/aot'
                    // 'angular-router-loader'
                ]
            }
        ]
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        // new webpack.optimize.UglifyJsPlugin({ // https://github.com/angular/angular/issues/10618
        //     comments: false,
        //     compress: true,
        //     mangle: true,
        //     screw_ie8: true,
        //     // mangle: {
        //     //     keep_fnames: true
        //     // }
        // }),
        new webpack.DefinePlugin({
            'process.env': {
                'ENV': JSON.stringify(ENV)
            }
        }),
        new webpack.LoaderOptionsPlugin({
            htmlLoader: {
                minimize: false // workaround for ng2
            }
        })
    ]
});