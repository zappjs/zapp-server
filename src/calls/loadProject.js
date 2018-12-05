import _ from 'lodash';
import Bluebird from 'bluebird';
import fs from 'fs-extra';
import glob from 'glob';
import path from 'path';
import yaml from 'js-yaml';

export default function loadProject({ body }) {
  return new Bluebird((resolve, reject) => {
    let project = {};

    glob(
      '.zapp/**/*',
      {
        cwd: body.cwd,
        dot: true,
        nodir: true
      },
      (err, items) => {
        if (err) {
          reject({
            error: 'Unable to load project files.'
          });
          return;
        }

        items.forEach((item) => {
          const itemPathParts = item.replace(/\.ya?ml$/, '').split('/');
          const itemPath = path.normalize(`${body.cwd}/${item}`);
          const itemValue = fs.readFileSync(itemPath, 'utf8');

          if (/\.ya?ml$/.test(item)) {
            project = _.set(project, itemPathParts.slice(1), yaml.safeLoad(itemValue));
          } else {
            project = _.set(project, itemPathParts.slice(1), itemValue);
          }
        });
        resolve({
          body: {
            project
          }
        });
      }
    );
  });
}
