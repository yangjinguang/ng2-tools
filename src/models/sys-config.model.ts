'use strict';
import {Helpers} from "../utils/helpers";

export class SysConfig {
    /*
     模块名称
     */
    public module: string;

    /*
     临时目录路径
     */
    public tmpDir: string;

    /*
     mock目录根路径
     */
    public srcDir: string;

    /*
     dist目录路径
     */
    public distDir: string;

    /*
     主模块mock路径
     */
    public appModuleMockDir: string;

    /*
     dev server host
     */
    public devServerHost: string;

    /*
     dev server port
     */
    public devServerPort: number;

    constructor() {
        const baseSysConfig = require(Helpers.cliRoot('./src/config/sys.config.json'));
        let sysConfigFile = Helpers.root('./config/sys.config.json');
        let localSysConfig = {};
        try {
            localSysConfig = require(sysConfigFile);
        } catch (err) {
        }
        const sysConfig = Object.assign(baseSysConfig, localSysConfig);
        this.module = sysConfig['module'];
        this.tmpDir = sysConfig['tmpDir'];
        this.srcDir = sysConfig['srcDir'];
        this.distDir = sysConfig['distDir'];
        this.appModuleMockDir = sysConfig['appModuleMockDir'];
        this.devServerHost = sysConfig['devServerHost'] || 'localhost';
        this.devServerPort = sysConfig['devServerPort'] || '4000';
    }
}