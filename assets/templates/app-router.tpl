'use strict';
import {Routes, RouterModule} from "@angular/router";
let appRouters: Routes = [
    {
        path: '__MODULE_ROUTER_PATH__',
        loadChildren: '__MODULE_PATH__#__MODULE_NAME__?chunkName=__CHUNK_NAME__',
    }
];

export const Routing = RouterModule.forRoot(appRouters, {useHash: true});
