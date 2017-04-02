'use strict';

import {NgModule} from '@angular/core';
import {Component} from '@angular/core';
import {RouterModule} from "@angular/router";


@NgModule({
    imports: [
        RouterModule.forChild([
            {path: '', component: __SUB_MODULE_NAME__}
        ]),
    ],
    declarations: [
        __SUB_MODULE_NAME__,
    ],
})
export class __SUB_MODULE_NAME__Module {
}

@Component({
    selector: '__SUB_MODULE__-page',
    template: '<main></main>'
})
export class __SUB_MODULE_NAME__ {
}