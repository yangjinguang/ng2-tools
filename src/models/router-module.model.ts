'use strict';

export class RouterModule {
    public id: number;
    public path: string;
    public chunkName: string;

    constructor(id, name) {
        this.id = id;
        this.path = name;
        this.chunkName = id + '.' + name;
    }
}