import {SysConfig} from "../models/sys-config.model";
const sysConfig = new SysConfig();

export class StableChunkId {
    private options: any;

    constructor(options = {}) {
    }

    public apply(compiler: any): void {
        compiler.plugin("compilation", (compilation) => {
            compilation.plugin("before-chunk-ids", (chunks) => {
                chunks.forEach((chunk) => {
                    switch (chunk['name']) {
                        case 'app':
                            chunk['id'] = 0;
                            break;
                        case 'polyfills':
                            chunk['id'] = 1;
                            break;
                        default:
                            if (chunk['name'] != undefined) {
                                chunk['id'] = parseInt(chunk['name'].split('.')[0]);
                                chunk['name'] = chunk['name'].split('.')[1];
                                if (!chunk['ids']) {
                                    chunk['ids'] = [chunk['id']]
                                }
                            }
                            break;
                    }
                });
            });
        });
    }
}