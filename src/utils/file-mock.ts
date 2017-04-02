'use strict';
import {Helpers} from "./helpers";
import * as fs from 'fs-extra';
import {RouterModule} from "../models/router-module.model";


export class FileMock {
    private module: string;
    private appModuleSrc: string;
    private subModuleSrc: string;
    private tmpAppPath: string;
    private appModulePathStr: string;
    private tmpSrcPath: string;
    private routerFile: string;
    private tmpDir: string;
    private isBuild: Boolean;

    constructor(options) {
        this.module = options['module'];
        this.isBuild = options['isBuild'] || false;
        this.tmpDir = Helpers.root(options['tmpDir']);
        this.appModuleSrc = options['appModuleSrc'] ? Helpers.root(options['appModuleSrc']) : null;
        this.subModuleSrc = options['subModuleSrc'] ? Helpers.root(options['subModuleSrc']) : null;
        this.tmpSrcPath = Helpers.root(options['tmpDir'], 'src');
        this.tmpAppPath = this.tmpSrcPath + '/app';
        this.appModulePathStr = options['tmpDir'] + '/src/app';
        this.routerFile = this.tmpAppPath + '/app/app.router.ts';
        if (!fs.existsSync(this.tmpDir)) {
            fs.mkdirSync(this.tmpDir)
        }
    }

    public  aotMainMock(): Promise<any> {
        return new Promise((resolve, reject) => {
            fs.readFile(this.appModuleSrc + '/main.ts', 'utf8', (err, data) => {
                    if (err) reject();
                    let resData = data.replace(/import.*platformBrowserDynamic.*\n/, 'import {platformBrowser} from "@angular/platform-browser";\n');
                    resData = resData.replace(/import.*AppModule.*\n/, 'import {AppModuleNgFactory} from "./aot/' + this.appModulePathStr + '/app/app.module.ngfactory";\n');
                    resData = resData.replace(/^/, 'import {enableProdMode} from "@angular/core";\n');
                    resData = resData.replace(/(\n).*platformBrowserDynamic(\(.*\)\.)bootstrapModule(\(.*)AppModule(.*\))/, '$1enableProdMode();\nplatformBrowser$2bootstrapModuleFactory$3AppModuleNgFactory$4');
                    fs.writeFile(this.tmpDir + '/main-aot.ts', resData, (err) => {
                        if (err) reject();
                        console.log('main-aot.ts mock finished.');
                        resolve()
                    });
                }
            );
        })
    }

    public appModuleMock(): Promise<any> {
        fs.copySync(this.appModuleSrc, this.tmpSrcPath + '/app');
        if (this.isBuild) {
            return Promise.resolve()
        } else {
            return this.routerMock();
        }
    }

    public routerMock(): Promise<any> {
        return new Promise((resolve, reject) => {
            Helpers.routerFileParsing(this.routerFile).then((moduleList: Array<RouterModule>) => {
                let thisModuleL = moduleList.filter((module: RouterModule) => {
                    return module.path === this.module
                });
                if (thisModuleL.length <= 0) {
                    reject()
                }
                let thisModule = thisModuleL[0];
                fs.readFile(Helpers.cliRoot('./assets/templates/app-router.tpl'), 'utf8', (err, data) => {
                    if (err) reject(err);
                    let moduleName = Helpers.uppperCaseFirstLetter(thisModule.path);

                    let modulePath = this.isBuild ? '../../' + thisModule.path + '/' + thisModule.path + '/' + thisModule.path + '.module' : this.subModuleSrc + '/' + thisModule.path + '/' + thisModule.path + '.module';
                    let tmpData = data.replace(/__MODULE_NAME__/g, moduleName + 'Module');
                    tmpData = tmpData.replace(/__CHUNK_NAME__/g, thisModule.chunkName);
                    tmpData = tmpData.replace(/__MODULE_PATH__/g, modulePath);
                    tmpData = tmpData.replace(/__MODULE_ROUTER_PATH__/g, thisModule.path);
                    fs.writeFileSync(this.routerFile, tmpData, {encoding: 'utf8'});
                    resolve()
                })
            })
        })
    }

    public subModuleMock(): Promise<any> {
        if (this.module == 'app') {
            return new Promise((resolve, reject) => {
                Helpers.routerFileParsing(this.routerFile).then((moduleList: Array<RouterModule>) => {
                    fs.readFile(Helpers.cliRoot('./assets/templates/sub-module-template.tpl'), 'utf8', (err, data) => {
                        if (err) reject(err);

                        moduleList.forEach((module) => {
                            let thisModulePath = this.tmpSrcPath + '/' + module.path + '/' + module.path;
                            if (!fs.existsSync(thisModulePath)) {
                                fs.mkdirpSync(thisModulePath)
                            }
                            let moduleName = Helpers.uppperCaseFirstLetter(module.path);
                            let tmpData = data.replace(/__SUB_MODULE_NAME__/g, moduleName);
                            tmpData = tmpData.replace(/__SUB_MODULE__/g, module.path);
                            fs.writeFileSync(thisModulePath + '/' + module.path + '.module.ts', tmpData, {encoding: 'utf8'});
                            console.log(module.path + '.module.ts mock finished.');
                        });
                        resolve()
                    })
                })
            })
        } else {
            fs.copySync(this.subModuleSrc, this.tmpSrcPath + '/' + this.module);
            return this.routerMock();
        }
    }
}