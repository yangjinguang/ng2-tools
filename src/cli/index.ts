#!/usr/bin/env node

import {SysConfig} from "../models/sys-config.model";
import {WebpackRun} from "../webpack/webpack-run";
import {ArgvParse} from "../utils/argv-parse";

console.log(ArgvParse.get())
let webpackRun = new WebpackRun(new SysConfig, process.argv[2]);
// webpackRun.run();

