import Bluebird from 'bluebird';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import uuid from 'uuid';
import yaml from 'js-yaml';

export default function saveProject({ body }) {
  return Bluebird.resolve()
    .then(() => {
      const tmpId = uuid.v4();
      const tmpDir = path.normalize(`${os.homedir()}/.zapp/tmp/${tmpId}`);

      if (fs.existsSync(tmpDir)) {
        fs.removeSync(tmpDir);
      }

      fs.mkdirpSync(tmpDir);

      [
        'engines',
        'files',
        'generators',
        'imports',
        'meta',
        'schemas',
        'specs',
        'templates'
      ].forEach((itemType) => {
        if (body.project[itemType]) {
          const items = body.project[itemType];
          Object.keys(items).forEach((itemKey) => {
            const file = path.normalize(`${tmpDir}/${itemType}/${itemKey}.yml`);
            const dir = path.dirname(file);
            if (!fs.existsSync(dir)) {
              fs.mkdirpSync(dir);
            }
            // force a-z sorting
            const newItem = {};
            Object.keys(items[itemKey])
              .sort((a, b) => {
                if (a < b) {
                  return -1;
                }
                if (a > b) {
                  return 1;
                }
                return 0;
              })
              .forEach((key) => {
                newItem[key] = items[itemKey][key];
              });
            const content = yaml.safeDump(newItem);
            fs.writeFileSync(file, content);
          });
        }
      });

      const zappDir = path.normalize(`${body.cwd}/.zapp`);

      if (fs.existsSync(zappDir)) {
        fs.removeSync(zappDir);
      }

      fs.moveSync(tmpDir, zappDir);

      return {};
    })
    .catch((error) => {
      console.log(error);
    });
}
