import {Helpers} from "./helpers";

/**
 * 构造file-loader
 * @param context
 * @param filePath
 * @return {string}
 */
let fileLoaderMk = (context, filePath) => {
    let path = context.replace(Helpers.root('/.tmp/aot/.tmp/src'), '');
    filePath = filePath.replace(/\'/g, '');
    let abPath = Helpers.root('.tmp/src', path, filePath);
    return 'file-loader?name=' + '../' + path + '/' + filePath + '!' + abPath;
};

/**
 * aot模式下对html或者css里的静态文件处理
 * @param source
 * @return {any}
 */
export default function (source) {
    /*
     template里img标签的loader
     */
    source = source.replace(/(.*createRenderElement.*\'img\'.*\'src\',)(\'.*\.(png|jpe?g|gif|svg|ico)\')(.*\n)/g, (word, p1, p2, p3, p4) => {
        let req = fileLoaderMk(this.context, p2);
        return p1 + 'require(\'' + req + '\')' + p4
    });

    /*
     css里的url标签
     */
    source = source.replace(/(styles.*\[.*url\()(.*)(\).*\];)/g, (word, p1, p2, p3) => {
        let req = fileLoaderMk(this.context, p2);
        return p1 + '\'+require(\'' + req + '\')+\'' + p3
    });
    return source;
};