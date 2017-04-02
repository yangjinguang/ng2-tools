const argv = require('yargs').argv;

export class ArgvParse {
    public static get() {
        return argv;
    }
}