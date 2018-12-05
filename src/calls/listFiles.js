import _ from 'lodash';
import Bluebird from 'bluebird';
import fs from 'fs-extra';
import glob from 'glob';
import path from 'path';
import yaml from 'js-yaml';

export default function listFiles({ body }) {
  return new Bluebird((resolve, reject) => {
    let code = {};
    const codeFiles = {};
    let zappData = {};

    fs.readdir(body.cwd)
      .then((items) => {
        const mappedItems = items
          .map((itemName) => {
            const itemPath = path.normalize(`${body.cwd}/${itemName}`);

            const isDirectory = fs.statSync(itemPath).isDirectory();

            return {
              isEmpty: isDirectory && fs.readdirSync(itemPath).length === 0,
              name: itemName,
              type: isDirectory ? 'dir' : 'file'
            };
          });

        resolve({
          body: {
            items: mappedItems
          }
        });
      });

    return;

    glob(
      '**/*',
      {
        cwd: body.cwd,
        dot: true,
        nodir: true
      },
      (err, items) => {
        if (err) {
          reject({
            error: err
          });
          return;
        }

        items.forEach((item) => {
          const itemPathParts = item.replace(/\.ya?ml$/, '').split('/');
          if (/^\.zapp\//.test(item)) {
            const itemPath = path.normalize(`${body.cwd}/${item}`);
            const itemValue = fs.readFileSync(itemPath, 'utf8');
            zappData = _.set(zappData, itemPathParts.slice(1), yaml.safeLoad(itemValue));
          } else {
            code = _.set(code, itemPathParts, '');
            codeFiles[item] = '';
          }
        });
        resolve({
          body: {
            code,
            codeFiles,
            zappData
          }
        });
      }
    );
  });
}
