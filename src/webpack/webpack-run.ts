'use strict';
import {WebpackProdConfig} from "../config/webpack.prod";
import {Helpers} from "../utils/helpers";
import {FileMock} from "../utils/file-mock";
import {SysConfig} from "../models/sys-config.model";
import {WebpackDevConfig} from "../config/webpack.dev";


const webpack = require('webpack');
const shell = require('shelljs');
const WebpackDevServer = require('webpack-dev-server');


export class WebpackRun {
    private sysConfig: SysConfig;
    private webpackConfig: any;
    private op: string;

    constructor(sysConfig, op) {
        this.sysConfig = sysConfig;
        this.op = op;
        if (op == 'build') {
            this.webpackConfig = Object.assign({}, WebpackProdConfig)
        } else {
            this.webpackConfig = Object.assign({}, WebpackDevConfig)
        }
    }

    private webpack(): void {
        webpack(this.webpackConfig, function (err, stats) {
            console.log(stats.toString({
                chunks: false, // Makes the build much quieter
                colors: true
            }))
        });
    }

    private webpackDevServer(): void {
        this.webpackConfig.entry.app.unshift('webpack-dev-server/client?http://' + this.sysConfig.devServerHost + ':' + this.sysConfig.devServerPort + '/');
        let compiler = webpack(this.webpackConfig);
        let server = new WebpackDevServer(compiler, {
            stats: {
                chunks: false, // Makes the build much quieter
                colors: true
            }
        });
        server.listen(this.sysConfig.devServerPort, this.sysConfig.devServerHost);
    }

    public build(): void {
        let fileMock = new FileMock({
            module: this.sysConfig.module,
            appModuleSrc: this.sysConfig.module == 'app' ? 'src' : 'node_modules/@Ng2Test/app-module/src',
            subModuleSrc: this.sysConfig.module == 'app' ? null : 'src',
            isBuild: true,
            tmpDir: '.tmp'
        });
        fileMock.appModuleMock()
            .then(() => fileMock.aotMainMock())
            .then(() => fileMock.subModuleMock())
            .then(() => {
                if (shell.exec('ngc -p tsconfig.json').code == 0) {
                    this.webpack()
                } else {
                    console.log('ngc error')
                }
            })
    }

    public start(): void {
        let fileMock = new FileMock({
            module: this.sysConfig.module,
            appModuleSrc: this.sysConfig.module == 'app' ? 'src' : 'node_modules/@Ng2Test/app-module/src',
            subModuleSrc: this.sysConfig.module == 'app' ? null : 'src',
            isBuild: false,
            tmpDir: '.tmp'
        });
        fileMock.appModuleMock()
            .then(() => {
                this.webpackDevServer()
            })

    }

    public run(): void {
        this.op == 'build' ? this.build() : this.start()
    }
}

