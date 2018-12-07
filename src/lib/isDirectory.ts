import * as fs from 'fs-extra';
import * as path from 'path';

export function isDirectory(location: string) {
    if (fs.lstatSync(location).isSymbolicLink()) {
        const pathPrefix = path.dirname(location);
        const pathSuffix = fs.readlinkSync(location);
        const cleanPath = path.normalize(`${pathPrefix}/${pathSuffix}`);
        return fs.lstatSync(cleanPath).isDirectory();
    }

    return fs.lstatSync(location).isDirectory();
}