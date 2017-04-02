'use strict';
import * as path from 'path'
import * as fs from 'fs-extra'
import {RouterModule} from "../models/router-module.model";

export class Helpers {
    public static root(...args: string[]): string {
        return path.join.apply(path, [path.resolve('')].concat(args));
    };

    public static cliRoot(...args: string[]): string {
        return path.join.apply(path, [path.resolve(__dirname, '../../')].concat(args));
    };

    public static uppperCaseFirstLetter(str: string): string {
        let res = str.split('');
        res[0] = res[0].toUpperCase();
        return res.join('')
    }

    public static routerFileParsing(filePath): Promise<Array<RouterModule>> {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) reject(err);
                let moduleList = [];
                let lines = data.split('\n');
                lines.forEach((line) => {
                    if (/.*loadChildren.*:.*/.test(line)) {
                        try {
                            let id = parseInt(line.split(':')[1].split('\'')[1].split('?')[1].split('=')[1].split('.')[0]);
                            let name = line.split(':')[1].split('\'')[1].split('?')[1].split('=')[1].split('.')[1];
                            moduleList.push(new RouterModule(id, name))
                        } catch (err) {
                            reject(err);
                            return;
                        }
                    }
                });
                resolve(moduleList)
            })
        })

    }
}



